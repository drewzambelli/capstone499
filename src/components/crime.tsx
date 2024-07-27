import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

interface CrimeProps {
    address: string;
    lat: number;
    lng: number;
  }

const CrimeBox: React.FC<CrimeProps> = ({ address, lat, ng }) => {
    const [isCrimeVisible, setIsCrimeVisible] = useState(false);

    const handleHideCrime = () => {
        const crimeContainer = document.querySelector('.crime-container');
        if (crimeContainer) {
            crimeContainer.style.opacity = '0';
        setTimeout(() => {
            setIsCrimeVisible(false); // This changes the class to hidden, applying visibility: hidden;
        }, 150); // This should match the duration of the CSS transition
        }
    };

  const handleShowCrime = () => {
    setIsCrimeVisible(true); // This will remove the 'hidden' class and add 'visible'
    setTimeout(() => {
      const crimeContainer = document.querySelector('.crime-container');
      if (crimeContainer) {
        crimeContainer.style.opacity = '1';
      }
    }, 10); // Small delay to ensure the class change has taken effect
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