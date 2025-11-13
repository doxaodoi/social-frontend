import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

const CommunityCard = ({ community, onPress }) => {
  const bannerUrl =
    community.banner ||
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d"; // fallback

  return (
    <Animated.View entering={FadeInUp} style={styles.card}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <Image source={{ uri: bannerUrl }} style={styles.banner} />

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.65)"]}
          style={styles.overlay}
        />

        <View style={styles.content}>
          <Text style={styles.name}>{community.name}</Text>
          <Text style={styles.members}>
            {community.members?.length || 0} members
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default CommunityCard;

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 3,
  },
  banner: {
    width: "100%",
    height: 150,
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    bottom: 0,
  },
  content: {
    position: "absolute",
    bottom: 14,
    left: 14,
  },
  name: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  members: {
    color: "#ddd",
    fontSize: 14,
    marginTop: 2,
  },
});
