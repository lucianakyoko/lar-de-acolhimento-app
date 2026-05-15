import { useState } from "react";
import { Text, View, ScrollView, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAnimals } from "@/hooks/useAnimals";
import AnimalCard from "@/components/AnimalCard";
import { useDeleteAnimal } from "@/hooks/useDeleteAnimal";
import ConfirmDeleteAnimalModal from "@/components/ConfirmDeleteAnimalModal";
import FloatingActionButton from "@/components/FloatingActionButton";

export default function Animals() {
  const navigation = useNavigation<any>();
  const { data: animals, isLoading, error } = useAnimals();
  const deleteMutation = useDeleteAnimal();

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [animalToDelete, setAnimalToDelete] = useState<any>(null);

  const handleNewAnimal = () => {
    navigation.navigate('animal-form', { 
      isEditing: false 
    });
  };

  const handleEdit = (animal: any) => {
    navigation.navigate('animal-form', { 
      isEditing: true,
      animal: JSON.stringify(animal) 
    });
  };

  const handleDeletePress = (animal: any) => {
    setAnimalToDelete(animal);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (animalToDelete) {
      deleteMutation.mutate(animalToDelete._id, {
        onSuccess: () => {
          setDeleteModalVisible(false);
          setAnimalToDelete(null);
          Alert.alert('Sucesso', `${animalToDelete.name} foi excluído com sucesso.`);
        },
      });
    }
  };
  if(isLoading) {
    return(
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color='#2b9eed' />
        <Text>Carregando lista de animais...</Text>
      </View>
    )
  }

  if(error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erro ao carregar dados</Text>
      </View>
    );
  }

  return(
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>Animais Cadastrados</Text>

        <View style={styles.grid}>
          {animals?.map((animal) => (
            <AnimalCard
              key={animal._id}
              animal={animal}
              onEdit={handleEdit}
              onDelete={handleDeletePress}
            />
          ))}
        </View>
      </ScrollView>
      
      <FloatingActionButton onPress={handleNewAnimal} />

      <ConfirmDeleteAnimalModal
        visible={deleteModalVisible}
        onClose={() => {
          setDeleteModalVisible(false);
          setAnimalToDelete(null);
        }}
        onConfirm={confirmDelete}
        animalName={animalToDelete?.name || ''}
        animalImage={animalToDelete?.images?.[0] || ''}
        isLoading={deleteMutation.isPending}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f9f7f4' 
  },
    loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  scrollContent: { 
    flexGrow: 1,
    gap: 20,
    padding: 16, 
    paddingBottom: 40 
  },
  pageTitle: {
    fontSize: 24,
    color: '#5B7552',
    fontWeight: 700,
    padding: 20,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#aeb0b1'
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});