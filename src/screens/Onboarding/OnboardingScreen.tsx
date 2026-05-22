import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import {useNavigation} from '@react-navigation/native';
import {Colors, Typography, Spacing, BorderRadius} from '../../theme';
import {useAppStore} from '../../store/useAppStore';
import Button from '../../components/ui/Button';

const {width: SCREEN_W} = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    emoji: '🎬',
    title: 'Create Stunning\nCartoon Videos',
    subtitle: 'Transform your ideas into professional cartoon animations with AI-powered tools',
    gradient: [Colors.background, '#1A0A35'],
    accent: Colors.primary,
  },
  {
    id: '2',
    emoji: '🎨',
    title: '15+ Cartoon\nArt Styles',
    subtitle: 'Choose from Anime, Comic, Watercolor, Pixar-style, Cyberpunk and many more stunning visual styles',
    gradient: [Colors.background, '#35001A'],
    accent: Colors.secondary,
  },
  {
    id: '3',
    emoji: '✨',
    title: 'AI-Powered\nScene Generation',
    subtitle: 'Describe your scene and watch our AI instantly create stunning cartoon backgrounds and characters',
    gradient: [Colors.background, '#001A20'],
    accent: Colors.accent,
  },
  {
    id: '4',
    emoji: '🎵',
    title: 'Professional\nAudio Studio',
    subtitle: 'Add music, sound effects, voice recording with cartoon voice effects and AI lip sync',
    gradient: [Colors.background, '#1A1500'],
    accent: Colors.gold,
  },
  {
    id: '5',
    emoji: '📤',
    title: 'Export in 4K\nShare Anywhere',
    subtitle: 'Export your cartoons in stunning 4K quality. Share to YouTube, Instagram, TikTok and more',
    gradient: [Colors.background, '#001A0A'],
    accent: Colors.success,
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation();
  const {setOnboardingDone} = useAppStore();
  const scrollX = useSharedValue(0);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({index: currentIndex + 1});
      setCurrentIndex(currentIndex + 1);
    } else {
      handleGetStarted();
    }
  };

  const handleGetStarted = () => {
    setOnboardingDone(true);
    navigation.navigate('Main' as never);
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        onScroll={e => {
          scrollX.value = e.nativeEvent.contentOffset.x;
          const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
          setCurrentIndex(idx);
        }}
        onMomentumScrollEnd={e => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
          setCurrentIndex(idx);
        }}
        scrollEventThrottle={16}
        renderItem={({item, index}) => (
          <SlideItem
            slide={item}
            index={index}
            scrollX={scrollX}
          />
        )}
      />

      {/* Bottom controls */}
      <View style={styles.controls}>
        {/* Dot indicators */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  width: i === currentIndex ? 24 : 8,
                  backgroundColor:
                    i === currentIndex
                      ? SLIDES[currentIndex].accent
                      : Colors.border,
                },
              ]}
            />
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.btnRow}>
          {currentIndex < SLIDES.length - 1 ? (
            <>
              <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>
              <Button
                label="Next →"
                onPress={handleNext}
                size="lg"
                style={{flex: 1}}
              />
            </>
          ) : (
            <Button
              label="Get Started Free ✨"
              onPress={handleGetStarted}
              size="xl"
              fullWidth
            />
          )}
        </View>

        {currentIndex === SLIDES.length - 1 && (
          <Text style={styles.pricingHint}>
            Free to use • Pro from ₹99/month
          </Text>
        )}
      </View>
    </View>
  );
}

function SlideItem({
  slide,
  index,
  scrollX,
}: {
  slide: typeof SLIDES[0];
  index: number;
  scrollX: Animated.SharedValue<number>;
}) {
  const animStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * SCREEN_W, index * SCREEN_W, (index + 1) * SCREEN_W];
    const scale = interpolate(scrollX.value, inputRange, [0.85, 1, 0.85], Extrapolate.CLAMP);
    const opacity = interpolate(scrollX.value, inputRange, [0.4, 1, 0.4], Extrapolate.CLAMP);
    const translateY = interpolate(scrollX.value, inputRange, [40, 0, 40], Extrapolate.CLAMP);
    return {opacity, transform: [{scale}, {translateY}]};
  });

  return (
    <View style={{width: SCREEN_W}}>
      <LinearGradient
        colors={slide.gradient}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={[styles.slideContent, animStyle]}>
        {/* Big emoji */}
        <View style={[styles.emojiContainer, {borderColor: slide.accent + '44', backgroundColor: slide.accent + '11'}]}>
          <Text style={styles.slideEmoji}>{slide.emoji}</Text>
        </View>

        {/* Title */}
        <Text style={[styles.slideTitle, {color: Colors.textPrimary}]}>
          {slide.title}
        </Text>

        {/* Accent line */}
        <View style={[styles.accentLine, {backgroundColor: slide.accent}]} />

        {/* Subtitle */}
        <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>

        {/* Feature badges */}
        {index === 0 && (
          <View style={styles.featureBadges}>
            {['🎬 Video Editor', '✨ AI Powered', '📱 Mobile-First', '🌍 Multi-Language'].map(f => (
              <View key={f} style={[styles.featureBadge, {borderColor: slide.accent + '44'}]}>
                <Text style={styles.featureBadgeText}>{f}</Text>
              </View>
            ))}
          </View>
        )}
        {index === 4 && (
          <View style={styles.featureBadges}>
            {['4K Quality', 'No Watermark', 'MP4 / MOV / GIF', 'Cloud Backup'].map(f => (
              <View key={f} style={[styles.featureBadge, {borderColor: slide.accent + '44'}]}>
                <Text style={styles.featureBadgeText}>{f}</Text>
              </View>
            ))}
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  slideContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl2,
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    paddingBottom: 220,
    gap: Spacing.lg,
  },
  emojiContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  slideEmoji: {
    fontSize: 72,
  },
  slideTitle: {
    ...Typography.h1,
    textAlign: 'center',
    lineHeight: 48,
  },
  accentLine: {
    width: 60,
    height: 4,
    borderRadius: 2,
    marginVertical: Spacing.xs,
  },
  slideSubtitle: {
    ...Typography.bodyLarge,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 28,
  },
  featureBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  featureBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    backgroundColor: Colors.whiteTransparent5,
  },
  featureBadgeText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? 40 : Spacing.xl,
    paddingTop: Spacing.lg,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.md,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xs,
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    transition: 'width 0.3s',
  },
  btnRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },
  skipBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  skipText: {
    ...Typography.button,
    color: Colors.textMuted,
  },
  pricingHint: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
