import React, { useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import env from '../env/env';
import GoogleMap from "./components/GoogleMap";

interface CrimeProps {
    address: string;
    lat: number;
    lng: number;
  }

const CrimeBox: React.FC<CrimeProps> = ({ address, lat, lng }) => {
    const [isCrimeVisible, setIsCrimeVisible] = useState(false);
    const [crimeData, setCrimeData] = useState<any[]>([]);

    const handleHideCrime = () => {
        const crimeContainer = document.querySelector('.crime-container');
        if (crimeContainer) {
            crimeContainer.style.opacity = '0';
        setTimeout(() => {
            setIsCrimeVisible(false); // This changes the class to hidden, applying visibility: hidden;
        }, 150); // This should match the duration of the CSS transition
        }
    };

    const handleShowCrime = async () => { // <-- Marked as async
      console.log(`handleShowCrime called with coordinates: lat=${lat}, lng=${lng}`);
      
      setIsCrimeVisible(true); // This will remove the 'hidden' class and add 'visible'
      setTimeout(() => {
          const crimeContainer = document.querySelector('.crime-container');
          if (crimeContainer) {
              crimeContainer.style.opacity = '1';
          }
      }, 10); // Small delay to ensure the class change has taken effect

      const borough = await determineBorough(lat, lng);
      const data = await fetchCrimeData(borough);
      setCrimeData(data);
  };

//   const determineBorough = async (lat: number, lng: number): Promise<string> => {
//     console.log(`Calling determineBorough with coordinates: lat=${lat}, lng=${lng}`);
//     try {
//         const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${env.GOOGLE_MAPS_API_KEY}`);
//         console.log('Full response:', response); // Log the full response object for debugging
//         console.log('Response data:', response.data); // Log just the response data
//         if (response.data.results && response.data.results.length > 0) {
//             const addressComponents = response.data.results[0].address_components;
//             for (const component of addressComponents) {
//                 if (component.types.includes('administrative_area_level_2')) {
//                     console.log(`Borough: ${component.long_name}`); // Log the borough name
//                     return component.long_name;
//                 }
//             }
//         } else {
//           console.error(`No results found for the given coordinates: lat=${lat}, lng=${lng}`);
//         }
//     } catch (error) {
//         console.error('Error fetching borough data:', error);
//     }
//     return 'Unknown';
// };

//SUPER SHITTY WAY TO DETERMINE BOROUGH
const boroughs = [
  { lat: 40.7128, lng: -74.0060, borough: 'Manhattan' },
  { lat: 40.6782, lng: -73.9442, borough: 'Brooklyn' },
  { lat: 40.7282, lng: -73.7949, borough: 'Queens' },
  { lat: 40.5795, lng: -74.1502, borough: 'Staten Island' },
  { lat: 40.8448, lng: -73.8648, borough: 'Bronx' },
];

const determineBorough = (lat, lng) => {
  let nearest = boroughs[0];
  let minDist = Infinity;

  for (const b of boroughs) {
      const dist = Math.sqrt(Math.pow(lat - b.lat, 2) + Math.pow(lng - b.lng, 2));
      if (dist < minDist) {
          nearest = b;
          minDist = dist;
      }
  }

  console.log(`Borough: ${nearest.borough}`);
  return nearest.borough;
};

const fetchCrimeData = async (borough: string): Promise<any[]> => {
    try {
        const fileName = `${borough}.xlsx`;
        const response = await fetch(`/excel/${fileName}`);
        if (response.ok) {
            const arrayBuffer = await response.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            return jsonData;
        } else {
            console.error('Error fetching the Excel file.');
        }
    } catch (error) {
        console.error('Error reading the Excel file:', error);
    }
    return [];
};

  
  return (
    <div>
      <div className={`crime-container ${isCrimeVisible ? 'visible' : 'hidden'}`}>
        <div className = 'crime-header'>
          <div className = 'header-text'>
            Borough Stats
            <button className='hide-crime-button' onClick={handleHideCrime}>
                  <i className='bi bi-x-circle'></i>
            </button>
          </div>
        </div>
        <div className = 'crime-box'> 
        {crimeData.map((item, index) => (
                        <div key={index}>
                            {/* Render crime data here */}
                            {JSON.stringify(item)}
                        </div>
                    ))}
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