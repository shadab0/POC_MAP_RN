import React from 'react';
import { Polyline as GMPolyline, useGoogleMap } from '@react-google-maps/api';

const PolylineOverlay = ({ coordinates }) => {
  const map = useGoogleMap();

  if (!map) return null;

  return (
    <GMPolyline
      path={coordinates}
      options={{
        strokeColor: '#FF0000',
        strokeWeight: 4,
        geodesic: true,
      }}
    />
  );
};

export default PolylineOverlay;
