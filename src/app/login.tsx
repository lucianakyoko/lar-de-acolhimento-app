import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const loginSchema = z.object({
  username: z.string().min(1, 'Usuário é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', data);
      const accessToken = response.data.access_token;

      if (accessToken) {
        await useAuthStore.getState().login(accessToken);
        router.replace('/(app)');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Credenciais inválidas';
      Alert.alert('Erro', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <StatusBar barStyle="dark-content" />

      {/* Fundo com ondas melhoradas */}
      <View style={styles.background}>
        <LinearGradient
          colors={['#E8F5F0', '#A8D5C9']}
          style={StyleSheet.absoluteFill}
        />
        
        {/* Onda superior */}
        <View style={styles.waveTop1} />
        
        {/* Onda inferior principal */}
        <View style={styles.waveBottom} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formWrapper}>
          <View style={styles.logoContainer}>
            <Image source={require('@/assets/logo.png')} style={styles.logo} />
          </View>

          <Text style={styles.welcomeText}>Bem-vindo(a)!</Text>
          <Text style={styles.subtitle}>Faça login para continuar</Text>

          {/* Campo Usuário */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={24} color="#555" />
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Usuário"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          </View>
          {errors.username && <Text style={styles.errorText}>{errors.username.message}</Text>}

          {/* Campo Senha */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={24} color="#555" />
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Senha"
                  secureTextEntry={!showPassword}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons 
                name={showPassword ? "eye-outline" : "eye-off-outline"} 
                size={24} 
                color="#555" 
              />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

          {/* Botão Entrar */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="large" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Patinhas Decorativas */}
      <Ionicons name="paw" size={54} color="#5B7552" style={[styles.paw, styles.paw1]} />
      <Ionicons name="paw" size={26} color="#5B7552" style={[styles.paw, styles.paw2]} />
      <Ionicons name="paw" size={58} color="#5B7552" style={[styles.paw, styles.paw3]} />
      <Ionicons name="paw" size={24} color="#5B7552" style={[styles.paw, styles.paw4]} />
      <Ionicons name="paw" size={30} color="#5B7552" style={[styles.paw, styles.paw5]} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },

  waveTop1: {
    position: 'absolute',
    top: -20,
    left: -20,
    right: -60,
    height: 220,
    backgroundColor: '#5B7552',
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 140,
    opacity: 0.22,
  },

  waveBottom: {
    position: 'absolute',
    bottom: -80,
    left: -40,
    right: -40,
    height: 320,
    backgroundColor: '#5B7552',
    borderTopLeftRadius: 180,
    borderTopRightRadius: 150,
    opacity: 0.92,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },

  formWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderRadius: 28,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 15,
  },

  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 155,
    height: 176,
    borderRadius: 85.5,
  },

  welcomeText: {
    fontSize: 27,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 32,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 60,
    width: '100%',
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },

  errorText: {
    color: '#e74c3c',
    fontSize: 13,
    alignSelf: 'flex-start',
    marginLeft: 8,
    marginBottom: 8,
  },

  loginButton: {
    backgroundColor: '#5B7552',
    width: '100%',
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowColor: '#5B7552',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  paw: {
    position: 'absolute',
    zIndex: 1,
    opacity: 0.35,
  },
  paw1: { top: '15%', left: '12%', transform: [{ rotate: '-35deg' }] },
  paw2: { top: '22%', right: '15%', transform: [{ rotate: '28deg' }] },
  paw3: { top: '42%', right: '10%', transform: [{ rotate: '20deg' }] },
  paw4: { bottom: '25%', right: '8%', transform: [{ rotate: '-40deg' }] },
  paw5: { top: '35%', left: '18%', transform: [{ rotate: '15deg' }] },
});