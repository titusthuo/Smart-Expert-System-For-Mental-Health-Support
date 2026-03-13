import { Stack } from 'expo-router';
import { View } from 'react-native';


const NotFoundScreen = () => {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 items-center bg-red-400 justify-center">
        
       
      </View>
    </>
  );
};

export default NotFoundScreen;
