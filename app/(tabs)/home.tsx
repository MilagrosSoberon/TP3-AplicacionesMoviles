import { Image, StyleSheet, Platform, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../assets/types";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Icon from "react-native-vector-icons/Ionicons";
import { useThemeColor } from '@/hooks/useThemeColor';

type ScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<ScreenNavigationProp>();
  const iconColor = useThemeColor({}, 'text'); 

  const handleLogout = () => {
    navigation.navigate("index");
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Icon name="log-out-outline" size={24} color={iconColor} />
        </TouchableOpacity>
        <ThemedText style={styles.title}> listar los hábitos actuales </ThemedText>
        <HelloWave /> 
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "column", 
    position: "relative", 
  },
  title: {
    fontSize: 24,
    marginTop: 50, 
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "left", 
  },
  logoutButton: {
    position: "absolute", 
    top: 10, 
    right: 0, 
  },
});

