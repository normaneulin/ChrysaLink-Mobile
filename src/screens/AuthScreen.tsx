import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform,
  Alert
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { authService } from '../services/auth-service';
import CustomButton from '../components/CustomButton';

// We need to add 'Auth' to your AppNavigator's RootStackParamList later!
type AuthScreenNavigationProp = NativeStackNavigationProp<any>;

interface Props {
  navigation: AuthScreenNavigationProp;
}

export default function AuthScreen({ navigation }: Props) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password || (!isLogin && !name)) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    let response;

    if (isLogin) {
      response = await authService.signIn({ email, password });
    } else {
      // Basic username generation from name for now
      const username = name.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 1000);
      response = await authService.signUp({ email, password, name, username });
    }

    setIsLoading(false);

    if (response.error) {
      Alert.alert('Authentication Failed', response.error);
    } else {
      // The App.tsx listener will catch the session change, but we can force redirect here too
      navigation.replace('MainTabs');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <Text style={styles.title}>{isLogin ? 'Welcome Back' : 'Join ChrysaLink'}</Text>
          <Text style={styles.subtitle}>
            {isLogin ? 'Log in to continue exploring.' : 'Create an account to start contributing.'}
          </Text>

          <View style={styles.form}>
            {!isLogin && (
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#a1a1aa"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            )}
            
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#a1a1aa"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#a1a1aa"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <CustomButton 
              title={isLogin ? 'Log In' : 'Sign Up'} 
              onPress={handleAuth}
              isLoading={isLoading}
              style={styles.submitBtn}
            />

            <CustomButton 
              title={isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"} 
              variant="outline"
              onPress={() => setIsLogin(!isLogin)}
              disabled={isLoading}
            />
            
            {/* Cancel/Back button */}
            <CustomButton 
              title="Go Back" 
              variant="outline"
              onPress={() => navigation.goBack()}
              style={{ marginTop: 12, borderColor: '#3f3f46' }}
              textStyle={{ color: '#a1a1aa' }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090b' },
  keyboardView: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#4ade80', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#a1a1aa', marginBottom: 32, textAlign: 'center' },
  form: { width: '100%', gap: 16 },
  input: {
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a',
    borderRadius: 8,
    padding: 16,
    color: '#f4f4f5',
    fontSize: 16,
  },
  submitBtn: { marginTop: 8 }
});