import React, {useRef, useEffect, useState} from 'react';
import {useMapsLibrary} from '@vis.gl/react-google-maps';
import { Button, Form, InputGroup } from 'react-bootstrap';

interface Props {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

// This is an example of the classic "Place Autocomplete" widget.
// https://developers.google.com/maps/documentation/javascript/place-autocomplete
export const PlaceAutocompleteClassic = ({onPlaceSelect}: Props) => {
  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary('places');

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ['geometry', 'name', 'formatted_address']
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener('place_changed', () => {
      onPlaceSelect(placeAutocomplete.getPlace());
    });
  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <div className='stickyflex justify-center items-center '>
      <InputGroup className='lg:flex mb-3 h-[7vh] w-[15vw] pt-10'>
        <InputGroup.Text className=' bg-grey text-light' id="location">🔎</InputGroup.Text>
        <Form.Control
          className='bg-dark text-light'
          placeholder='Enter Location'
          aria-label='Location'
          aria-describedby='Location'
          ref={inputRef}
          />
         {/* <Button variant="dark">Enter</Button> */}
      </InputGroup>
    </div>
  );
};
