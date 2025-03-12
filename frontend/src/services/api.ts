import axios from "axios";
import { Participant } from "../types/participant";

const API_URL = "http://127.0.0.1:5000/participants";

export const fetchParticipants = async (): Promise<Participant[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export const createParticipant = async (participant: Omit<Participant, "id">): Promise<void> => {
  try {
    await axios.post(API_URL, participant);
  } catch (error) {
    console.error("Error creating participant:", error);
  }
};

export const updateParticipant = async (participant: Participant): Promise<void> => {
  try {
    await axios.put(`${API_URL}/${participant.id}`, participant);
  } catch (error) {
    console.error("Error updating participant:", error);
  }
};

export const deleteParticipant = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting participant:", error);
  }
};
