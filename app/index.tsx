import SystemSetting from 'react-native-system-setting';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';

export default function Index() {
  const [count, setCount] = useState(0);
  const lastValue = useRef(0.5);

  useEffect(() => {
    const listener = SystemSetting.addVolumeListener(({ value }) => {
      setCount(c => c + (value > lastValue.current ? 1 : value < lastValue.current ? -1 : 0));
      lastValue.current = value;
      SystemSetting.setVolume(0.5);
    });

    SystemSetting.setVolume(0.5);
    return () => SystemSetting.removeVolumeListener(listener);
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
