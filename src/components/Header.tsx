import React from 'react';
import Logo from './Logo';
import { PlaceAutocompleteClassic } from './auto-components/autocomplete-classic';

// Define the type for the props expected by the Header component
interface HeaderProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

function Header({ onPlaceSelect }: HeaderProps) {
  return (
    <div className='center-element'>
      <header className='site-header'>
        <Logo/>
        <PlaceAutocompleteClassic onPlaceSelect={onPlaceSelect} />
      </header>
    </div>
  );
}

export default Header;
