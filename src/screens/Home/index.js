import { AntDesign } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import api from "../../api/axios";
import { formatName } from "../../utils/formatName";
import CommunityCard from "../Communities/CommunityCard";

export default function HomeScreen({ navigation }) {
  const [communities, setCommunities] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch recent communities for the horizontal scroll
  const fetchCommunities = async () => {
    try {
      const res = await api.get("/communities?limit=10"); // fetch latest 10 communities
      setCommunities(res.data.data);
    } catch (err) {
      console.log("Error fetching communities:", err);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  const filteredCommunities = communities.filter((c) =>
    formatName(c.name).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      {/* Welcome Header */}
      <Text style={styles.title}>Welcome to UniVerse</Text>
      <Text style={styles.subtitle}>
        Connect with students, join communities, and explore your campus.
      </Text>

      {/* Search Bar */}
      <View style={styles.searchBox}>
        <AntDesign name="search1" size={18} color="#777" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search communities…"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Quick Navigation Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("Communities")}
        >
          <Text style={styles.primaryButtonText}>Explore Communities</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => alert("Messages coming soon!")}
        >
          <Text style={styles.secondaryButtonText}>Messages</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Scroll: Recent Communities */}
      <Text style={styles.sectionTitle}>Recent Communities</Text>
      <FlatList
        data={filteredCommunities}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 8 }}
        renderItem={({ item }) => (
          <CommunityCard
            community={item}
            onPress={() =>
              navigation.navigate("CommunityDetails", { community: item })
            }
            horizontal
          />
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
    color: "#111",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 18,
    marginBottom: 20,
    borderColor: "#E5E7EB",
    borderWidth: 1,
  },
  searchInput: {
    marginLeft: 6,
    fontSize: 15,
    fontFamily: "Inter",
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#635BFF",
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: "center",
    marginRight: 10,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#E5E5E5",
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: "center",
    marginLeft: 10,
  },
  secondaryButtonText: {
    color: "#111",
    fontSize: 16,
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    color: "#111",
  },
});
