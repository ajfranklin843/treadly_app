import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade', animationDuration: 350 }}>
      <Stack.Screen name="index" options={{ animation: 'none' }} />
      <Stack.Screen name="welcome" options={{ animation: 'fade' }} />
      <Stack.Screen name="step1" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="step2" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="step3" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="step4" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="step5" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="step6" options={{ animation: 'fade' }} />
    </Stack>
  );
}
