// Removed deprecated deep import from 'react-native/Libraries/Core/ExceptionsManager'
// Custom error handling can be implemented using other approaches if needed

import 'react-native-url-polyfill/auto';
import './src/__create/polyfills';
global.Buffer = require('buffer').Buffer;

import 'expo-router/entry';
import { SplashScreen } from 'expo-router';
import { App } from 'expo-router/build/qualified-entry';
import { type ReactNode, memo, useEffect } from 'react';
import { AppRegistry, LogBox, SafeAreaView, Text, View } from 'react-native';
import { serializeError } from 'serialize-error';
import { DeviceErrorBoundaryWrapper } from './src/__create/DeviceErrorBoundary';
import { ErrorBoundaryWrapper, SharedErrorBoundary } from './src/__create/SharedErrorBoundary';

if (__DEV__) {
  LogBox.ignoreAllLogs();
  LogBox.uninstall();
  function WrapperComponentProvider({
    children,
  }: {
    children: ReactNode;
  }) {
    return <DeviceErrorBoundaryWrapper>{children}</DeviceErrorBoundaryWrapper>;
  }

  AppRegistry.setWrapperComponentProvider(() => WrapperComponentProvider);
  AppRegistry.registerComponent('main', () => App);
}