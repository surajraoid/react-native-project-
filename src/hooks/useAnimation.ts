import {useEffect} from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

export function useFadeIn(delay = 0) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    setTimeout(() => {
      opacity.value = withTiming(1, {duration: 400, easing: Easing.out(Easing.quad)});
      translateY.value = withSpring(0, {damping: 20, stiffness: 200});
    }, delay);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{translateY: translateY.value}],
  }));

  return style;
}

export function useScalePress(activeScale = 0.95) {
  const scale = useSharedValue(1);

  const onPressIn = () => {
    scale.value = withSpring(activeScale, {damping: 15, stiffness: 300});
  };
  const onPressOut = () => {
    scale.value = withSpring(1, {damping: 15, stiffness: 300});
  };

  const style = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return {style, onPressIn, onPressOut};
}

export function usePulse(minScale = 0.97, maxScale = 1.03, duration = 1200) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(maxScale, {duration: duration / 2}),
        withTiming(minScale, {duration: duration / 2}),
      ),
      -1,
      true,
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));
}

export function useShimmer() {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {duration: 1500, easing: Easing.linear}),
      -1,
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.5, 1], [0.3, 0.7, 0.3]),
  }));

  return style;
}

export function useSlideIn(
  direction: 'left' | 'right' | 'up' | 'down' = 'up',
  distance = 30,
  delay = 0,
) {
  const translateX = useSharedValue(
    direction === 'left' ? -distance : direction === 'right' ? distance : 0,
  );
  const translateY = useSharedValue(
    direction === 'up' ? distance : direction === 'down' ? -distance : 0,
  );
  const opacity = useSharedValue(0);

  useEffect(() => {
    setTimeout(() => {
      translateX.value = withSpring(0, {damping: 20, stiffness: 200});
      translateY.value = withSpring(0, {damping: 20, stiffness: 200});
      opacity.value = withTiming(1, {duration: 300});
    }, delay);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay]);

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{translateX: translateX.value}, {translateY: translateY.value}],
  }));
}

export {Animated, useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS};
