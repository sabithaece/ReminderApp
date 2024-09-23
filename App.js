import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const [reminders, setReminders] = useState([]);
  const [text, setText] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const loadReminders = async () => {
      const storedReminders = await AsyncStorage.getItem("reminders");
      if (storedReminders) {
        setReminders(JSON.parse(storedReminders));
      }
    };
    loadReminders();
  }, []);

  const addReminder = async () => {
    console.log("Reminder Text:", text);
    console.log("Reminder Time:", time);

    if (!isValidDate(time)) {
      Alert.alert(
        "Error",
        "Please enter a valid time in the format YYYY-MM-DD HH:MM:SS."
      );
      return;
    }

    if (text && time) {
      const reminder = {
        id: Math.random().toString(),
        text,
        time,
      };
      const updatedReminders = [...reminders, reminder];
      setReminders(updatedReminders);
      await AsyncStorage.setItem("reminders", JSON.stringify(updatedReminders));
      triggerNotification(reminder);
      setText("");
      setTime("");
    } else {
      Alert.alert("Error", "Please enter a reminder and time.");
    }
  };

  const triggerNotification = (reminder) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(reminder.text, {
        body: `Reminder set for ${reminder.time}`,
      });
    }
  };

  const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    return regex.test(dateString);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>Reminder App</Text>
      <TextInput
        placeholder="Enter reminder"
        value={text}
        onChangeText={setText}
        style={{
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
          padding: 5,
        }}
      />
      <TextInput
        placeholder="Enter time (YYYY-MM-DD HH:MM:SS)"
        value={time}
        onChangeText={setTime}
        style={{
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
          padding: 5,
        }}
      />
      <Button title="Add Reminder" onPress={addReminder} />
      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 10,
              borderBottomColor: "gray",
              borderBottomWidth: 1,
            }}
          >
            <Text>{item.text}</Text>
            <Text>{item.time}</Text>
          </View>
        )}
      />
    </View>
  );
}
