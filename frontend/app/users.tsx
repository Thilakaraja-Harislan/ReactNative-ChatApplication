import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "expo-router";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

interface UserConversation {
  id: string;
  name: string;
  firstName: string;
  avatar: any;
  lastMessage: string;
  time: string;
  unread: number;
  isOnline: boolean;
  category: "Favorites" | "Friends" | "Work";
}

const USERS_DATA: UserConversation[] = [
  {
    id: "1",
    name: "Emily Johnson",
    firstName: "Emily",
    avatar: require("@/assets/images/avatars/emily.png"),
    lastMessage: "I'll be there in 10 minutes!",
    time: "Just Now",
    unread: 2,
    isOnline: true,
    category: "Friends",
  },
  {
    id: "2",
    name: "Liam Brown",
    firstName: "Liam",
    avatar: require("@/assets/images/avatars/liam.png"),
    lastMessage: "Can we reschedule our meeting?",
    time: "9:15 AM",
    unread: 1,
    isOnline: true,
    category: "Work",
  },
  {
    id: "3",
    name: "Sophia Williams",
    firstName: "Sophia",
    avatar: require("@/assets/images/avatars/sophia.png"),
    lastMessage: "Just finished the report, sending it now.",
    time: "11:22 AM",
    unread: 0,
    isOnline: true,
    category: "Work",
  },
  {
    id: "4",
    name: "Ethan Smith",
    firstName: "Ethan",
    avatar: require("@/assets/images/avatars/ethan.png"),
    lastMessage: "Don't forget to bring the document.",
    time: "1:45 PM",
    unread: 0,
    isOnline: true,
    category: "Favorites",
  },
  {
    id: "5",
    name: "Olivia Martinez",
    firstName: "Olivia",
    avatar: require("@/assets/images/avatars/olivia.png"),
    lastMessage: "Had a great time yesterday!",
    time: "8:30 AM",
    unread: 0,
    isOnline: true,
    category: "Friends",
  },
  {
    id: "6",
    name: "Noah Davis",
    firstName: "Noah",
    avatar: require("@/assets/images/avatars/noah.png"),
    lastMessage: "Let's catch up soon.",
    time: "Yesterday",
    unread: 0,
    isOnline: true,
    category: "Favorites",
  },
];

const CATEGORIES = ["All", "Favorites", "Friends", "Work"] as const;
type CategoryType = (typeof CATEGORIES)[number];

