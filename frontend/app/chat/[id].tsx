import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState, useEffect } from "react";
import { Redirect } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import API_BASE_URL from "@/services/api";
import socket from "@/services/socket";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

interface ChatMessage {
  id: string;
  sender: "them" | "me";
  text: string;
  time: string;
  status?: "sent" | "delivered" | "read";
}

type BackendMessage = {
  id: number;
  senderId: number;
  receiverId: number;
  message: string;
  createdAt: string;
};

interface UserProfile {
  name: string;
  avatar: any;
  isOnline: boolean;
  status: string;
}

const USERS_MAP: Record<string, UserProfile> = {
  "1": {
    name: "Emily Johnson",
    avatar: require("@/assets/images/avatars/emily.png"),
    isOnline: true,
    status: "Online",
  },
  "2": {
    name: "Liam Brown",
    avatar: require("@/assets/images/avatars/liam.png"),
    isOnline: true,
    status: "Online",
  },
  "3": {
    name: "Sophia Williams",
    avatar: require("@/assets/images/avatars/sophia.png"),
    isOnline: true,
    status: "Online",
  },
  "4": {
    name: "Ethan Smith",
    avatar: require("@/assets/images/avatars/ethan.png"),
    isOnline: true,
    status: "Online",
  },
  "5": {
    name: "Olivia Martinez",
    avatar: require("@/assets/images/avatars/olivia.png"),
    isOnline: true,
    status: "Online",
  },
  "6": {
    name: "Noah Davis",
    avatar: require("@/assets/images/avatars/noah.png"),
    isOnline: true,
    status: "Online",
  },
};

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "m1",
    sender: "them",
    text: "Hey! How are you doing today?",
    time: "9:10 AM",
  },
  {
    id: "m2",
    sender: "me",
    text: "Hi Emily! I'm good, thanks!\nHow about you?",
    time: "9:12 AM",
    status: "read",
  },
  {
    id: "m3",
    sender: "them",
    text: "I'm doing well! Just finished working on the project we discussed.",
    time: "9:14 AM",
  },
  {
    id: "m4",
    sender: "me",
    text: "That's great! Can you share the latest updates?",
    time: "9:15 AM",
    status: "read",
  },
  {
    id: "m5",
    sender: "them",
    text: "Sure! I'll send you the files in a minute. Also, let's discuss it tomorrow.",
    time: "9:17 AM",
  },
  {
    id: "m6",
    sender: "me",
    text: "Sounds good! Looking forward to it.",
    time: "9:18 AM",
    status: "read",
  },
  {
    id: "m7",
    sender: "them",
    text: "Awesome! Talk to you soon! 😊",
    time: "9:19 AM",
  },
  {
    id: "m8",
    sender: "me",
    text: "Talk to you soon! 👋",
    time: "9:20 AM",
    status: "read",
  },
];

export default function ChatScreen() {
  const { user: loggedInUser, token, isAuthenticated, isLoading } = useAuth();

  const insets = useSafeAreaInsets();
  const { id, name } = useLocalSearchParams<{
      id?: string;
      name?: string;
  }>();
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
  const fetchConversation = async () => {
    if (!token || !id) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/messages/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.log(
          "Failed to fetch conversation:",
          result.message
        );
        return;
      }

const convertedMessages: ChatMessage[] =
  result.messages.map((message: BackendMessage) => {
    const createdAt = new Date(message.createdAt);

    const time = createdAt.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

    return {
      id: message.id.toString(),

     sender:
        message.senderId === loggedInUser?.id
          ? "me"
          : "them",

      text: message.message,

      time,
    };
  });

setMessages(convertedMessages);

console.log(
  "Converted conversation messages:",
  convertedMessages
);

    } catch (error) {
      console.error(
        "Fetch conversation error:",
        error
      );
    }
  };

  fetchConversation();
}, [id, token, loggedInUser?.id]);

useEffect(() => {
  if (!loggedInUser) {
    return;
  }

  socket.connect();

  const handleConnect = () => {
    console.log("Socket connected:", socket.id);

    socket.emit("register-user", loggedInUser.id);
  };

  const handleNewMessage = (message: BackendMessage) => {
  console.log("New real-time message received:", message);

  const newMessage: ChatMessage = {
    id: message.id.toString(),
    sender: message.senderId === loggedInUser?.id ? "me" : "them",
    text: message.message,
    time: new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    }),
  };

  setMessages((prev) => [...prev, newMessage]);

  setTimeout(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, 100);
};

  socket.on("connect", handleConnect);
  socket.on("new-message", handleNewMessage);

  // The socket might already be connected
  if (socket.connected) {
    handleConnect();
  }

  return () => {
    socket.off("connect", handleConnect);
    socket.off("new-message", handleNewMessage);
  };
}, [loggedInUser?.id]);

