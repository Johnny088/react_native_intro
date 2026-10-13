import {} from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import { PomodoroManager, type PomodoroStep } from './pomodoroManager';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  Pressable,
} from 'react-native';

const classicLoop: PomodoroStep[] = [
  { limit: 25 * 60, note: 'first session' },
  { limit: 5 * 60, note: 'break' },
  { limit: 25 * 60, note: 'second session' },
  { limit: 5 * 60, note: 'break' },
  { limit: 25 * 60, note: 'third session' },
  { limit: 5 * 60, note: 'break' },
  { limit: 25 * 60, note: 'last session' },
  { limit: 30 * 60, note: 'break' },
];

export default function Index() {
  const [timeLeft, setTimeLeft] = useState<number>(1500);
  const [note, setNote] = useState<string>('');

  const managerRef = useRef(new PomodoroManager(classicLoop));

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const manager = managerRef.current;
    manager.subscribe((newTimeLeft, newNote) => {
      setTimeLeft(newTimeLeft);
      setNote(newNote);
    });
    manager.notify();
    return () => {
      manager.pause();
    };
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.background}
        source={require('../../assets/images/vertical_ocean.jpg')}
        imageStyle={{ opacity: 0.9 }}
      >
        <Text style={styles.title}>Pomodoro app</Text>

        <View style={styles.timerCircle}>
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </View>
        <View>
          <Text style={styles.currentTask}>{note}</Text>
        </View>

        <View style={styles.controlContainer}>
          <Pressable
            style={styles.controlButton}
            onPress={() => managerRef.current.startTimer()}
          >
            <Text style={styles.controlText}>start</Text>
          </Pressable>
          <Pressable
            style={styles.controlButton}
            onPress={() => managerRef.current.pause()}
          >
            <Text style={styles.controlText}>pause</Text>
          </Pressable>
          <Pressable
            style={styles.controlButton}
            onPress={() => managerRef.current.clear()}
          >
            <Text style={styles.controlText}>clear</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
    alignItems: 'center',

    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',

    alignItems: 'center',
    paddingTop: 60,
    color: '#F0F4F8',
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  timerCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    marginTop: 60,
    marginBottom: 40,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  controlContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  controlButton: {
    backgroundColor: 'white',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  controlText: {
    fontSize: 24,
  },
  currentTask: {
    fontSize: 24,
    fontWeight: 'bold',

    color: '#F0F4F8',
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    marginBottom: 40,
  },
});
