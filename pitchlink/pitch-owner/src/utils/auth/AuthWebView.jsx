import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Platform, View, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useAuthStore } from './store';

const callbackUrl = '/api/auth/token';
const callbackQueryString = `callbackUrl=${callbackUrl}`;

/**
 * This renders a WebView for authentication and handles both web and native platforms.
 */
export const AuthWebView = ({ mode, proxyURL, baseURL }) => {
  const [currentURI, setURI] = useState(`${baseURL}/account/${mode}?${callbackQueryString}`);
  const { auth, setAuth, isReady } = useAuthStore();
  const isAuthenticated = isReady ? !!auth : null;
  const iframeRef = useRef(null);
  
  // Adding error state
  const [webViewError, setWebViewError] = useState(null);
  
  useEffect(() => {
    if (Platform.OS === 'web') {
      return;
    }
    if (isAuthenticated) {
      router.back();
    }
  }, [isAuthenticated]);
  
  useEffect(() => {
    if (isAuthenticated) {
      return;
    }
    // Adding fallback for baseURL
    const baseURLEffective = baseURL || 'http://localhost:8081';
    setURI(`${baseURLEffective}/account/${mode}?${callbackQueryString}`);
  }, [mode, baseURL, isAuthenticated]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.addEventListener) {
      return;
    }
    const handleMessage = (event) => {
      // Verify the origin for security
      // Adding fallback for when EXPO_PUBLIC_PROXY_BASE_URL is not set
      const expectedOrigin = process.env.EXPO_PUBLIC_PROXY_BASE_URL || 'http://localhost:8081';
      if (event.origin !== expectedOrigin) {
        return;
      }
      if (event.data.type === 'AUTH_SUCCESS') {
        setAuth({
          jwt: event.data.jwt,
          user: event.data.user,
        });
      } else if (event.data.type === 'AUTH_ERROR') {
        console.error('Auth error:', event.data.error);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [setAuth]);

  if (Platform.OS === 'web') {
    const handleIframeError = () => {
      console.error('Failed to load auth iframe');
      setWebViewError(new Error('Failed to load authentication interface'));
    };

    // Adding fallback for proxyURL
    const proxyURLEffective = proxyURL || 'http://localhost:8081';
    
    return (
      <>
        <iframe
          ref={iframeRef}
          title="Authentication"
          src={`${proxyURLEffective}/account/${mode}?callbackUrl=/api/auth/expo-web-success`}
          style={{ width: '100%', height: '100%', border: 'none' }}
          onError={handleIframeError}
        />
        {webViewError && (
          <View style={{ padding: 20, backgroundColor: '#f8d7da', borderColor: '#f5c6cb', borderWidth: 1 }}>
            <Text style={{ color: '#721c24' }}>Authentication interface failed to load. Please try again later.</Text>
          </View>
        )}
      </>
    );
  }
  return (
    <WebView
      sharedCookiesEnabled
      source={{
        uri: currentURI,
      }}
      headers={{
        'x-createxyz-project-group-id': process.env.EXPO_PUBLIC_PROJECT_GROUP_ID || 'default-group-id',
        host: process.env.EXPO_PUBLIC_HOST || 'localhost',
        'x-forwarded-host': process.env.EXPO_PUBLIC_HOST || 'localhost',
        'x-createxyz-host': process.env.EXPO_PUBLIC_HOST || 'localhost',
      }}
      onShouldStartLoadWithRequest={(request) => {
        // Adding fallback for baseURL
        const baseURLEffective = baseURL || 'http://localhost:8081';
        const proxyURLEffective = proxyURL || 'http://localhost:8081';
        
        if (request.url === `${baseURLEffective}${callbackUrl}`) {
          fetch(request.url).then(async (response) => {
            response.json().then((data) => {
              setAuth({ jwt: data.jwt, user: data.user });
            });
          });
          return false;
        }
        if (request.url === currentURI) return true;

        // Add query string properly by checking if URL already has parameters
        const hasParams = request.url.includes('?');
        const separator = hasParams ? '&' : '?';
        const newURL = request.url.replaceAll(proxyURLEffective, baseURLEffective);
        if (newURL.endsWith(callbackUrl)) {
          setURI(newURL);
          return false;
        }
        setURI(`${newURL}${separator}${callbackQueryString}`);
        return false;
      }}
      onError={(error) => {
        console.error('WebView error:', error);
        setWebViewError(error);
      }}
      style={{ flex: 1 }}
    />
  );
};