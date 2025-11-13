import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import api from "../../api/axios";
import { useSocket } from "../../context/SocketContext";

const CommunityDetails = ({ route }) => {
  const { community: initialCommunity } = route.params;
  const [community, setCommunity] = useState(initialCommunity);
  const [loading, setLoading] = useState(false);
  const socket = useSocket();

  const userIsMember = community.members?.some(member => member === initialCommunity.createdBy || member); // adjust as per your auth user id

  // Fetch latest community data (optional, ensures up-to-date info)
  const fetchCommunity = async () => {
    try {
      const res = await api.get(`/communities/${community._id}`);
      setCommunity(res.data.data);
    } catch (err) {
      console.log("Error fetching community:", err);
    }
  };

  const handleJoinLeave = async () => {
    setLoading(true);
    try {
      if (userIsMember) {
        await api.post(`/communities/${community._id}/leave`);
      } else {
        await api.post(`/communities/${community._id}/join`);
      }
      // Optimistically update
      fetchCommunity();
    } catch (err) {
      console.log("Error joining/leaving community:", err);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!socket) return;

    socket.emit("join_room", community._id);

    socket.on("community_member_joined", (updated) => {
      if (updated._id === community._id) setCommunity(updated);
    });

    socket.on("community_member_left", (updated) => {
      if (updated._id === community._id) setCommunity(updated);
    });

    socket.on("community_updated", (updated) => {
      if (updated._id === community._id) setCommunity(updated);
    });

    return () => {
      socket.emit("leave_room", community._id);
      socket.off("community_member_joined");
      socket.off("community_member_left");
      socket.off("community_updated");
    };
  }, [socket]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{community.name}</Text>
      <Text style={styles.description}>
        {community.description || "No description yet."}
      </Text>

      <Text style={styles.members}>
        👥 {community.members?.length || 0} members
      </Text>

      <Text style={styles.meta}>
        Department: {community.department}
      </Text>

      {community.university && (
        <Text style={styles.meta}>University: {community.university}</Text>
      )}

      <TouchableOpacity
        style={[styles.button, userIsMember ? styles.leaveButton : styles.joinButton]}
        onPress={handleJoinLeave}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {userIsMember ? "Leave Community" : "Join Community"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CommunityDetails;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", padding: 16 },
  title: { fontSize: 26, fontWeight: "800", marginBottom: 10 },
  description: { fontSize: 16, color: "#5C5C5C", marginBottom: 12 },
  members: { fontSize: 15, marginBottom: 8 },
  meta: { fontSize: 14, color: "#6E6E6E", marginBottom: 16 },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  joinButton: { backgroundColor: "#635BFF" },
  leaveButton: { backgroundColor: "#FF5C5C" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
