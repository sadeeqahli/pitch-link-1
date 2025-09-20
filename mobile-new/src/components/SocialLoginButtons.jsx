import React from 'react';
import {
  View,
  Text,
  useColorScheme,
} from 'react-native';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';

const SocialLoginButtons = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ width: '100%' }}>
      {/* Separator */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 24,
        }}
      >
        <View
          style={{
            flex: 1,
            height: 1,
            backgroundColor: isDark ? '#333333' : '#E5E7EB',
          }}
        />
        <Text
          style={{
            marginHorizontal: 16,
            fontSize: 14,
            fontFamily: 'Inter_400Regular',
            color: isDark ? '#9CA3AF' : '#6B7280',
          }}
        >
          or
        </Text>
        <View
          style={{
            flex: 1,
            height: 1,
            backgroundColor: isDark ? '#333333' : '#E5E7EB',
          }}
        />
      </View>

      {/* Informational Text */}\n      <View style={{ 
        backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: isDark ? '#333333' : '#E5E7EB',
      }}>
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Inter_500Medium',
            color: isDark ? '#FFFFFF' : '#000000',
            textAlign: 'center',
            marginBottom: 8,
          }}
        >
          Social Login Temporarily Unavailable
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontFamily: 'Inter_400Regular',
            color: isDark ? '#9CA3AF' : '#6B7280',
            textAlign: 'center',
          }}
        >
          Please use email and password to sign in or create an account
        </Text>
      </View>
    </View>
  );
};

export default SocialLoginButtons;