// ProfileScreen.tsx  (or .jsx)
import { Switch } from "@/components/ui";
import { useThemePreference } from "@/hooks/use-theme-preference";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router"; // ← if using expo-router
import React, { useEffect, useMemo, useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { useNavigation } from '@react-navigation/native'; // alternative

// Icons (install lucide-react-native)
import {
  Bell,
  Calendar,
  ChevronRight,
  HelpCircle,
  LogOut,
  Mail,
  MessageCircle,
  Moon,
  Phone,
  Shield,
  Smartphone,
  Sun,
  User,
} from "lucide-react-native";

export default function ProfileScreen() {
  const router = useRouter();
  // const navigation = useNavigation(); // if not using expo-router
  const { mode, setMode } = useThemePreference();

  const [profilePhotoUri, setProfilePhotoUri] = useState<string | null>(null);
  const [pendingProfilePhotoUri, setPendingProfilePhotoUri] = useState<string | null>(null);
  const [avatarMenuVisible, setAvatarMenuVisible] = useState(false);
  const [photoViewerVisible, setPhotoViewerVisible] = useState(false);
  const [photoConfirmVisible, setPhotoConfirmVisible] = useState(false);

  const [infoDialog, setInfoDialog] = useState<{
    visible: boolean;
    title: string;
    message: string;
  }>({ visible: false, title: "", message: "" });

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+254 712 345 678",
  });

  const avatarInitials = useMemo(() => {
    const parts = profileData.name.trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
    return (first + last).toUpperCase() || "U";
  }, [profileData.name]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const stored = await AsyncStorage.getItem("profilePhotoUri");
        if (!mounted) return;
        setProfilePhotoUri(stored);
      } catch {
        // ignore
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("profilePhotoUri", profilePhotoUri ?? "").catch(() => undefined);
  }, [profilePhotoUri]);

  const pickProfilePhoto = async ({
    allowEditing,
  }: {
    allowEditing: boolean;
  }) => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== "granted") {
      openInfoDialog(
        "Permission needed",
        "Please allow photo library access to upload a profile photo."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: allowEditing,
      aspect: allowEditing ? [1, 1] : undefined,
      quality: 0.9,
    });

    if (result.canceled) return;
    const uri = result.assets?.[0]?.uri;
    if (uri) {
      setPendingProfilePhotoUri(uri);
      setPhotoConfirmVisible(true);
    }
  };

  const removeProfilePhoto = () => {
    setProfilePhotoUri(null);
    AsyncStorage.removeItem("profilePhotoUri").catch(() => undefined);
  };

  const confirmProfilePhoto = () => {
    if (!pendingProfilePhotoUri) {
      setPhotoConfirmVisible(false);
      return;
    }
    setProfilePhotoUri(pendingProfilePhotoUri);
    setPendingProfilePhotoUri(null);
    setPhotoConfirmVisible(false);
  };

  const cancelProfilePhoto = () => {
    setPendingProfilePhotoUri(null);
    setPhotoConfirmVisible(false);
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    openInfoDialog("Logged out", "You have been logged out successfully");
    setTimeout(() => {
      router.replace("/(auth)/sign-in"); // or navigation.reset(...)
    }, 350);
  };

  const handleSaveProfile = () => {
    openInfoDialog("Success", "Profile updated successfully");
    // Here you would normally call an API
  };

  const openInfoDialog = (title: string, message: string) => {
    setInfoDialog({ visible: true, title, message });
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      {/* Header */}
      <View className="bg-card border-b border-border pb-2 pt-4">
        <Text className="text-2xl font-bold text-foreground text-center">Profile</Text>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-6"
        contentContainerStyle={{ paddingBottom: 28 }}
      >
        {/* Profile Card */}
        <View className="bg-card rounded-2xl p-6 mb-6 shadow-sm border border-border">
          <View className="items-center mb-6">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setAvatarMenuVisible(true)}
              className="w-24 h-24 bg-brandSoft rounded-full items-center justify-center mb-4 overflow-hidden"
            >
              {profilePhotoUri ? (
                <Image
                  source={{ uri: profilePhotoUri }}
                  className="w-24 h-24"
                  resizeMode="cover"
                />
              ) : (
                <View className="items-center justify-center">
                  <User size={48} color="#5B21B6" />
                </View>
              )}
            </TouchableOpacity>
            <Text className="text-xl font-semibold text-foreground">{profileData.name}</Text>
            <Text className="text-muted-foreground mt-1">{profileData.email}</Text>
          </View>

          <View className="h-px bg-border my-6" />

          <View className="space-y-5">
            {/* Name */}
            <View>
              <Text className="text-muted-foreground font-medium mb-2">Full Name</Text>
              <View className="relative">
                <User
                  size={20}
                  color="#9ca3af"
                  className="absolute left-3 top-3.5 z-10"
                />
                <TextInput
                  value={profileData.name}
                  onChangeText={(text) => setProfileData({ ...profileData, name: text })}
                  className="bg-background border border-border rounded-lg py-3 pl-11 pr-4 text-foreground"
                  placeholder="Enter your name"
                  placeholderTextColor="#6b7280"
                />
              </View>
            </View>

            {/* Email */}
            <View>
              <Text className="text-muted-foreground font-medium mb-2">Email Address</Text>
              <View className="relative">
                <Mail
                  size={20}
                  color="#9ca3af"
                  className="absolute left-3 top-3.5 z-10"
                />
                <TextInput
                  value={profileData.email}
                  onChangeText={(text) => setProfileData({ ...profileData, email: text })}
                  keyboardType="email-address"
                  className="bg-background border border-border rounded-lg py-3 pl-11 pr-4 text-foreground"
                  placeholder="Enter your email"
                  placeholderTextColor="#6b7280"
                />
              </View>
            </View>

            {/* Phone */}
            <View>
              <Text className="text-muted-foreground font-medium mb-2">Phone Number</Text>
              <View className="relative">
                <Phone
                  size={20}
                  color="#9ca3af"
                  className="absolute left-3 top-3.5 z-10"
                />
                <TextInput
                  value={profileData.phone}
                  onChangeText={(text) => setProfileData({ ...profileData, phone: text })}
                  keyboardType="phone-pad"
                  className="bg-background border border-border rounded-lg py-3 pl-11 pr-4 text-foreground"
                  placeholder="Enter your phone"
                  placeholderTextColor="#6b7280"
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={handleSaveProfile}
              className="bg-brand py-4 rounded-lg items-center active:opacity-90"
            >
              <Text className="text-white font-medium text-base">Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Activity Summary */}
        <View className="bg-card rounded-2xl p-6 mb-6 shadow-sm border border-border">
          <Text className="font-semibold text-foreground text-lg mb-4">Your Activity</Text>
          <View className="flex-row justify-between">
            <View className="bg-brandSoft flex-1 p-4 rounded-xl mr-3 items-center">
              <View className="flex-row items-center mb-2">
                <MessageCircle size={20} color="#9333ea" />
                <Text className="text-sm text-muted-foreground ml-2">Chat Sessions</Text>
              </View>
              <Text className="text-2xl font-bold text-foreground">12</Text>
            </View>

            <View className="bg-muted flex-1 p-4 rounded-xl items-center">
              <View className="flex-row items-center mb-2">
                <Calendar size={20} color="#2563eb" />
                <Text className="text-sm text-muted-foreground ml-2">Appointments</Text>
              </View>
              <Text className="text-2xl font-bold text-foreground">3</Text>
            </View>
          </View>
        </View>

        {/* Appearance */}
        <View className="bg-card rounded-2xl p-6 mb-6 shadow-sm border border-border">
          <Text className="font-semibold text-foreground text-lg mb-4">Appearance</Text>

          <View className="space-y-3">
            <TouchableOpacity
              className="flex-row items-center justify-between py-3 px-2 active:opacity-90 rounded-lg"
              onPress={() => setMode("system")}
            >
              <View className="flex-row items-center flex-1">
                <Smartphone size={20} color="#4b5563" />
                <View className="ml-3">
                  <Text className="font-medium text-foreground">System</Text>
                  <Text className="text-sm text-muted-foreground">Match your device setting</Text>
                </View>
              </View>
              <View
                className={[
                  "w-5 h-5 rounded-full border",
                  mode === "system" ? "bg-brand border-brand" : "border-border",
                ].join(" ")}
              />
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center justify-between py-3 px-2 active:opacity-90 rounded-lg"
              onPress={() => setMode("light")}
            >
              <View className="flex-row items-center flex-1">
                <Sun size={20} color="#4b5563" />
                <View className="ml-3">
                  <Text className="font-medium text-foreground">Light</Text>
                  <Text className="text-sm text-muted-foreground">Always use light mode</Text>
                </View>
              </View>
              <View
                className={[
                  "w-5 h-5 rounded-full border",
                  mode === "light" ? "bg-brand border-brand" : "border-border",
                ].join(" ")}
              />
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center justify-between py-3 px-2 active:opacity-90 rounded-lg"
              onPress={() => setMode("dark")}
            >
              <View className="flex-row items-center flex-1">
                <Moon size={20} color="#4b5563" />
                <View className="ml-3">
                  <Text className="font-medium text-foreground">Dark</Text>
                  <Text className="text-sm text-muted-foreground">Always use dark mode</Text>
                </View>
              </View>
              <View
                className={[
                  "w-5 h-5 rounded-full border",
                  mode === "dark" ? "bg-brand border-brand" : "border-border",
                ].join(" ")}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings */}
        <View className="bg-card rounded-2xl p-6 mb-6 shadow-sm border border-border">
          <Text className="font-semibold text-foreground text-lg mb-4">Settings</Text>

          <View className="space-y-5">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <Bell size={20} color="#4b5563" />
                <View className="ml-3">
                  <Text className="font-medium text-foreground">Notifications</Text>
                  <Text className="text-sm text-muted-foreground">Receive updates and reminders</Text>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
              />
            </View>

            <View className="h-px bg-border" />

            <TouchableOpacity
              className="flex-row items-center justify-between py-3 px-2 active:opacity-90 rounded-lg"
              onPress={() =>
                openInfoDialog("Privacy & Security", "Privacy settings coming soon")
              }
            >
              <View className="flex-row items-center flex-1">
                <Shield size={20} color="#4b5563" />
                <View className="ml-3">
                  <Text className="font-medium text-foreground">Privacy & Security</Text>
                  <Text className="text-sm text-muted-foreground">Manage your data and security</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#9ca3af" />
            </TouchableOpacity>

            <View className="h-px bg-border" />

            <TouchableOpacity
              className="flex-row items-center justify-between py-3 px-2 active:opacity-90 rounded-lg"
              onPress={() =>
                openInfoDialog("Help & Support", "Help & Support coming soon")
              }
            >
              <View className="flex-row items-center flex-1">
                <HelpCircle size={20} color="#4b5563" />
                <View className="ml-3">
                  <Text className="font-medium text-foreground">Help & Support</Text>
                  <Text className="text-sm text-muted-foreground">Get assistance and FAQs</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Emergency Resources */}
        <View className="bg-errorSoft border border-error/30 rounded-2xl p-6 mb-6">
          <Text className="font-semibold text-foreground text-lg mb-3">Emergency Resources</Text>
          <Text className="text-sm text-muted-foreground mb-3">
            If you are in crisis or need immediate help, please contact:
          </Text>
          <View className="space-y-2">
            <Text className="text-foreground text-sm">
              <Text className="font-bold">Kenya Mental Health Helpline:</Text> 0800 720 000
            </Text>
            <Text className="text-foreground text-sm">
              <Text className="font-bold">Emergency Services:</Text> 999 or 112
            </Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={() => setShowLogoutModal(true)}
          className="flex-row items-center justify-center border border-red-200 bg-card py-4 rounded-lg active:opacity-90 mb-2"
        >
          <LogOut size={20} color="#dc2626" />
          <Text className="text-red-600 font-medium ml-2 text-base">Log Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Info Dialog (theme-aware) */}
      <Modal
        visible={infoDialog.visible}
        transparent
        animationType="fade"
        onRequestClose={() => setInfoDialog((p) => ({ ...p, visible: false }))}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-card rounded-2xl p-6 w-full max-w-sm border border-border">
            <Text className="text-xl font-semibold text-foreground mb-2">
              {infoDialog.title}
            </Text>
            <Text className="text-muted-foreground mb-6">
              {infoDialog.message}
            </Text>

            <View className="flex-row justify-end">
              <TouchableOpacity
                onPress={() => setInfoDialog((p) => ({ ...p, visible: false }))}
                className="px-5 py-3 border border-border rounded-lg"
              >
                <Text className="text-foreground font-medium">OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Confirm Selected Photo */}
      <Modal
        visible={photoConfirmVisible}
        transparent
        animationType="fade"
        onRequestClose={cancelProfilePhoto}
      >
        <View className="flex-1 bg-black/70 justify-center items-center px-6">
          <View className="bg-card rounded-2xl p-6 w-full max-w-sm border border-border">
            <Text className="text-xl font-semibold text-foreground mb-2">
              Confirm photo
            </Text>
            <Text className="text-muted-foreground mb-5">
              Use this as your new profile photo?
            </Text>

            <View className="w-full aspect-square rounded-2xl overflow-hidden border border-border bg-card">
              {pendingProfilePhotoUri ? (
                <Image
                  source={{ uri: pendingProfilePhotoUri }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-full items-center justify-center bg-card">
                  <Text className="text-foreground font-semibold text-base">
                    {avatarInitials}
                  </Text>
                </View>
              )}
            </View>

            <View className="flex-row justify-end mt-5 space-x-3">
              <TouchableOpacity
                onPress={cancelProfilePhoto}
                className="px-5 py-3 border border-border rounded-lg"
                activeOpacity={0.9}
              >
                <Text className="text-foreground font-medium">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={confirmProfilePhoto}
                className="px-5 py-3 bg-brand rounded-lg"
                activeOpacity={0.9}
              >
                <Text className="text-white font-medium">Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Avatar Actions */}
      <Modal
        visible={avatarMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAvatarMenuVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-card rounded-2xl p-6 w-full max-w-sm border border-border">
            <Text className="text-xl font-semibold text-foreground mb-1">Profile photo</Text>
            <Text className="text-muted-foreground mb-6">
              Upload, view, or edit your profile picture.
            </Text>

            <View className="space-y-3">
              <TouchableOpacity
                onPress={async () => {
                  setAvatarMenuVisible(false);
                  await pickProfilePhoto({ allowEditing: false });
                }}
                className="px-5 py-3 bg-brand rounded-lg"
                activeOpacity={0.9}
              >
                <Text className="text-white font-medium text-center">
                  {profilePhotoUri ? "Change Photo" : "Upload Photo"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={!profilePhotoUri}
                onPress={() => {
                  setAvatarMenuVisible(false);
                  setPhotoViewerVisible(true);
                }}
                className={[
                  "px-5 py-3 border border-border rounded-lg",
                  profilePhotoUri ? "opacity-100" : "opacity-50",
                ].join(" ")}
                activeOpacity={0.9}
              >
                <Text className="text-foreground font-medium text-center">View Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={!profilePhotoUri}
                onPress={() => {
                  removeProfilePhoto();
                  setAvatarMenuVisible(false);
                }}
                className={[
                  "px-5 py-3 border border-red-200 rounded-lg",
                  profilePhotoUri ? "opacity-100" : "opacity-50",
                ].join(" ")}
                activeOpacity={0.9}
              >
                <Text className="text-red-600 font-medium text-center">Remove Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setAvatarMenuVisible(false)}
                className="px-5 py-3 border border-border rounded-lg"
                activeOpacity={0.9}
              >
                <Text className="text-foreground font-medium text-center">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Photo Viewer */}
      <Modal
        visible={photoViewerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPhotoViewerVisible(false)}
      >
        <View className="flex-1 bg-black/90 justify-center items-center px-6">
          <View className="w-full max-w-sm items-center">
            <View className="w-72 h-72 rounded-2xl overflow-hidden border border-border bg-card">
              {profilePhotoUri ? (
                <Image
                  source={{ uri: profilePhotoUri }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-full items-center justify-center bg-card">
                  <Text className="text-foreground font-semibold text-base">{avatarInitials}</Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              onPress={() => setPhotoViewerVisible(false)}
              className="mt-5 px-6 py-3 bg-card border border-border rounded-lg"
              activeOpacity={0.9}
            >
              <Text className="text-foreground font-medium text-center">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Logout Modal */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-card rounded-2xl p-6 w-full max-w-sm border border-border">
            <Text className="text-xl font-semibold text-foreground mb-2">Confirm Logout</Text>
            <Text className="text-muted-foreground mb-6">Are you sure you want to log out of your account?</Text>

            <View className="flex-row justify-end space-x-3">
              <TouchableOpacity
                onPress={() => setShowLogoutModal(false)}
                className="px-5 py-3 border border-border rounded-lg"
              >
                <Text className="text-foreground font-medium">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleLogout}
                className="px-5 py-3 bg-red-600 rounded-lg"
              >
                <Text className="text-white font-medium">Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}