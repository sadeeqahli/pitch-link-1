import { usePathname, useRouter } from 'expo-router';
import { App } from 'expo-router/build/qualified-entry';
import React, { memo, useEffect } from 'react';
import { ErrorBoundaryWrapper } from './src/__create/SharedErrorBoundary';
import './src/__create/polyfills';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';
import './global.css';
import { ConvexProvider } from "convex/react";
import convex from './src/utils/convex';

const GlobalErrorReporter = () => {
  return null;
};

const Wrapper = memo(() => {
  return (
    <ErrorBoundaryWrapper>
      <SafeAreaProvider
        initialMetrics={{
          insets: { top: 64, bottom: 34, left: 0, right: 0 },
          frame: {
            x: 0,
            y: 0,
            width: 390,
            height: 844,
          },
        }}
      >
        <ConvexProvider client={convex}>
          <App />
        </ConvexProvider>
        <GlobalErrorReporter />
        <Toaster />
      </SafeAreaProvider>
    </ErrorBoundaryWrapper>
  );
});
const healthyResponse = {
  type: 'sandbox:mobile:healthcheck:response',
  healthy: true,
};

// Removed web-specific handshake code for mobile-only app

const CreateApp = () => {
  return (
    <>
      <Wrapper />
    </>
  );
};

export default CreateApp;