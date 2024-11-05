import React, { useEffect, useState } from "react";
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from "react-native";
import { getHabits } from '@/database/database'; 

const HabitListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  interface Habit {
    id: number;
    nombre: string;
    descripcion?: string; 
  }

  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    const loadHabits = async () => {
      const fetchedHabits = await getHabits();
      setHabits(fetchedHabits);
    };

    loadHabits();
  }, []);

  const renderItem = ({ item }: { item: Habit }) => (
    <TouchableOpacity 
      style={styles.itemContainer} 
      onPress={() => navigation.navigate('DetallesHabitos', { habitId: item.id })} 
    >
      <Text style={styles.itemText}>{item.nombre}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={habits}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  list: {
    paddingBottom: 16,
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 18,
  },
});

export default HabitListScreen;
