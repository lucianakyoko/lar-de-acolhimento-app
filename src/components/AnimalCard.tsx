import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Animal = {
  _id: string;
  name: string;
  birthDate?: string;
  images?: string[];
};

type AnimalCardProps = {
  animal: Animal;
  onEdit: (animal: Animal) => void;
  onDelete: (animal: Animal) => void;
};

export default function AnimalCard({ animal, onEdit, onDelete }: AnimalCardProps) {
  const calculateAge = (birthDate?: string): string => {
    if (!birthDate) return 'Idade não informada';

    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age === 1 ? '1 ano' : `${age} anos`;
  };

  const imageUrl = animal.images?.[0] || 'https://via.placeholder.com/300x300?text=Sem+Foto';

  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />

      <View style={styles.actionOverlay}>
        <TouchableOpacity style={styles.actionButton} onPress={() => onEdit(animal)}>
          <Ionicons name="pencil" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => onDelete(animal)}>
          <Ionicons name="trash-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.name}>{animal.name}</Text>
        <Text style={styles.age}>{calculateAge(animal.birthDate)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: (SCREEN_WIDTH - 48) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#f0f0f0',
  },
  actionOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    padding: 14,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#5B7552',
    marginBottom: 4,
  },
  age: {
    fontSize: 14,
    color: '#666',
  },
});