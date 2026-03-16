import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, SafeAreaView, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

export default function RelationshipGraphScreen() {
  const [isLoading, setIsLoading] = useState(true);

  // NOTE: Replace this with your actual deployed Vercel/Netlify URL
  // Point it directly to the route where your graph lives (e.g., /relationship or /explore)
  const WEB_APP_URL = process.env.EXPO_PUBLIC_WEB_URL || 'https://chrysalink.vercel.app/relationship';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="git-network" size={24} color="#4ade80" />
        <Text style={styles.headerTitle}>Interaction Network</Text>
      </View>
      
      <View style={styles.webviewContainer}>
        {isLoading && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#4ade80" />
            <Text style={styles.loaderText}>Loading visualizer...</Text>
          </View>
        )}
        
        <WebView 
          source={{ uri: WEB_APP_URL }}
          style={styles.webview}
          onLoadEnd={() => setIsLoading(false)}
          // These injects help hide the web navbar/footer if you only want the graph to show
          injectedJavaScript={`
            document.querySelector('nav')?.style.setProperty('display', 'none', 'important');
            document.querySelector('footer')?.style.setProperty('display', 'none', 'important');
            true;
          `}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b', // zinc-950
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
    gap: 8,
  },
  headerTitle: {
    color: '#f4f4f5',
    fontSize: 20,
    fontWeight: 'bold',
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: '#09090b',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#09090b',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loaderText: {
    color: '#a1a1aa',
    marginTop: 12,
    fontSize: 14,
  }
});