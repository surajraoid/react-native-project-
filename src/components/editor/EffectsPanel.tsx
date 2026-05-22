import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList} from 'react-native';
import LinearGradient from 'expo-linear-gradient';
import {Colors, Spacing, Typography, BorderRadius} from '../../theme';
import Badge from '../ui/Badge';
import {EFFECT_CATEGORIES, CARTOON_STYLES} from '../../utils/constants';
import {useSubscription} from '../../hooks/useSubscription';

interface Effect {
  id: string;
  name: string;
  emoji: string;
  category: string;
  isPro: boolean;
  intensity: number;
}

const EFFECTS: Effect[] = [
  {id: 'anime_outline', name: 'Anime Outline', emoji: '🎌', category: 'cartoon_style', isPro: false, intensity: 0.8},
  {id: 'comic_dots', name: 'Comic Dots', emoji: '💥', category: 'halftone', isPro: false, intensity: 0.6},
  {id: 'watercolor_wash', name: 'Watercolor', emoji: '🎨', category: 'cartoon_style', isPro: false, intensity: 0.7},
  {id: 'cel_shade', name: 'Cel Shading', emoji: '🖊️', category: 'outline', isPro: true, intensity: 1.0},
  {id: 'neon_glow', name: 'Neon Glow', emoji: '✨', category: 'neon', isPro: true, intensity: 0.75},
  {id: 'vhs_glitch', name: 'VHS Glitch', emoji: '📺', category: 'vintage', isPro: true, intensity: 0.5},
  {id: 'oil_paint', name: 'Oil Paint', emoji: '🖼️', category: 'cartoon_style', isPro: true, intensity: 0.9},
  {id: 'soft_blur', name: 'Soft Blur', emoji: '🔮', category: 'blur', isPro: false, intensity: 0.4},
  {id: 'chromatic_ab', name: 'Chromatic Ab.', emoji: '🌈', category: 'distort', isPro: true, intensity: 0.3},
  {id: 'vignette', name: 'Vignette', emoji: '⬛', category: 'vignette', isPro: false, intensity: 0.5},
  {id: 'pixel_art', name: 'Pixel Art', emoji: '👾', category: 'cartoon_style', isPro: true, intensity: 1.0},
  {id: 'dreamy_glow', name: 'Dreamy Glow', emoji: '🌟', category: 'glow', isPro: true, intensity: 0.6},
  {id: 'film_grain', name: 'Film Grain', emoji: '🎞️', category: 'noise', isPro: false, intensity: 0.3},
  {id: 'toon_shade', name: 'Toon Shade', emoji: '🎯', category: 'cartoon_style', isPro: true, intensity: 0.8},
  {id: 'color_pop', name: 'Color Pop', emoji: '🌺', category: 'color_grade', isPro: false, intensity: 0.7},
  {id: 'sparkle', name: 'Sparkle', emoji: '💫', category: 'particle', isPro: true, intensity: 0.6},
];

export default function EffectsPanel() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [appliedEffects, setAppliedEffects] = useState<string[]>([]);
  const {isPro, requirePro} = useSubscription();

  const filtered = activeCategory === 'all'
    ? EFFECTS
    : EFFECTS.filter(e => e.category === activeCategory);

  const toggleEffect = (effect: Effect) => {
    if (effect.isPro && !isPro) {
      requirePro('Effect: ' + effect.name);
      return;
    }
    setAppliedEffects(prev =>
      prev.includes(effect.id) ? prev.filter(id => id !== effect.id) : [...prev, effect.id],
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Effects & Filters</Text>

      {/* Category chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesRow}
        style={styles.categoriesScroll}>
        <TouchableOpacity
          style={[styles.categoryChip, activeCategory === 'all' && styles.categoryChipActive]}
          onPress={() => setActiveCategory('all')}>
          <Text style={styles.categoryChipText}>All</Text>
        </TouchableOpacity>
        {EFFECT_CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.categoryChip, activeCategory === cat.id && styles.categoryChipActive]}
            onPress={() => setActiveCategory(cat.id)}>
            <Text style={styles.categoryChipText}>{cat.emoji} {cat.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Effects grid */}
      <FlatList
        data={filtered}
        numColumns={2}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          const isApplied = appliedEffects.includes(item.id);
          return (
            <TouchableOpacity
              style={[styles.effectCard, isApplied && styles.effectCardActive]}
              onPress={() => toggleEffect(item)}
              activeOpacity={0.8}>
              {isApplied && (
                <LinearGradient
                  colors={[Colors.primary + '33', Colors.primaryDark + '22']}
                  style={StyleSheet.absoluteFill}
                />
              )}
              <Text style={styles.effectEmoji}>{item.emoji}</Text>
              <Text style={styles.effectName}>{item.name}</Text>
              <View style={styles.effectFooter}>
                {item.isPro && !isPro ? (
                  <Badge label="PRO" variant="gold" small />
                ) : isApplied ? (
                  <Badge label="ON" variant="primary" small />
                ) : (
                  <Badge label="OFF" variant="outline" small />
                )}
              </View>
              {item.isPro && !isPro && (
                <View style={styles.proLock}>
                  <Text style={styles.lockEmoji}>🔒</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        }}
        columnWrapperStyle={styles.effectsRow}
        contentContainerStyle={styles.effectsList}
        showsVerticalScrollIndicator={false}
      />

      {/* Cartoon Style Section */}
      <Text style={[styles.title, {marginTop: Spacing.md}]}>Cartoon Styles</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stylesRow}>
        {CARTOON_STYLES.map(style => (
          <TouchableOpacity
            key={style.id}
            style={styles.styleCard}
            onPress={() => style.isPro && !isPro ? requirePro('Style: ' + style.name) : null}>
            <View style={[styles.stylePreview, {backgroundColor: style.color + '33', borderColor: style.color}]}>
              <Text style={styles.styleEmoji}>{style.icon}</Text>
            </View>
            <Text style={styles.styleName}>{style.name}</Text>
            {style.isPro && !isPro && <Badge label="PRO" variant="gold" small />}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
  },
  title: {
    ...Typography.h5,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  categoriesScroll: {
    marginBottom: Spacing.sm,
    flexGrow: 0,
  },
  categoriesRow: {
    gap: Spacing.xs,
    paddingRight: Spacing.md,
  },
  categoryChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryChipActive: {
    backgroundColor: Colors.primaryTransparent20,
    borderColor: Colors.primary,
  },
  categoryChipText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  effectsRow: {
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  effectsList: {
    gap: Spacing.sm,
  },
  effectCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 100,
    justifyContent: 'center',
  },
  effectCardActive: {
    borderColor: Colors.primary,
  },
  effectEmoji: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  effectName: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  effectFooter: {
    alignItems: 'center',
  },
  proLock: {
    position: 'absolute',
    top: Spacing.xs,
    right: Spacing.xs,
  },
  lockEmoji: {fontSize: 14},
  stylesRow: {
    gap: Spacing.sm,
    paddingBottom: Spacing.base,
  },
  styleCard: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  stylePreview: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  styleEmoji: {fontSize: 32},
  styleName: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
