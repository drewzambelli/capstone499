import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import env from '../env/env';

interface CrimeProps {
  address: string;
  lat: number;
  lng: number;
}

const CrimeBox: React.FC<CrimeProps> = ({ address, lat, lng }) => {
  const [isCrimeVisible, setIsCrimeVisible] = useState(false);
  const [borough, setBorough] = useState('');
  const [crimeStats, setCrimeStats] = useState('');

  useEffect(() => {
    const getBoroughFromLatLng = async () => {
      try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${env.GOOGLE_MAPS_API_KEY}`);
        const addressComponents = response.data.results[0].address_components;
        const foundBorough = addressComponents.find(component => component.types.includes('sublocality_level_1'))?.long_name || 'Borough Not Found';
        setBorough(foundBorough);
        fetchCrimeStats(foundBorough);
      } catch (error) {
        console.error('Error fetching borough:', error);
      }
    };

    if (lat && lng) {
      getBoroughFromLatLng();
    }
  }, [lat, lng]);

  const boroughToFileMap = {
    "The Bronx": "../../public/bronx.csv",
    "Brooklyn": "../../public/brooklyn.csv",
    "Manhattan": "../../public/manhattan.csv",
    "Queens": "../../public/queens.csv",
    "Staten Island": "../../public/staten_island.csv"
  };
  
  const fetchCrimeStats = (boroughName) => {
    const path = boroughToFileMap[boroughName];
    if (!path) {
      setCrimeStats(<div>Borough not found or not supported.</div>);
      return;
    }
  
    Papa.parse(path, {
      download: true,
      header: false,
      complete: function(results) {
        const formattedStats = results.data.map((row, index) => {
          if (row && row.length > 1) {
            return <div className='crime-stat' key={index}>
              <span className='crime-name'>{row[0]}</span> 
              <span className='crime-freq'>{row[1]}</span>
            </div>;  // Each stat in its own div
          }
          return null;
        }).filter(Boolean);  // Filter out any nulls from rows that didn't meet the condition
  
        setCrimeStats(formattedStats);
      },
      error: function(error) {
        console.error('Error parsing CSV:', error);
        setCrimeStats(<div>Error loading crime statistics.</div>);
      }
    });
  };
  

  const handleHideCrime = () => {
    const crimeContainer = document.querySelector('.crime-container');
    if (crimeContainer) {
      crimeContainer.style.opacity = '0';
      setTimeout(() => {
        setIsCrimeVisible(false);
      }, 150);
    }
  };

  const handleShowCrime = () => {
    setIsCrimeVisible(true);
    setTimeout(() => {
      const crimeContainer = document.querySelector('.crime-container');
      if (crimeContainer) {
        crimeContainer.style.opacity = '1';
      }
    }, 10);
  };

  return (
    <div>
      <div className={`crime-container ${isCrimeVisible ? 'visible' : 'hidden'}`}>
        <div className='crime-header'>
          <div className='header-text'>
            Borough Stats
            <button className='hide-crime-button' onClick={handleHideCrime}>
              <i className='bi bi-x-circle'></i>
            </button>
          </div>
        </div>
        <div className='crime-box'>
          <div className='borough-name'>
            {borough}
          </div>
          <div className='crime-statistics'>
            {crimeStats.length > 0 ? crimeStats : "Crime Statistics Here"}
          </div>
        </div>
      </div>
      {!isCrimeVisible && (
        <button className='show-crime-button' onClick={handleShowCrime}>
          <i className='bi bi-bar-chart-fill'></i>
        </button>
      )}
    </div>
  );
};

export default CrimeBox;
