import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import api from "../../api/axios";
import { socket } from "../../utils/socket";

export default function CreateCommunity() {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [university, setUniversity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim() || !department.trim()) {
      Alert.alert("Required Fields", "Community name and department are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/communities/create", {
        name: name.trim(),
        description: description.trim(),
        department: department.trim(),
        university: university.trim() || null,
      });

      socket.emit("join_room", res.data.data._id); // optional, join the new community
      Alert.alert("Success", "Community created successfully!");
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", err.response?.data?.message || "Failed to create community");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Community</Text>

      <TextInput
        style={styles.input}
        placeholder="Community Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Description (optional)"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Department"
        value={department}
        onChangeText={setDepartment}
      />
      <TextInput
        style={styles.input}
        placeholder="University (optional)"
        value={university}
        onChangeText={setUniversity}
      />

      <TouchableOpacity style={styles.button} onPress={handleCreate} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Creating..." : "Create"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#FFFFFF" },
  header: { fontSize: 26, fontFamily: "Poppins-Bold", marginBottom: 20, color: "#111" },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    fontFamily: "Inter",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#635BFF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
});
