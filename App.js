import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator, StyleSheet, View, Text, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackHandler } from 'react-native';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [appUrl, setAppUrl] = useState(null); // Dynamically fetched app URL
  const webViewRef = useRef(null);

  // Handle the back button for Android devices
  useEffect(() => {
    const backAction = () => {
      if (webViewRef.current) {
        webViewRef.current.goBack();
        return true; // Prevent the app from closing
      }
      return false; // Allow default behavior
    };

    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  // Fetch the latest app URL on load
  useEffect(() => {
    const fetchAppUrl = async () => {
      try {
        const response = await fetch('https://converter-fkz7.onrender.com/submission', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.length > 0) {
          const latestApp = data[data.length - 1];
          setAppUrl(latestApp.app_url);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching app URL:', err);
        setError(true);
      }
    };

    fetchAppUrl();
  }, []);

  const handleWebViewError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);
    setError(true);
    Alert.alert('Error', 'Failed to load the content. Please try again later.');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Oops! Something went wrong. Please check your internet connection or try again later.
          </Text>
        </View>
      ) : appUrl ? (
        <>
          {loading && <ActivityIndicator size="large" color="#0000ff" />}
          <WebView
            ref={webViewRef}
            source={{ uri: appUrl }}
            onLoad={() => setLoading(false)}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            onError={handleWebViewError}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowFileAccess={true}
          />
        </>
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginHorizontal: 20,
  },
});
