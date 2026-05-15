import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useDonationsGroupedByAnimals } from "@/hooks/useDonationsGroupedByAnimals";
import { AnimalReceivedDonationCard } from "@/components/AnimalReceivedDonationCard";
import { DonationGroup } from '@/types';
import { useState } from 'react';
import AnimalReceivedDonationDetailsModal from '@/components/AnimalReceivedDonationDetailsModal';

export default function Donations() {
  const { data, isLoading, error } = useDonationsGroupedByAnimals();
  const [selectedGroup, setSelectedGroup] = useState<DonationGroup | null>(null);

  const handleCardPress = (group: DonationGroup) => {
    setSelectedGroup(group);
  };

  const handleCloseModal = () => {
    setSelectedGroup(null);
  };

  if(isLoading) {
    return(
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color='#2b9eed' />
        <Text>Carregando resumo...</Text>
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
        <Text style={styles.pageTitle}>Doações Recebidas</Text>
        <View>
          {data?.map(group => (
            <AnimalReceivedDonationCard 
              key={group.animal._id}
              donationValue={group.totalValue}
              imageUrl={group.animal.images?.[0] || ''}
              name={group.animal.name}
              onPress={() => handleCardPress(group)}
            />
          ))}
        </View>
      </ScrollView>

      <AnimalReceivedDonationDetailsModal
        visible={!!selectedGroup}
        onClose={handleCloseModal}
        group={selectedGroup}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0efdb',
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
    justifyContent: 'center',
    gap: 20,
    padding: 20,
  },
  pageTitle: {
    fontSize: 24,
    color: '#5B7552',
    fontWeight: 700,
    padding: 20,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#aeb0b1'
  }
});