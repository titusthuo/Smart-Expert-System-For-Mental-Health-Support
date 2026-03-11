import { AppText } from "@/components/ui";
import React from "react";
import { Image, TextInput, TouchableOpacity, View } from "react-native";
import { Mail, Phone, User } from "lucide-react-native";

export type ProfileData = {
  name: string;
  email: string;
  phone: string;
};

export function ProfileFormCard({
  profileData,
  profilePhotoUri,
  onPressAvatar,
  onChangeProfileData,
  onPressSave,
}: {
  profileData: ProfileData;
  profilePhotoUri: string | null;
  onPressAvatar: () => void;
  onChangeProfileData: (next: ProfileData) => void;
  onPressSave: () => void;
}) {
  return (
    <View className="bg-card rounded-2xl p-6 mb-6 shadow-sm border border-border">
      <View className="items-center mb-6">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPressAvatar}
          className="w-24 h-24 bg-brandSoft rounded-full items-center justify-center mb-4 overflow-hidden"
          accessibilityRole="button"
          accessibilityLabel="Profile photo actions"
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

        <AppText unstyled className="text-xl font-semibold text-foreground">
          {profileData.name}
        </AppText>
        <AppText unstyled className="text-muted-foreground mt-1">
          {profileData.email}
        </AppText>
      </View>

      <View className="h-px bg-border my-6" />

      <View className="space-y-5">
        <View>
          <AppText unstyled className="text-muted-foreground font-medium mb-2">
            Full Name
          </AppText>
          <View className="relative">
            <User size={20} color="#9ca3af" className="absolute left-3 top-3.5 z-10" />
            <TextInput
              value={profileData.name}
              onChangeText={(text) =>
                onChangeProfileData({ ...profileData, name: text })
              }
              className="bg-background border border-border rounded-lg py-3 pl-11 pr-4 text-foreground"
              placeholder="Enter your name"
              placeholderTextColor="#6b7280"
            />
          </View>
        </View>

        <View>
          <AppText unstyled className="text-muted-foreground font-medium mb-2">
            Email Address
          </AppText>
          <View className="relative">
            <Mail size={20} color="#9ca3af" className="absolute left-3 top-3.5 z-10" />
            <TextInput
              value={profileData.email}
              onChangeText={(text) =>
                onChangeProfileData({ ...profileData, email: text })
              }
              keyboardType="email-address"
              className="bg-background border border-border rounded-lg py-3 pl-11 pr-4 text-foreground"
              placeholder="Enter your email"
              placeholderTextColor="#6b7280"
            />
          </View>
        </View>

        <View>
          <AppText unstyled className="text-muted-foreground font-medium mb-2">
            Phone Number
          </AppText>
          <View className="relative">
            <Phone size={20} color="#9ca3af" className="absolute left-3 top-3.5 z-10" />
            <TextInput
              value={profileData.phone}
              onChangeText={(text) =>
                onChangeProfileData({ ...profileData, phone: text })
              }
              keyboardType="phone-pad"
              className="bg-background border border-border rounded-lg py-3 pl-11 pr-4 text-foreground"
              placeholder="Enter your phone"
              placeholderTextColor="#6b7280"
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={onPressSave}
          className="bg-brand py-4 rounded-lg items-center active:opacity-90"
          accessibilityRole="button"
          accessibilityLabel="Save profile changes"
        >
          <AppText unstyled className="text-white font-medium text-base">
            Save Changes
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
}
