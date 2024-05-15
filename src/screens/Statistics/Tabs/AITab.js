import React, { useState } from "react";
import { View, TextInput, ScrollView, StyleSheet, Text } from "react-native";
import { VStack, IconButton, Icon, Box, Button, HStack } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const AITab = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { role: "user", content: inputMessage };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInputMessage("");
    setLoading(true);

    const botMessageContent = await sendChatRequest(inputMessage);

    const botMessage = {
      role: "bot",
      content: botMessageContent,
    };

    setMessages([...newMessages, botMessage]);
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <VStack space={3}>
          {messages.map((message, index) => (
            <Box
              key={index}
              bg={message.role === "user" ? "blue.200" : "gray.200"}
              p={3}
              borderRadius={10}
              alignSelf={message.role === "user" ? "flex-end" : "flex-start"}
            >
              <Text>{message.content}</Text>
            </Box>
          ))}
        </VStack>
      </ScrollView>
      <HStack alignItems="center" mt={3}>
        <TextInput
          style={styles.input}
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Escreva a sua mensagem"
          onSubmitEditing={handleSendMessage}
          returnKeyType="send"
        />
        <IconButton
          icon={<Icon as={Ionicons} name="send" />}
          onPress={handleSendMessage}
          isLoading={loading}
        />
      </HStack>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    flex: 1,
    marginRight: 16,
    padding: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default AITab;