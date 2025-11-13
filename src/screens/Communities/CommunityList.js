import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import api from "../../api/axios";
import { useSocket } from "../../context/SocketContext";
import { formatName } from "../../utils/formatName";
import CommunityCard from "./CommunityCard";

export default function CommunityList() {
  const [communities, setCommunities] = useState([]);
  const [search, setSearch] = useState("");
  const socket = useSocket();
  const navigation = useNavigation();

  const fetchCommunities = async () => {
    try {
      const res = await api.get("/communities");
      setCommunities(res.data.data);
    } catch (err) {
      console.log("Error fetching communities:", err);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  // 🔥 Real-time community updates
  useEffect(() => {
    if (!socket) return;

    socket.on("community_created", (newCommunity) => {
      setCommunities((prev) => [newCommunity, ...prev]);
    });

    socket.on("community_updated", (updated) => {
      setCommunities((prev) =>
        prev.map((c) => (c._id === updated._id ? updated : c))
      );
    });

    socket.on("community_deleted", ({ communityId }) => {
      setCommunities((prev) => prev.filter((c) => c._id !== communityId));
    });

    return () => {
      socket?.off("community_created");
      socket?.off("community_updated");
      socket?.off("community_deleted");
    };
  }, [socket]);

  const filtered = communities.filter((c) =>
    formatName(c.name).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Discover Communities</Text>

      {/* SEARCH BAR */}
      <View style={styles.searchBox}>
        <AntDesign name="search1" size={18} color="#777" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search communities…"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInUp.delay(index * 80)}>
            <CommunityCard
              community={item}
              onPress={() =>
                navigation.navigate("CommunityDetails", { community: item })
              }
            />
          </Animated.View>
        )}
      />

      {/* FLOATING CREATE BUTTON */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateCommunity")}
      >
        <AntDesign name="plus" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F8F9FB" },
  header: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    marginBottom: 14,
    color: "#111",
  },
  searchBox: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 14,
    borderColor: "#E5E7EB",
    borderWidth: 1,
  },
  searchInput: {
    marginLeft: 6,
    fontSize: 15,
    fontFamily: "Inter",
    flex: 1,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 25,
    backgroundColor: "#635BFF",
    padding: 18,
    borderRadius: 50,
    elevation: 6,
  },
});
