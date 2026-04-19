import { ActivitySummaryCard } from "@/components/profile/activity-summary-card";
import {
    AppearanceCard,
    ThemeMode,
} from "@/components/profile/appearance-card";
import { EmergencyResourcesCard } from "@/components/profile/emergency-resources-card";
import { LogoutButton } from "@/components/profile/logout-button";
import { AvatarActionsModal } from "@/components/profile/modals/avatar-actions-modal";
import { InfoDialogModal } from "@/components/profile/modals/info-dialog-modal";
import { LogoutConfirmModal } from "@/components/profile/modals/logout-confirm-modal";
import { PhotoConfirmModal } from "@/components/profile/modals/photo-confirm-modal";
import { PhotoViewerModal } from "@/components/profile/modals/photo-viewer-modal";
import {
    ProfileData,
    ProfileFormCard,
} from "@/components/profile/profile-form-card";
import { ProfileHeader } from "@/components/profile/profile-header";
import { SettingsCard } from "@/components/profile/settings-card";
import { apolloClient } from "@/graphql/client";
import {
    useRemoveProfilePictureMutation,
    useUpdateProfileMutation,
    useUploadProfilePictureMutation,
} from "@/graphql/generated/graphql";
import { useThemePreference } from "@/hooks/use-theme-preference";
import { useAuthSession } from "@/stores/useAuthSession";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Import ReactNativeFile using require for compatibility
const { ReactNativeFile } = require("apollo-upload-client");

export default function ProfileScreen() {
  const router = useRouter();
  const { mode, setMode } = useThemePreference();
  const clearSession = useAuthSession((s) => s.clearSession);
  const session = useAuthSession((s) => s.session);
  const setSession = useAuthSession((s) => s.setSession);

  const [updateProfileMutation, { loading: updatingProfile }] =
    useUpdateProfileMutation();
  const [uploadProfilePictureMutation, { loading: uploadingPhoto }] =
    useUploadProfilePictureMutation();
  const [removeProfilePictureMutation] = useRemoveProfilePictureMutation();

  const [profilePhotoUri, setProfilePhotoUri] = useState<string | null>(
    session?.profile?.photoUri || null,
  );
  const [pendingProfilePhotoUri, setPendingProfilePhotoUri] = useState<
    string | null
  >(null);
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
    name:
      session?.profile?.name ||
      session?.user?.name ||
      session?.user?.username ||
      "User",
    email: session?.profile?.email || session?.user?.email || "",
    phone: session?.profile?.phone || session?.user?.phone || "",
  });

  useEffect(() => {
    // Initialize profile data from session only once on mount
    if (session?.profile) {
      setProfileData({
        name:
          session.profile.name ||
          session.user?.name ||
          session.user?.username ||
          "User",
        email: session.profile.email || session.user?.email || "",
        phone: session.profile.phone || session.user?.phone || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Removed auto-sync effect to prevent infinite loops.
  // Profile data is now only saved to session when user clicks Save.

  const avatarInitials = useMemo(() => {
    const parts = profileData.name.trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
    return (first + last).toUpperCase() || "U";
  }, [profileData.name]);

  useEffect(() => {
    // Initialize profile photo from session only once on mount
    if (session?.profile?.photoUri) {
      setProfilePhotoUri(session.profile.photoUri);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Removed auto-sync effect for profile photo.
  // Photo is saved to session when user confirms it.

  const pickProfilePhoto = async ({
    allowEditing,
  }: {
    allowEditing: boolean;
  }) => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== "granted") {
      openInfoDialog(
        "Permission needed",
        "Please allow photo library access to upload a profile photo.",
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

  const removeProfilePhoto = async () => {
    try {
      const result = await removeProfilePictureMutation();

      if (result.data?.removeProfilePicture?.success) {
        setProfilePhotoUri(null);

        // Update session to remove photo
        if (session) {
          await setSession({
            ...session,
            profile: {
              ...session.profile,
              photoUri: null,
            },
          });
        }

        openInfoDialog("Success", "Profile photo removed");
      } else {
        const error =
          result.data?.removeProfilePicture?.error || "Failed to remove photo";
        openInfoDialog("Error", error);
      }
    } catch (error) {
      console.error("Remove photo error:", error);
      openInfoDialog("Error", "Failed to remove photo. Please try again.");
    }
  };

  const confirmProfilePhoto = async () => {
    if (!pendingProfilePhotoUri) {
      setPhotoConfirmVisible(false);
      return;
    }

    try {
      // Create ReactNativeFile instance for upload
      const file = new ReactNativeFile({
        uri: pendingProfilePhotoUri,
        name: `profile-${Date.now()}.jpg`,
        type: "image/jpeg",
      });

      const result = await uploadProfilePictureMutation({
        variables: { file },
      });

      if (
        result.data?.uploadProfilePicture?.success &&
        result.data.uploadProfilePicture.user
      ) {
        const photoUrl =
          result.data.uploadProfilePicture.user.profilePictureUrl;

        // Update local state with backend URL
        setProfilePhotoUri(photoUrl || null);
        setPendingProfilePhotoUri(null);
        setPhotoConfirmVisible(false);

        // Update session with backend photo URL
        if (session) {
          await setSession({
            ...session,
            profile: {
              ...session.profile,
              photoUri: photoUrl,
            },
          });
        }

        openInfoDialog("Success", "Profile photo uploaded successfully");
      } else {
        const error =
          result.data?.uploadProfilePicture?.error || "Failed to upload photo";
        openInfoDialog("Error", error);
        setPendingProfilePhotoUri(null);
        setPhotoConfirmVisible(false);
      }
    } catch (error) {
      console.error("Photo upload error:", error);
      openInfoDialog("Error", "Failed to upload photo. Please try again.");
      setPendingProfilePhotoUri(null);
      setPhotoConfirmVisible(false);
    }
  };

  const cancelProfilePhoto = () => {
    setPendingProfilePhotoUri(null);
    setPhotoConfirmVisible(false);
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    openInfoDialog("Logged out", "You have been logged out successfully");

    (async () => {
      try {
        await clearSession();
        await apolloClient.resetStore();
      } catch {
        // ignore
      }
    })();
    setTimeout(() => {
      router.replace("/(auth)/sign-in");
    }, 350);
  };

  const handleSaveProfile = async () => {
    try {
      // Call backend mutation to persist profile changes
      const result = await updateProfileMutation({
        variables: {
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
        },
      });

      if (
        result.data?.updateProfile?.success &&
        result.data.updateProfile.user
      ) {
        const updatedUser = result.data.updateProfile.user;

        // Update session with backend response
        if (session) {
          await setSession({
            ...session,
            user: {
              id: updatedUser.id,
              username: updatedUser.username,
              email: updatedUser.email || null,
              name: updatedUser.name || null,
              phone: updatedUser.phone || null,
              country: updatedUser.country || null,
            },
            profile: {
              name: updatedUser.name || updatedUser.username || "User",
              email: updatedUser.email || "",
              phone: updatedUser.phone || "",
              photoUri: profilePhotoUri,
            },
          });
        }

        openInfoDialog("Success", "Profile updated successfully");
      } else {
        const error =
          result.data?.updateProfile?.error || "Failed to update profile";
        openInfoDialog("Error", error);
      }
    } catch (error) {
      console.error("Profile update error:", error);
      openInfoDialog("Error", "Failed to update profile. Please try again.");
    }
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
          loading={updatingProfile}
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
