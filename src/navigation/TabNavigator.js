import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CommunitiesScreen from "../screens/Communities/CommunityList";
import HomeScreen from "../screens/Home";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Communities" component={CommunitiesScreen} />
      {/* Add other tabs later */}
    </Tab.Navigator>
  );
}
