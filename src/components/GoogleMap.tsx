import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { APIProvider, InfoWindow, Map, MapMouseEvent, Marker } from '@vis.gl/react-google-maps';
import env from '../env/env';
import Header from './Header';
import MapHandler from './auto-components/MapHandler';
import IMAGES from './img/images';
import axios from 'axios';
import CrimeBox from './crime';

interface GoogleMapProps {
  onDoubleClick: (lat: number, lng: number) => void;
  onMarkerClick: (lat: number, lng: number) => void;
}

const GoogleMap = forwardRef<{ changeMapLocation: (location: google.maps.LatLngLiteral) => void }, GoogleMapProps>(({ onDoubleClick, onMarkerClick}, ref) => {
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral>({lat:42.345573 , lng:-71.098326});
  const [markers, setMarkers] = useState<Array<google.maps.LatLngLiteral>>([]);
  const [hoveredMarker, setHoveredMarker] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState<string>('');
  const [currentCenter, setCurrentCenter] = useState<google.maps.LatLngLiteral>({lat:42.345573 , lng:-71.098326});
  const mapRef = useRef<google.maps.Map | null>(null);

  useImperativeHandle(ref, () => ({
    changeMapLocation(location: google.maps.LatLngLiteral) {
      if (mapRef.current) {
        const newCenter = new google.maps.LatLng(location.lat, location.lng);
        setUserLocation(location)
        mapRef.current.panTo(newCenter);
        mapRef.current.setZoom(15);
      }
    }
  }));

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          setCurrentCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        error => {
          if (error.code === error.PERMISSION_DENIED) {
            console.error('Error getting user location: User denied Geolocation');
            alert('Location access is required to show your current location on the map. Please allow location access in your browser settings.');
          } else {
            console.error('Error getting user location:', error);
          }
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const result = await axios.get('http://localhost:3000/api/getPosts'); // Fetch all comments
        const fetchedMarkers = result.data.flatMap((item: any) => item.address.latLang);
        setMarkers(fetchedMarkers);
      } catch (error) {
        console.error('Error fetching markers:', error);
      }
    };

    fetchMarkers();
  }, []); // Fetch markers when the component mounts

  const handleDoubleClick = async (event: MapMouseEvent) => {
    const latLng = (event as any).detail?.latLng;
    if (latLng) {
      const lat = latLng.lat;
      const lng = latLng.lng;
      onDoubleClick(lat, lng);
      setMarkers((prevMarkers) => [...prevMarkers, { lat, lng }]);
    }
  };

  const handleMouseOverMarker = async (marker: { lat: number; lng: number }) => {
    setHoveredMarker(marker);
    const address = await axios.get(`http://localhost:3000/api/getLocationAddress/lng=${marker.lng}/lat=${marker.lat}`);
    setAddress(address.data.formatted_address);
  };

  const handleMouseOut = () => {
    setHoveredMarker(null);
    setAddress('');
  };

  const handleMarkerClick = (marker: { lat: number; lng: number }) => {
    onMarkerClick(marker.lat, marker.lng);
  };

  const handleDragEnd = async (map: google.maps.Map) => {
    const center = map.getCenter();
    if (center) {
      const lat = center.lat();
      const lng = center.lng();
      setCurrentCenter({ lat, lng });
      const result = await axios.get(`http://localhost:3000/api/getLocationAddress/lng=${lng}/lat=${lat}`);
      console.log(result.data.address_components[3].long_name);
    }
  };

  return (
    <>
      <APIProvider apiKey={env.GOOGLE_MAPS_API_KEY}>
        <Header onPlaceSelect={setSelectedPlace} />
        <Map
          ref={mapRef}
          className="map-class"
          defaultCenter={userLocation}
          defaultZoom={19}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
          options={{ disableDoubleClickZoom: true }}
          onDblclick={handleDoubleClick}
          onDragend={(event) => handleDragEnd(event.map)}
        >
          {hoveredMarker && (
            <InfoWindow
              options={{ pixelOffset: new google.maps.Size(0, -30) }}
              onCloseClick={handleMouseOut}
              position={{ lat: hoveredMarker.lat, lng: hoveredMarker.lng }}
            >
              <div className="p-2 text-sm leading-tight">{address}</div>
            </InfoWindow>
          )}
          {markers.map((marker, index) => (
            <div className="relative" key={index}>
              <Marker
                position={{ lat: marker.lat, lng: marker.lng }}
                icon={IMAGES.icon}
                onMouseOver={() => handleMouseOverMarker(marker)}
                onClick={() => handleMarkerClick(marker)}
              />
            </div>
          ))}
        </Map>
        <MapHandler place={selectedPlace} />
        <CrimeBox address="" lat={currentCenter.lat} lng={currentCenter.lng} />
      </APIProvider>
    </>
  );
});

export default GoogleMap;

