import { ActivitySummaryCard } from "@/components/profile/activity-summary-card";
import { AppearanceCard, ThemeMode } from "@/components/profile/appearance-card";
import { EmergencyResourcesCard } from "@/components/profile/emergency-resources-card";
import { LogoutButton } from "@/components/profile/logout-button";
import { AvatarActionsModal } from "@/components/profile/modals/avatar-actions-modal";
import { InfoDialogModal } from "@/components/profile/modals/info-dialog-modal";
import { LogoutConfirmModal } from "@/components/profile/modals/logout-confirm-modal";
import { PhotoConfirmModal } from "@/components/profile/modals/photo-confirm-modal";
import { PhotoViewerModal } from "@/components/profile/modals/photo-viewer-modal";
import { ProfileData, ProfileFormCard } from "@/components/profile/profile-form-card";
import { ProfileHeader } from "@/components/profile/profile-header";
import { SettingsCard } from "@/components/profile/settings-card";
import { useThemePreference } from "@/hooks/use-theme-preference";
import {
  getStoredJson,
  getStoredString,
  removeStoredItem,
  setStoredJson,
  setStoredString,
} from "@/lib/storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router"; // ← if using expo-router
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { useNavigation } from '@react-navigation/native'; // alternative

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

  const [profileData, setProfileData] = useState<ProfileData>({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+254 712 345 678",
  });

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const parsed = await getStoredJson<Partial<typeof profileData>>(
          "profileData",
        );
        if (!mounted || !parsed) return;
        if (!parsed || typeof parsed !== "object") return;

        setProfileData((p) => ({
          ...p,
          ...(typeof parsed.name === "string" ? { name: parsed.name } : null),
          ...(typeof parsed.email === "string" ? { email: parsed.email } : null),
          ...(typeof parsed.phone === "string" ? { phone: parsed.phone } : null),
        }));
      } catch {
        // ignore
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setStoredJson("profileData", profileData).catch(() => undefined);
  }, [profileData]);

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
        const stored = await getStoredString("profilePhotoUri");
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
    setStoredString("profilePhotoUri", profilePhotoUri ?? "").catch(
      () => undefined,
    );
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
    removeStoredItem("profilePhotoUri").catch(() => undefined);
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
      <ProfileHeader />

      <ScrollView
        className="flex-1 px-4 pt-6"
        contentContainerStyle={{ paddingBottom: 28 }}
      >
        {/* Profile Card */}
        <ProfileFormCard
          profileData={profileData}
          profilePhotoUri={profilePhotoUri}
          onPressAvatar={() => setAvatarMenuVisible(true)}
          onChangeProfileData={setProfileData}
          onPressSave={handleSaveProfile}
        />

        {/* Activity Summary */}
        <ActivitySummaryCard />

        {/* Appearance */}
        <AppearanceCard
          mode={mode as ThemeMode}
          onChangeMode={(nextMode) => setMode(nextMode)}
        />

        {/* Settings */}
        <SettingsCard
          notificationsEnabled={notificationsEnabled}
          onChangeNotifications={setNotificationsEnabled}
          onPressPrivacy={() =>
            openInfoDialog("Privacy & Security", "Privacy settings coming soon")
          }
          onPressHelp={() =>
            openInfoDialog("Help & Support", "Help & Support coming soon")
          }
        />

        {/* Emergency Resources */}
        <EmergencyResourcesCard />

        {/* Logout Button */}
        <LogoutButton onPress={() => setShowLogoutModal(true)} />
      </ScrollView>

      {/* Info Dialog (theme-aware) */}
      <InfoDialogModal
        visible={infoDialog.visible}
        title={infoDialog.title}
        message={infoDialog.message}
        onClose={() => setInfoDialog((p) => ({ ...p, visible: false }))}
      />

      {/* Confirm Selected Photo */}
      <PhotoConfirmModal
        visible={photoConfirmVisible}
        pendingUri={pendingProfilePhotoUri}
        fallbackInitials={avatarInitials}
        onCancel={cancelProfilePhoto}
        onConfirm={confirmProfilePhoto}
      />

      {/* Avatar Actions */}
      <AvatarActionsModal
        visible={avatarMenuVisible}
        hasPhoto={!!profilePhotoUri}
        onRequestClose={() => setAvatarMenuVisible(false)}
        onPressUploadOrChange={async () => {
          setAvatarMenuVisible(false);
          await pickProfilePhoto({ allowEditing: false });
        }}
        onPressView={() => {
          setAvatarMenuVisible(false);
          setPhotoViewerVisible(true);
        }}
        onPressRemove={() => {
          removeProfilePhoto();
          setAvatarMenuVisible(false);
        }}
      />

      {/* Photo Viewer */}
      <PhotoViewerModal
        visible={photoViewerVisible}
        photoUri={profilePhotoUri}
        fallbackInitials={avatarInitials}
        onClose={() => setPhotoViewerVisible(false)}
      />

      {/* Logout Modal */}
      <LogoutConfirmModal
        visible={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </SafeAreaView>
  );
}