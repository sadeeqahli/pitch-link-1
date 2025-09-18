# Social Login Configuration Guide

This guide provides step-by-step instructions for configuring Google and Apple Sign-in for the PitchLink application.

## Google OAuth Setup

### 1. Google Cloud Console Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing project
3. Enable the Google+ API and Google Identity API:
   - Go to "APIs & Services" > "Library"
   - Search for and enable "Google+ API"
   - Search for and enable "Google Identity API"

### 2. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Configure the consent screen if prompted
4. Create credentials for each platform:

#### For Web Application:
- Application type: Web application
- Name: PitchLink Web
- Authorized JavaScript origins: 
  - `http://localhost:3000` (development)
  - `https://yourdomain.com` (production)
- Authorized redirect URIs:
  - `http://localhost:3000/api/auth/callback/google` (development)
  - `https://yourdomain.com/api/auth/callback/google` (production)

#### For Android:
- Application type: Android
- Name: PitchLink Android
- Package name: Your app's package name (from app.json)
- SHA-1 certificate fingerprint: Your debug/release keystore SHA-1

#### For iOS:
- Application type: iOS
- Name: PitchLink iOS
- Bundle ID: Your app's bundle identifier (from app.json)

### 3. Environment Variables

Add the following environment variables to your `.env` files:

#### Mobile (.env in mobile directory):
```env
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_web_client_id_here
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your_ios_client_id_here
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your_android_client_id_here
```

#### Web (.env in web directory):
```env
GOOGLE_CLIENT_ID=your_web_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

## Apple Sign-in Setup

### 1. Apple Developer Account Requirements

1. You need an active Apple Developer account ($99/year)
2. Sign in to [Apple Developer Console](https://developer.apple.com/)

### 2. Configure App ID

1. Go to "Certificates, Identifiers & Profiles"
2. Select "Identifiers" > "App IDs"
3. Create or edit your App ID
4. Enable "Sign In with Apple" capability
5. Configure the Sign In with Apple settings

### 3. Create Service ID (for Web)

1. Go to "Certificates, Identifiers & Profiles"
2. Select "Identifiers" > "Services IDs"
3. Create a new Service ID
4. Enable "Sign In with Apple"
5. Configure domains and redirect URLs:
   - Domains: `localhost`, `yourdomain.com`
   - Redirect URLs: 
     - `http://localhost:3000/api/auth/callback/apple`
     - `https://yourdomain.com/api/auth/callback/apple`

### 4. Create Private Key

1. Go to "Certificates, Identifiers & Profiles"
2. Select "Keys"
3. Create a new key with "Sign In with Apple" enabled
4. Download the .p8 key file
5. Note the Key ID

### 5. Mobile Configuration

Add to your `app.json` in the mobile directory:

```json
{
  "expo": {
    "ios": {
      "entitlements": {
        "com.apple.developer.applesignin": ["Default"]
      }
    }
  }
}
```

### 6. Web Environment Variables

Add to your web `.env` file:

```env
APPLE_ID=your_service_id_here
APPLE_TEAM_ID=your_team_id_here
APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_content_here\n-----END PRIVATE KEY-----"
APPLE_KEY_ID=your_key_id_here
```

## Additional Configuration

### Mobile App Configuration

1. For Android, add the SHA-1 fingerprint of your app signing certificate to Google Console
2. For iOS, ensure your Bundle ID matches what's configured in Apple Developer Console
3. Test on physical devices for Apple Sign-in (simulator won't work)

### Web App Configuration

1. Ensure your domain is properly configured in both Google and Apple consoles
2. Update CORS settings if needed
3. Test in incognito/private browsing mode to verify functionality

## Testing

### Mobile Testing
1. Run the app on a physical device (required for Apple Sign-in)
2. Test both Google and Apple Sign-in flows
3. Verify user data is properly stored and retrieved

### Web Testing
1. Test in different browsers
2. Verify redirect flows work correctly
3. Test both sign-in and sign-up scenarios

## Troubleshooting

### Common Issues

1. **Google Sign-in fails**: 
   - Check SHA-1 fingerprints for Android
   - Verify client IDs are correctly configured
   - Ensure Google Play Services are available

2. **Apple Sign-in not available**:
   - Only works on iOS 13+ and macOS 10.15+
   - Requires physical device for mobile testing
   - Check entitlements are properly configured

3. **Web redirect issues**:
   - Verify callback URLs are exact matches
   - Check CORS configuration
   - Ensure environment variables are loaded

### Debug Steps

1. Check browser developer tools for network errors
2. Verify environment variables are loaded correctly
3. Test with simplified OAuth flows first
4. Check provider documentation for updates

## Security Considerations

1. Keep client secrets secure and never expose them in client-side code
2. Use HTTPS in production
3. Implement proper session management
4. Validate tokens server-side
5. Implement logout functionality that clears all sessions

## Next Steps

After configuration:
1. Test the complete authentication flow
2. Implement user profile management
3. Add error handling for edge cases
4. Consider implementing account linking for users with multiple sign-in methods
5. Add analytics to track sign-in success rates