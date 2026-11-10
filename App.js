import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Text style={styles.title}>Hello</Text>
      <Text style={styles.subtitle}>能看到这一行，说明链路通了</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>运行平台</Text>
          <Text style={styles.value}>{Platform.OS}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.label}>系统版本</Text>
          <Text style={styles.value}>{String(Platform.Version)}</Text>
        </View>
      </View>

      <Pressable
        onPress={() => setCount((c) => c + 1)}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Text style={styles.buttonText}>点我 {count}</Text>
      </Pressable>

      <Text style={styles.hint}>点一下，数字应该会往上加</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1220',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  title: {
    fontSize: 44,
    fontWeight: '500',
    color: '#EAF2FF',
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 14,
    color: '#7E8CA0',
  },
  card: {
    marginTop: 40,
    width: '100%',
    backgroundColor: '#141E30',
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 18,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#25324A',
  },
  label: {
    fontSize: 14,
    color: '#7E8CA0',
  },
  value: {
    fontSize: 14,
    color: '#EAF2FF',
    fontVariant: ['tabular-nums'],
  },
  button: {
    marginTop: 36,
    width: '100%',
    backgroundColor: '#2F6BFF',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonPressed: {
    backgroundColor: '#2454CC',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  hint: {
    marginTop: 16,
    fontSize: 12,
    color: '#5A6779',
  },
});
