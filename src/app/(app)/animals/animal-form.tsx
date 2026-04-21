// app/(app)/animals/animal-form.tsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

import { useCreateAnimal } from '@/hooks/useCreateAnimal';
import { useUpdateAnimal } from '@/hooks/useUpdateAnimal';

import Input from '@/components/Input';
import Select from '@/components/Select';
import SwitchInput from '@/components/SwitchInput';
import ImagePickerGrid from '@/components/ImagePickerGrid';
import NeedsListManager from '@/components/NeedsListManager';
import Button from '@/components/Button';
import DatePickerInput from '@/components/DatePickerInput';

export default function AnimalForm() {
  const router = useRouter();
  const { isEditing, animal } = useLocalSearchParams();

  const isEditMode = isEditing === 'true';
  const animalData = useMemo(() => {
    if (!animal || typeof animal !== 'string') return null;

    try {
      return JSON.parse(animal);
    } catch {
      return null;
    }
  }, [animal]);

  const createMutation = useCreateAnimal();
  const updateMutation = useUpdateAnimal();

  const [form, setForm] = useState({
    name: '',
    birthDate: '',
    personality: '',
    size: 'medio' as 'pequeno' | 'medio' | 'grande',
    vaccinated: false,
    neutered: false,
    about: '',
    availableForAdoption: true,
    needsList: [] as any[],
    images: [] as string[],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode && animalData?._id) {
      setForm({
        name: animalData.name || '',
        birthDate: animalData.birthDate ? animalData.birthDate.split('T')[0] : '',
        personality: animalData.personality || '',
        size: (animalData.size as any) || 'medio',
        vaccinated: Boolean(animalData.vaccinated),
        neutered: Boolean(animalData.neutered),
        about: animalData.about || '',
        availableForAdoption: Boolean(animalData.availableForAdoption),
        needsList: Array.isArray(animalData.needsList) ? [...animalData.needsList] : [],
        images: Array.isArray(animalData.images) ? [...animalData.images] : [],
      });
    }
  }, [isEditMode, animalData]);

  const handleImagePick = async (source: 'camera' | 'gallery') => {
    const permission = source === 'camera'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera/galeria.');
      return;
    }

    const result = source === 'camera'
      ? await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.8 })
      : await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.8 });

    if (!result.canceled && result.assets[0]?.uri) {
      if (form.images.length >= 4) {
        Alert.alert('Limite atingido', 'Máximo de 4 imagens por animal.');
        return;
      }
      setForm(prev => ({
        ...prev,
        images: [...prev.images, result.assets[0].uri],
      }));
    }
  };

  const removeImage = (index: number) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.birthDate || !form.personality.trim() || !form.about.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);

    try {
      const dto = {
        name: form.name.trim(),
        birthDate: new Date(form.birthDate),
        personality: form.personality.trim(),
        size: form.size,
        vaccinated: form.vaccinated,
        neutered: form.neutered,
        about: form.about.trim(),
        availableForAdoption: form.availableForAdoption,
        needsList: form.needsList.map(item => ({
          name: item.name.trim(),
          price: Number(item.price),
          image: item.image || '',
        })),
      };

      if (isEditMode && animalData?._id) {
        // === MODO EDIÇÃO ===
        await updateMutation.mutateAsync({
          id: animalData._id,
          data: dto,
          images: form.images
        });

        Alert.alert('Sucesso', 'Animal atualizado com sucesso!');
      } else {
        // === MODO CADASTRO ===
        await createMutation.mutateAsync({
          dto: dto,
          images: form.images,
        });

        Alert.alert('Sucesso', 'Animal cadastrado com sucesso!');
      }

      router.back();
    } catch (error: any) {
      console.error("Erro completo:", error?.response?.data || error);
      Alert.alert(
        'Erro',
        error?.response?.data?.message || 
        JSON.stringify(error?.response?.data) || 
        'Ocorreu um erro inesperado.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          {isEditMode ? 'Editar Animal' : 'Cadastrar Novo Animal'}
        </Text>

        <ImagePickerGrid
          images={form.images}
          onAddFromGallery={() => handleImagePick('gallery')}
          onAddFromCamera={() => handleImagePick('camera')}
          onRemove={removeImage}
          maxImages={4}
        />

        <Input
          label="Nome do Animal *"
          value={form.name}
          onChangeText={(text) => setForm(p => ({ ...p, name: text }))}
          placeholder="Ex: Thor"
        />

        <DatePickerInput
          label="Data de Nascimento *"
          value={form.birthDate}
          onChange={(date) => setForm(prev => ({ ...prev, birthDate: date }))}
        />

        <Input
          label="Personalidade *"
          value={form.personality}
          onChangeText={(text) => setForm(p => ({ ...p, personality: text }))}
          placeholder="Ex: Carinhoso, brincalhão..."
          multiline
        />

        <Select
          label="Tamanho *"
          selectedValue={form.size}
          onValueChange={(value) => setForm(p => ({ ...p, size: value as any }))}
          options={[
            { label: 'Pequeno', value: 'pequeno' },
            { label: 'Médio', value: 'medio' },
            { label: 'Grande', value: 'grande' },
          ]}
        />

        <SwitchInput
          label="Vacinado"
          value={form.vaccinated}
          onValueChange={(v) => setForm(p => ({ ...p, vaccinated: v }))}
        />

        <SwitchInput
          label="Castrado"
          value={form.neutered}
          onValueChange={(v) => setForm(p => ({ ...p, neutered: v }))}
        />

        <SwitchInput
          label="Disponível para Adoção"
          value={form.availableForAdoption}
          onValueChange={(v) => setForm(p => ({ ...p, availableForAdoption: v }))}
        />

        <NeedsListManager
          needsList={form.needsList}
          onChange={(newList) => setForm(prev => ({ ...prev, needsList: newList }))}
        />

        <Input
          label="Sobre o Animal *"
          value={form.about}
          onChangeText={(text) => setForm(p => ({ ...p, about: text }))}
          placeholder="Descreva o animal..."
          multiline
          numberOfLines={5}
        />

        <Button
          title={isEditMode ? "Atualizar Animal" : "Cadastrar Animal"}
          onPress={handleSubmit}
          loading={isSubmitting}
          style={{ marginTop: 30 }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
});
