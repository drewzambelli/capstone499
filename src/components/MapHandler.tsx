import { useMap } from '@vis.gl/react-google-maps';
import React, { useEffect } from 'react'

interface MapHandlerProps{
    place:  google.maps.places.PlaceResult | null;
}

function MapHandler(place: MapHandlerProps) {
    const map = useMap();
    
    useEffect(() =>{
        if(!map || !place) return;
        if(place.place?.geometry?.viewport){
            map.fitBounds(place.place.geometry?.viewport)
        }
        
    }, [map, place])

  return null;
}

export default MapHandler