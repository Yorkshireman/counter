import { Audio } from 'expo-av';
import { VolumeManager } from 'react-native-volume-manager';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';

export default function Index() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let sub: { remove: () => void } | null = null;
    let soundObj: Audio.Sound | null = null;

    (async () => {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false
      });

      const { sound } = await Audio.Sound.createAsync(require('../assets/silent.mp3'), {
        isLooping: true,
        shouldPlay: true,
        volume: 0
      });

      soundObj = sound;

      VolumeManager.showNativeVolumeUI({ enabled: false });

      // Set volume so it's not at 0 (so can be changed up or down)
      await VolumeManager.setVolume(0.5);

      // Listen for hardware button presses
      sub = VolumeManager.addVolumeListener(({ volume }) => {
        if (Math.abs(volume - 0.5) < 0.01) return;

        if (volume > 0.5) {
          setCount(c => c + 1);
        } else {
          setCount(c => c - 1);
        }

        VolumeManager.setVolume(0.5);
      });
    })();

    return () => {
      sub?.remove();
      soundObj?.unloadAsync();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.count}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#27187E',
    flex: 1,
    justifyContent: 'center',
    maxWidth: 768,
    paddingHorizontal: 20
  },
  count: {
    color: '#fff',
    fontSize: 200
  }
});
