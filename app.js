import * as Font from "expo-font";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./src/context/AuthContext";
import AppNavigator from "./src/navigation/AppNavigator";
import { socket } from "./src/utils/socket";

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      Poppins: require("./assets/fonts/Poppins-Regular.ttf"),
      "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
      Inter: require("./assets/fonts/Inter-Regular.ttf"),
      "Inter-Bold": require("./assets/fonts/Inter-Bold.ttf"),
    });
    setFontsLoaded(true);
  };

  useEffect(() => {
    loadFonts();
    socket.connect();
    return () => socket.disconnect();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
