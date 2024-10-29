import { Image, StyleSheet, Platform , TouchableOpacity} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../assets/types";

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Icon from 'react-native-vector-icons/Ionicons'; 

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "index"
>;

export default function HomeScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();

const handleLogout = () => {
    navigation.navigate("index");
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
          
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title"> listar los hábitos actuales </ThemedText>
        <HelloWave />
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Icon name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoutButton: {
    marginLeft: 'auto',
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
