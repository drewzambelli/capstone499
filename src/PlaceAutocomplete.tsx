import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { useEffect, useRef, useState } from 'react'

interface PlaceAutocompleteProps{
    onPlaceSelect : (place: google.maps.places.PlaceResult | null) =>void;
}

function PlaceAutocomplete({onPlaceSelect}: PlaceAutocompleteProps) {
    const [placeAutocomplete, setPlaceAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const places = useMapsLibrary('places');

    useEffect(()=>{
        if(!places || !inputRef.current) return;
        const options = {
            fields: ['geometry', 'name', 'formatted_address']
        };

        setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));

    }, [places])

    useEffect(()=>{
        if(!placeAutocomplete) return;
        placeAutocomplete.addListener('place_changed', ()=>{
            onPlaceSelect(placeAutocomplete.getPlace());
        });
    }, [onPlaceSelect, placeAutocomplete])

  return (
    <div className='autocomplete-container'>
        <input ref={inputRef}/>
    </div>
  )
}

export default PlaceAutocomplete