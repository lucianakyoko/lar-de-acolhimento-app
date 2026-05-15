import { Text, View, StyleSheet } from "react-native";

type DashboardSumaryCardProps = {
  label: string;
  value: string;
}
export function DashboardSumaryCard({ label, value }: DashboardSumaryCardProps) {
  return(
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    width: 'auto',
    flexDirection: "row",
    justifyContent: 'space-between',
    backgroundColor: "#5b755258",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 12,
  },
  label: {
    fontSize: 18,
  },
  value: {
    fontSize: 20,
    fontWeight: '900',
    color: '#5B7552',
  }
})