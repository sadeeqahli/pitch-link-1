import React from 'react';
import { render } from '@testing-library/react-native';
import MapComponent from '../components/MapComponent';

// Mock react-native-maps
jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');
  
  return {
    __esModule: true,
    default: {
      MapView: ({ children, ...props }) => <View testID="map-view" {...props}>{children}</View>,
      Marker: ({ children, ...props }) => <View testID="map-marker" {...props}>{children}</View>,
      PROVIDER_GOOGLE: 'google',
    },
  };
});

// Mock color scheme
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => () => 'light');

describe('MapComponent', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<MapComponent />);
    
    // Check if map view is rendered
    expect(getByTestId('map-view')).toBeTruthy();
  });
  
  it('renders map markers', () => {
    const { getAllByTestId } = render(<MapComponent />);
    
    // Check if markers are rendered
    const markers = getAllByTestId('map-marker');
    expect(markers.length).toBeGreaterThan(0);
  });
});