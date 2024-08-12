import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';

interface CrimeProps {
  address: string; //may prove to be unecessary
  lat: number;
  lng: number;
}

const CrimeBox: React.FC<CrimeProps> = ({ address, lat, lng }) => {
  const [isCrimeVisible, setIsCrimeVisible] = useState(false);
  const [borough, setBorough] = useState('');
  const [crimeStats, setCrimeStats] = useState<React.ReactElement>(<></>);

  //Key function for Crime Stats to work: this is where we retrieve the borough from Google Maps.
  //The 'sublocality_level_1' is the borough name.
  //NOTE: Sometimes, this may error because, for whatever reason, for Brooklyn and Staten Island,
  //Google will occassionally have alternate names/spellings stored for 'sublocality_level_1'
  //E.G. Instead of returning 'Brooklyn', Google will return 'Kings County' or instead of 
  //'Staten Island', it will return 'Staten_Island' - it's not wrong, just may screw up our code
  useEffect(() => {
    const getBoroughFromLatLng = async () => {
      try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`);
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

  //Conversion, see note above for possible issue
  const boroughToFileMap = {
    "The Bronx": "../../public/bronx.csv",
    "Brooklyn": "../../public/brooklyn.csv",
    "Manhattan": "../../public/manhattan.csv",
    "Queens": "../../public/queens.csv",
    "Staten Island": "../../public/staten_island.csv"
  };
  
  //Translation of actual Excels to the website
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
    const crimeContainer = document.querySelector('.crime-container') as HTMLElement;
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
      const crimeContainer = document.querySelector('.crime-container') as HTMLElement;
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
