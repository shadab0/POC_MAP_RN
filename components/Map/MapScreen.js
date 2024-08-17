import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import MapView, { Marker, Polyline, MarkerClusterer, LatLng } from './ImportMapView';
import PolylineOverlay from './PolylineOverlay';

const ORIGIN = { latitude: 19.141658, longitude: 72.931386 }; 
const DESTINATION = { latitude: 18.994532, longitude:  72.843364 }; 


const MapScreen = () => {
  const [routeCoords, setRouteCoordinates] = useState([]);
  const [region, setRegion] = useState(null);
  const mapRef = useRef(null);

  // Using osrm Direction API for free usage, as Google Direction API requires billing account to work
  useEffect(() => {
    const getRoute = async () => {
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${ORIGIN.longitude},${ORIGIN.latitude};${DESTINATION.longitude},${DESTINATION.latitude}?overview=full&geometries=geojson`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log(response);
        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
          const coordinates = data.routes[0].geometry.coordinates.map(([lng, lat]) => ({
            latitude: lat,
            longitude: lng,
          }));
          setRouteCoordinates(coordinates);

          if (mapRef.current && coordinates.length > 0) {
            mapRef.current.fitToCoordinates(coordinates, {
              edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
              animated: true,
            });
          }
        } else {
          console.error('No routes found in the API response');
        }
      } catch (error) {
        console.error('Error fetching route:', error);
      }
    };

    getRoute();
  }, []);

  const loadingFallback = (
    <View>
      <Text>Loading</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === 'web' ? 'google' : undefined}
        initialRegion={{
          latitude: (ORIGIN.latitude + DESTINATION.latitude) / 2,
          longitude: (ORIGIN.longitude + DESTINATION.longitude) / 2,
          latitudeDelta: 1.0,
          longitudeDelta: 1.0,
        }}
        onRegionChange={setRegion}
        loadingFallback={loadingFallback}
        /** Works without key on Dev Mode **/
        //googleMapsApiKey={Platform.OS === 'web' ? "AIzaSyA_92Br8ihF6mdprniHOojAMkcShoQq2h4" : undefined} 
      >


          {Platform.OS === 'web' && routeCoords.length > 0 && (
            <>
              <MarkerClusterer region={region}>
                {/* Hidding title of Origin and Destination Markers */}
                <Marker coordinate={ORIGIN} 
                        // title="Mumbai" 
                />
                <Marker coordinate={DESTINATION} 
                        // title="Pune" 
                />
              </MarkerClusterer>

              {/* Created Custom Polyline component to render Path on Map using @react-google-maps/api, as @teovilla/react-native-web-maps Polyline not working */}
              <PolylineOverlay coordinates={routeCoords.map(coord => ({
                lat: coord.latitude,
                lng: coord.longitude,
              }))} />
            </>
          )}

          {Platform.OS !== 'web' && (
            <>
              {/* Hidding title of Origin and Destination Markers */}
              <Marker coordinate={ORIGIN} 
                      // title="Mumbai" 
              />
              <Marker coordinate={DESTINATION} 
                      // title="Pune" 
              />
              <Polyline
                coordinates={routeCoords}
                strokeColor="#FF0000"
                strokeWidth={4}
              />
            </>
          )}  
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  map: {
    flex: 1,
  },
});

export default MapScreen;
