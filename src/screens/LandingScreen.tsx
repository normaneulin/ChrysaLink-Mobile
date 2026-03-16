import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import CustomButton from '../components/CustomButton';

type LandingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Landing'>;

interface Props {
  navigation: LandingScreenNavigationProp;
}

export default function LandingScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        <Image 
          source={require('../../assets/icon.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        
        <Text style={styles.title}>ChrysaLink</Text>
        <Text style={styles.subtitle}>
          Discover the intricate connections between Lepidoptera and their host plants.
        </Text>

        <View style={styles.buttonContainer}>
          <CustomButton 
            title="Explore Now" 
            onPress={() => navigation.replace('MainTabs')} // <-- Updated to show tabs
            style={styles.button}
          />
          <CustomButton 
            title="Log In / Sign Up" 
            variant="outline"
            onPress={() => navigation.navigate('Auth')} // <-- Wired to AuthScreen
            style={styles.button}
          />
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b', // zinc-950 (Dark mode background)
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#4ade80', // emerald-400
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#a1a1aa', // zinc-400
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    width: '100%',
  }
});