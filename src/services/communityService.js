import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "https://universe-mq1h.onrender.com/api/communities"; // <-- replace with your backend URL

const getToken = async () => {
  return await AsyncStorage.getItem("token");
};

export const fetchCommunities = async () => {
  const token = await getToken();
  const res = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};

export const createCommunity = async (data) => {
  const token = await getToken();
  const res = await axios.post(`${API_URL}/create`, data, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};

export const joinCommunity = async (id) => {
  const token = await getToken();
  const res = await axios.post(`${API_URL}/${id}/join`, {}, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};

export const leaveCommunity = async (id) => {
  const token = await getToken();
  const res = await axios.post(`${API_URL}/${id}/leave`, {}, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};