export default function UsersScreen() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
  return <Redirect href="/login" />;
}

  console.log("Logged in user:", user);
  console.log("Authenticated:", isAuthenticated);

  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("All");
  const [activeTab, setActiveTab] = useState<"users" | "calls" | "settings">("users");

  const filteredUsers = useMemo(() => {
    return USERS_DATA.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || user.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const onlineStories = useMemo(() => {
    return USERS_DATA.filter((user) => user.isOnline);
  }, []);

  const openChat = (user: UserConversation) => {
    router.push({
      pathname: "/chat/[id]",
      params: { id: user.id },
    });
  };

  const handleLogout = () => {
  logout();
};

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />

      {/* Main Content Area */}
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandTitle}>
              Chat<Text style={styles.brandTitleHighlight}>Connect</Text>
            </Text>
            <Text style={styles.headerSubtitle}>Find people and start chatting</Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.profileButton,
              pressed && styles.iconButtonPressed,
            ]}
            onPress={() => {
              // Profile action
            }}
            accessibilityRole="button"
            accessibilityLabel="Profile"
          >
            <Feather name="user" size={26} color="#0B1220" />
          </Pressable>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#7B88A4" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            placeholderTextColor="#7B88A4"
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
            autoCorrect={false}
          />
        </View>

        {/* Scrollable Body: Online Row + Filter Tabs + Conversations */}
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View>
              {/* Online Section */}
              <View style={styles.onlineHeader}>
                <Text style={styles.onlineTitle}>Online</Text>
                <Pressable
                  onPress={() => {
                    // See all online contacts
                  }}
                  hitSlop={8}
                >
                  <Text style={styles.seeAllText}>See all</Text>
                </Pressable>
              </View>

              {/* Online Stories Row */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.storiesContainer}
              >
                {/* Add Story Button */}
                <Pressable
                  style={({ pressed }) => [
                    styles.storyItem,
                    pressed && styles.storyItemPressed,
                  ]}
                  onPress={() => {
                    // Add story or new user
                  }}
                >
                  <View style={styles.addStoryButton}>
                    <Feather name="user-plus" size={22} color="#0C4EF6" />
                  </View>
                  <Text style={styles.storyName}>Add</Text>
                </Pressable>

                {/* Online Contacts */}
                {onlineStories.map((user) => (
                  <Pressable
                    key={user.id}
                    style={({ pressed }) => [
                      styles.storyItem,
                      pressed && styles.storyItemPressed,
                    ]}
                    onPress={() => openChat(user)}
                  >
                    <View style={styles.storyAvatarWrapper}>
                      <View style={styles.avatarCircle}>
                        <Image
                          source={user.avatar}
                          style={styles.storyAvatar}
                          contentFit="cover"
                        />
                      </View>
                      <View style={styles.onlineBadge} />
                    </View>
                    <Text style={styles.storyName}>{user.firstName}</Text>
                  </Pressable>
                ))}
              </ScrollView>

              {/* Category Filter Tabs */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryTabsContainer}
              >
                {CATEGORIES.map((category) => {
                  const isActive = selectedCategory === category;
                  return (
                    <Pressable
                      key={category}
                      style={[
                        styles.categoryTab,
                        isActive && styles.categoryTabActive,
                      ]}
                      onPress={() => setSelectedCategory(category)}
                    >
                      <Text
                        style={[
                          styles.categoryTabText,
                          isActive && styles.categoryTabTextActive,
                        ]}
                      >
                        {category}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.userCard,
                pressed && styles.userCardPressed,
              ]}
              onPress={() => openChat(item)}
            >
              {/* Avatar + Online Indicator */}
              <View style={styles.avatarWrapper}>
                <View style={styles.avatarCircle}>
                  <Image source={item.avatar} style={styles.avatar} contentFit="cover" />
                </View>
                {item.isOnline && <View style={styles.onlineBadge} />}
              </View>

              {/* User Info Column */}
              <View style={styles.userInfoCol}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.lastMessage} numberOfLines={1}>
                  {item.lastMessage}
                </Text>
              </View>

              {/* Timestamp & Unread Count Badge */}
              <View style={styles.metaCol}>
                <Text style={styles.timeText}>{item.time}</Text>
                {item.unread > 0 ? (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{item.unread}</Text>
                  </View>
                ) : (
                  <View style={styles.emptyBadge} />
                )}
              </View>
            </Pressable>
          )}
        />

        {/* Floating Action Button (FAB) */}
        <Pressable
          style={({ pressed }) => [
            styles.fabButton,
            pressed && styles.fabButtonPressed,
          ]}
          onPress={() => {
            // New conversation action
          }}
          accessibilityRole="button"
          accessibilityLabel="New message"
        >
          <MaterialCommunityIcons
            name="message-plus-outline"
            size={26}
            color="#FFFFFF"
          />
        </Pressable>
      </View>

      {/* Bottom Navigation Bar */}
      <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        {/* Tab 1: Users */}
        <Pressable
          style={styles.navItem}
          onPress={() => setActiveTab("users")}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === "users" }}
        >
          <View
            style={[
              styles.navHighlightPill,
              activeTab === "users" && styles.navHighlightPillActive,
            ]}
          >
            <Feather
              name="message-square"
              size={22}
              color={activeTab === "users" ? "#0C4EF6" : "#667085"}
            />
          </View>
          <Text
            style={[
              styles.navLabel,
              activeTab === "users" && styles.navLabelActive,
            ]}
          >
            Users
          </Text>
        </Pressable>

        {/* Tab 2: Calls */}
        <Pressable
          style={styles.navItem}
          onPress={() => setActiveTab("calls")}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === "calls" }}
        >
          <View
            style={[
              styles.navHighlightPill,
              activeTab === "calls" && styles.navHighlightPillActive,
            ]}
          >
            <Feather
              name="phone"
              size={22}
              color={activeTab === "calls" ? "#0C4EF6" : "#667085"}
            />
          </View>
          <Text
            style={[
              styles.navLabel,
              activeTab === "calls" && styles.navLabelActive,
            ]}
          >
            Calls
          </Text>
        </Pressable>

        {/* Tab 3: Settings */}
        <Pressable
          style={styles.navItem}
          onPress={() => setActiveTab("settings")}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === "settings" }}
        >
          <View
            style={[
              styles.navHighlightPill,
              activeTab === "settings" && styles.navHighlightPillActive,
            ]}
          >
            <Feather
              name="settings"
              size={22}
              color={activeTab === "settings" ? "#0C4EF6" : "#667085"}
            />
          </View>
          <Text
            style={[
              styles.navLabel,
              activeTab === "settings" && styles.navLabelActive,
            ]}
          >
            Settings
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 4,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0B1220",
    letterSpacing: -0.4,
  },
  brandTitleHighlight: {
    color: "#0C4EF6",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#667085",
    marginTop: 2,
  },
  profileButton: {
    padding: 6,
    borderRadius: 20,
    marginTop: 2,
  },
  iconButtonPressed: {
    opacity: 0.7,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF4FB",
    height: 48,
    borderRadius: 24,
    marginHorizontal: 24,
    paddingHorizontal: 16,
    marginTop: 14,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    color: "#0B1220",
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 90,
  },
  onlineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  onlineTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0B1220",
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0C4EF6",
  },
  storiesContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 18,
    gap: 16,
  },
  storyItem: {
    alignItems: "center",
    width: 58,
  },
  storyItemPressed: {
    opacity: 0.8,
  },
  addStoryButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#EFF4FB",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#D3E2FB",
    borderStyle: "dashed",
    aspectRatio: 1,
    flexShrink: 0,
  },
  storyAvatarWrapper: {
    position: "relative",
    width: 54,
    height: 54,
    aspectRatio: 1,
    flexShrink: 0,
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    overflow: "hidden",
    aspectRatio: 1,
    backgroundColor: "#EFF4FB",
  },
  storyAvatar: {
    width: "100%",
    height: "100%",
  },
  onlineBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#22C55E",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    zIndex: 2,
  },
  storyName: {
    fontSize: 12,
    color: "#5C6988",
    marginTop: 6,
    textAlign: "center",
    fontWeight: "500",
  },
  categoryTabsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingBottom: 18,
  },
  categoryTab: {
    backgroundColor: "#EFF4FB",
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 20,
  },
  categoryTabActive: {
    backgroundColor: "#0C4EF6",
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#5C6988",
  },
  categoryTabTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  userCardPressed: {
    opacity: 0.75,
  },
  avatarWrapper: {
    position: "relative",
    width: 54,
    height: 54,
    aspectRatio: 1,
    flexShrink: 0,
    marginRight: 14,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  userInfoCol: {
    flex: 1,
    justifyContent: "center",
  },
  userName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0B1220",
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: "#667085",
  },
  metaCol: {
    alignItems: "flex-end",
    justifyContent: "center",
    marginLeft: 10,
  },
  timeText: {
    fontSize: 12,
    color: "#7B88A4",
    marginBottom: 6,
  },
  unreadBadge: {
    backgroundColor: "#0C4EF6",
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  unreadText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  emptyBadge: {
    height: 20,
  },
  fabButton: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0C4EF6",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#0C4EF6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  fabButtonPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F2F4F7",
    paddingTop: 8,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 64,
  },
  navHighlightPill: {
    paddingHorizontal: 18,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  navHighlightPillActive: {
    backgroundColor: "#EFF4FB",
  },
  navLabel: {
    fontSize: 12,
    color: "#667085",
    fontWeight: "500",
  },
  navLabelActive: {
    color: "#0C4EF6",
    fontWeight: "600",
  },
});