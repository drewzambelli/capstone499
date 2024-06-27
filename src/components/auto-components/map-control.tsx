import React from 'react';
import {ControlPosition, MapControl} from '@vis.gl/react-google-maps';

import { PlaceAutocompleteClassic } from './autocomplete-classic';

import { AutocompleteMode } from '../../App';
type CustomAutocompleteControlProps = {
  controlPosition: ControlPosition;
  selectedAutocompleteMode: AutocompleteMode;
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
};

export const CustomMapControl = ({
  controlPosition,
  selectedAutocompleteMode,
  onPlaceSelect
}: CustomAutocompleteControlProps) => {
  const {id} = selectedAutocompleteMode;

  return (
    <MapControl position={controlPosition}>
      <div className="autocomplete-control w-full">
        {id === 'classic' && (
          <PlaceAutocompleteClassic onPlaceSelect={onPlaceSelect} />
        )}

      </div>
    </MapControl>
  );
};
