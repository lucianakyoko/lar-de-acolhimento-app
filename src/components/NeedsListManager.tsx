import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

import Input from './Input';

export interface NeedItem {
  _id?: string;
  image: string;
  name: string;
  price: number;
}

type Props = {
  needsList: NeedItem[];
  onChange: (newList: NeedItem[]) => void;
};

export default function NeedsListManager({ needsList, onChange }: Props) {
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    image: '',
  });

  // Colar da área de transferência
  const pasteFromClipboard = async () => {
    const text = await Clipboard.getStringAsync();
    if (text && (text.startsWith('http://') || text.startsWith('https://'))) {
      setNewItem(prev => ({ ...prev, image: text }));
      Alert.alert('Sucesso', 'Link colado da área de transferência!');
    } else {
      Alert.alert('Nada encontrado', 'Copie um link de imagem antes de colar.');
    }
  };

  const addNeedItem = () => {
    if (!newItem.name.trim()) {
      Alert.alert('Erro', 'O nome da necessidade é obrigatório.');
      return;
    }
    if (!newItem.price || isNaN(Number(newItem.price))) {
      Alert.alert('Erro', 'Informe um preço válido.');
      return;
    }
    if (!newItem.image.trim()) {
      Alert.alert('Erro', 'Cole a URL da imagem.');
      return;
    }

    const newNeed: NeedItem = {
      name: newItem.name.trim(),
      price: Number(newItem.price),
      image: newItem.image.trim(),
    };

    onChange([...needsList, newNeed]);

    setNewItem({ name: '', price: '', image: '' });
  };

  const removeNeedItem = (index: number) => {
    onChange(needsList.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Lista de Necessidades</Text>

      {needsList.map((item, index) => (
        <View key={index} style={styles.needItem}>
          <Image source={{ uri: item.image }} style={styles.needImage} />
          <View style={styles.needInfo}>
            <Text style={styles.needName}>{item.name}</Text>
            <Text style={styles.needPrice}>
              R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Text>
          </View>
          <TouchableOpacity onPress={() => removeNeedItem(index)} style={styles.removeBtn}>
            <Ionicons name="trash-outline" size={22} color="#e63939" />
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.addSection}>
        <Text style={styles.addTitle}>Adicionar Nova Necessidade</Text>

        <Input
          label="Nome da Necessidade"
          value={newItem.name}
          onChangeText={(text) => setNewItem(prev => ({ ...prev, name: text }))}
          placeholder="Ex: Ração Premium"
        />

        <Input
          label="Preço (R$)"
          value={newItem.price}
          onChangeText={(text) => setNewItem(prev => ({ ...prev, price: text }))}
          placeholder="0,00"
          keyboardType="decimal-pad"
        />

        <Text style={styles.imageLabel}>URL da Imagem</Text>

        <View style={styles.urlContainer}>
          <TextInput
            style={styles.urlInput}
            placeholder="https://exemplo.com/imagem.jpg"
            value={newItem.image}
            onChangeText={(text) => setNewItem(prev => ({ ...prev, image: text }))}
            autoCapitalize="none"
            keyboardType="url"
          />

          <TouchableOpacity style={styles.pasteBtn} onPress={pasteFromClipboard}>
            <Ionicons name="clipboard-outline" size={24} color="#2b9eed" />
          </TouchableOpacity>
        </View>

        {newItem.image ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri: newItem.image }} style={styles.previewImage} />
            <TouchableOpacity onPress={() => setNewItem(prev => ({ ...prev, image: '' }))}>
              <Text style={styles.removePreview}>Remover</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <TouchableOpacity style={styles.addButton} onPress={addNeedItem}>
          <Ionicons name="add-circle" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Adicionar à Lista</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  needItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  needImage: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  needInfo: { flex: 1 },
  needName: { fontSize: 16, fontWeight: '600', color: '#333' },
  needPrice: { fontSize: 15, color: '#2b9eed', marginTop: 2 },
  removeBtn: { padding: 8 },

  addSection: {
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  addTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 12,
  },
  imageLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 8,
  },
  urlContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  urlInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
  },
  pasteBtn: {
    justifyContent: 'center',
    padding: 10,
  },
  previewContainer: { alignItems: 'center', marginBottom: 16 },
  previewImage: { width: 140, height: 140, borderRadius: 12, marginBottom: 8 },
  removePreview: { color: '#e63939', fontSize: 14 },
  addButton: {
    backgroundColor: '#36502e',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
