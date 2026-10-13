import {} from 'expo-image';
import { useEffect, useState } from 'react';
import {
  PomodoroManager as manager,
  type PomodoroStep,
} from './pomodoroManager';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  Pressable,
} from 'react-native';

// interface PomodoroStep {
//   limit: number;
//   note: string;
// }

export default function Index() {
  const [timeLeft, setTimeLeft] = useState<number>(1500);
  const [isRunning, setIsrunning] = useState<boolean>(false);
  const [describtion, setDescription] = useState<string>('');

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

  const runTimer = ({ limit, note }: PomodoroStep) => {
    let interval: ReturnType<typeof setInterval> | null = null;
    setDescription(note);
    setTimeLeft(limit);
    if (isRunning && timeLeft >= 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft <= 0) {
      setIsrunning(false);
      clearInterval(interval);
    }
  };

  const startTimer = async (loop: PomodoroStep[]) => {
    setIsrunning(true);
    if (loop.length <= 0) {
      setIsrunning(false);
      return;
    }
    for (let i = 0; i < loop.length; i += 1) {
      await runTimer(loop[i]);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // useEffect(() => {
  //   let interval: ReturnType<typeof setInterval> | null = null;

  //   if (isRunning && timeLeft >= 0) {
  //     interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
  //   } else if (timeLeft === 0) {
  //     setIsrunning(false);
  //   }
  //   return () => {
  //     if (interval) {
  //       clearInterval(interval);
  //     }
  //   };
  // }, [isRunning, timeLeft]);

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

        <View style={styles.controlContainer}>
          <Pressable style={styles.controlButton}>
            <Text
              style={styles.controlText}
              onPress={() => startTimer(classicLoop)}
            >
              start
            </Text>
          </Pressable>
          <Pressable style={styles.controlButton}>
            <Text style={styles.controlText}>pause</Text>
          </Pressable>
          <Pressable style={styles.controlButton}>
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
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    // justifyContent: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: 'black',
    alignItems: 'center',
    paddingTop: 60,
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
});
