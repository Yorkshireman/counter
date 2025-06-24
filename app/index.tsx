import { Audio } from 'expo-av';
import { VolumeManager } from 'react-native-volume-manager';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';

export default function Index() {
  const programmaticVolumeChangeRef = useRef(false);
  const [count, setCount] = useState(0);
  const didMount = useRef(false);

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

      sub = VolumeManager.addVolumeListener(({ volume }) => {
        console.log({ programmaticVolumeChangeRef: programmaticVolumeChangeRef.current });
        if (programmaticVolumeChangeRef.current) {
          programmaticVolumeChangeRef.current = false;
          return;
        }

        setCount(c => c + 1);
      });
    })();

    return () => {
      sub?.remove();
      soundObj?.unloadAsync();
    };
  }, []);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    const resetVolume = async () => {
      programmaticVolumeChangeRef.current = true;
      await VolumeManager.setVolume(0.5);
    };

    resetVolume();
  }, [count]);

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