if (!isAuthenticated) {
  return <Redirect href="/login" />;
}

const handleSendMessage = async () => {
  const trimmed = inputText.trim();

  if (!trimmed || !token || !id) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        receiverId: Number(id),
        message: trimmed,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.log("Failed to send message:", result.message);
      return;
    }

    console.log("Message sent successfully:", result);

    const newMessage: ChatMessage = {
      id: result.data.id.toString(),
      sender: "me",
      text: result.data.message,
      time: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);

    setInputText("");

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({
        animated: true,
      });
    }, 100);
  } catch (error) {
    console.error("Send message error:", error);
  }
};

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />

      {/* Top Header Bar */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <Pressable
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.iconPressed,
            ]}
            onPress={() => router.replace("/users")}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={8}
          >
            <Feather name="arrow-left" size={24} color="#0B1220" />
          </Pressable>

          {/* Contact Avatar with Online Indicator */}
        <View style={styles.avatarWrapper}>
           <View
              style={[
                 styles.avatarCircle,
                 {
                   justifyContent: "center",
                   alignItems: "center",
                 },
              ]}
        >
           <Feather
              name="user"
              size={24}
              color="#0C4EF6"
            />
        </View>
      </View>

          {/* Name and Online Status */}
          <View style={styles.headerInfo}>
            <Text style={styles.headerName} numberOfLines={1}>
              {name || "User"}
            </Text>
  
          </View>
        </View>

        {/* Right Header Actions: Call, Video, More */}
        <View style={styles.headerActions}>
          <Pressable
            style={({ pressed }) => [
              styles.headerActionButton,
              pressed && styles.iconPressed,
            ]}
            onPress={() => {}}
            accessibilityRole="button"
            accessibilityLabel="Voice call"
            hitSlop={8}
          >
            <Feather name="phone" size={21} color="#0B1220" />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.headerActionButton,
              pressed && styles.iconPressed,
            ]}
            onPress={() => {}}
            accessibilityRole="button"
            accessibilityLabel="Video call"
            hitSlop={8}
          >
            <Feather name="video" size={23} color="#0B1220" />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.headerActionButton,
              pressed && styles.iconPressed,
            ]}
            onPress={() => {}}
            accessibilityRole="button"
            accessibilityLabel="More options"
            hitSlop={8}
          >
            <Feather name="more-vertical" size={22} color="#0B1220" />
          </Pressable>
        </View>
      </View>

      {/* Messages List Area wrapped with KeyboardAvoidingView */}
      <KeyboardAvoidingView
        style={styles.flexOne}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.dateBadgeContainer}>
              <View style={styles.dateBadge}>
                <Text style={styles.dateBadgeText}>Today</Text>
              </View>
            </View>
          }
          renderItem={({ item }) => {
            if (item.sender === "them") {
              return (
                <View style={styles.incomingContainer}>
                  {/* Incoming Contact Avatar */}
                   <View
                      style={[
                         styles.messageAvatarCircle,
                      {
                         justifyContent: "center",
                         alignItems: "center",
                      },
                   ]}
                >
                  <Feather
                     name="user"
                     size={20}
                     color="#0C4EF6"
                   />
            </View>

                  {/* Message Bubble + Timestamp */}
                  <View style={styles.incomingBubbleWrapper}>
                    <View style={styles.incomingBubble}>
                      <Text style={styles.incomingMessageText}>{item.text}</Text>
                    </View>
                    <Text style={styles.incomingTimeText}>{item.time}</Text>
                  </View>
                </View>
              );
            }

            // Outgoing Message (Me)
            return (
              <View style={styles.outgoingContainer}>
                <View style={styles.outgoingBubbleWrapper}>
                  <View style={styles.outgoingBubble}>
                    <Text style={styles.outgoingMessageText}>{item.text}</Text>
                  </View>
                  <View style={styles.outgoingMetaRow}>
                    <Text style={styles.outgoingTimeText}>{item.time}</Text>
                    {item.status === "read" && (
                      <Ionicons name="checkmark-done" size={15} color="#0C4EF6" />
                    )}
                  </View>
                </View>
              </View>
            );
          }}
        />

        {/* Bottom Input Area */}
        <View
          style={[
            styles.bottomInputBar,
            { paddingBottom: Math.max(insets.bottom, 12) },
          ]}
        >
          {/* Paperclip Attachment Button */}
          <Pressable
            style={({ pressed }) => [
              styles.bottomIconButton,
              pressed && styles.iconPressed,
            ]}
            onPress={() => {}}
            accessibilityRole="button"
            accessibilityLabel="Attach file"
            hitSlop={6}
          >
            <Feather name="paperclip" size={22} color="#0B1220" />
          </Pressable>

          {/* Capsule Text Input Pill with Internal Send Button */}
          <View style={styles.inputPill}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              placeholderTextColor="#7B88A4"
              value={inputText}
              onChangeText={setInputText}
              multiline={false}
              onSubmitEditing={handleSendMessage}
              returnKeyType="send"
            />

            <Pressable
              style={({ pressed }) => [
                styles.sendButton,
                pressed && styles.sendButtonPressed,
              ]}
              onPress={handleSendMessage}
              accessibilityRole="button"
              accessibilityLabel="Send message"
            >
              <Ionicons
                name="send"
                size={17}
                color="#FFFFFF"
                style={styles.sendIconOffset}
              />
            </Pressable>
          </View>

          {/* Voice Microphone Button */}
          <Pressable
            style={({ pressed }) => [
              styles.bottomIconButton,
              pressed && styles.iconPressed,
            ]}
            onPress={() => {}}
            accessibilityRole="button"
            accessibilityLabel="Voice message"
            hitSlop={6}
          >
            <Feather name="mic" size={22} color="#0B1220" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  flexOne: {
    flex: 1,
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F4F6F9",
    backgroundColor: "#FFFFFF",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  backButton: {
    padding: 6,
    marginRight: 6,
  },
  iconPressed: {
    opacity: 0.65,
  },
  avatarWrapper: {
    position: "relative",
    width: 44,
    height: 44,
    aspectRatio: 1,
    flexShrink: 0,
    marginRight: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
    aspectRatio: 1,
    backgroundColor: "#EFF4FB",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  onlineBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#22C55E",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    zIndex: 2,
  },
  headerInfo: {
    justifyContent: "center",
    flex: 1,
  },
  headerName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0B1220",
    letterSpacing: -0.2,
  },
  headerStatus: {
    fontSize: 13,
    color: "#7B88A4",
    marginTop: 1,
    fontWeight: "500",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerActionButton: {
    padding: 6,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },
  dateBadgeContainer: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 4,
  },
  dateBadge: {
    backgroundColor: "#EFF4FB",
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 14,
  },
  dateBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#667085",
  },
  incomingContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  messageAvatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: "hidden",
    aspectRatio: 1,
    backgroundColor: "#EFF4FB",
    marginRight: 10,
    marginTop: 2,
    flexShrink: 0,
  },
  messageAvatarImage: {
    width: "100%",
    height: "100%",
  },
  incomingBubbleWrapper: {
    maxWidth: "76%",
    alignItems: "flex-start",
  },
  incomingBubble: {
    backgroundColor: "#EAF3FD",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  incomingMessageText: {
    fontSize: 15,
    color: "#0B1220",
    lineHeight: 21,
    fontWeight: "400",
  },
  incomingTimeText: {
    fontSize: 11,
    color: "#7B88A4",
    marginTop: 4,
    marginLeft: 4,
  },
  outgoingContainer: {
    alignItems: "flex-end",
    marginBottom: 16,
  },
  outgoingBubbleWrapper: {
    maxWidth: "76%",
    alignItems: "flex-end",
  },
  outgoingBubble: {
    backgroundColor: "#EFF2F7",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  outgoingMessageText: {
    fontSize: 15,
    color: "#0B1220",
    lineHeight: 21,
    fontWeight: "400",
  },
  outgoingMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginRight: 4,
    gap: 4,
  },
  outgoingTimeText: {
    fontSize: 11,
    color: "#7B88A4",
  },
  bottomInputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 8,
    backgroundColor: "#FFFFFF",
    gap: 8,
  },
  bottomIconButton: {
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  inputPill: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EFF4FB",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
    paddingRight: 5,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: "#0B1220",
    height: "100%",
    paddingVertical: 0,
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#0C4EF6",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonPressed: {
    transform: [{ scale: 0.94 }],
    opacity: 0.9,
  },
  sendIconOffset: {
    marginLeft: 2,
  },
});