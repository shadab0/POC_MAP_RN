import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapScreen from './components/Map/MapScreen';

const location = {
  latitude: 37.7749, 
  longitude: -122.4194,
};

export default function App() {
  return (
    <View style={styles.container}>
      <MapScreen location={location} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
