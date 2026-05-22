import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, Spacing, Typography, BorderRadius} from '../../theme';
import Badge from '../ui/Badge';
import {TransitionType} from '../../types';
import {useVideoEditor} from '../../hooks/useVideoEditor';
import {useSubscription} from '../../hooks/useSubscription';

const TRANSITIONS: {id: TransitionType; name: string; emoji: string; isPro: boolean}[] = [
  {id: 'fade', name: 'Fade', emoji: '🌫️', isPro: false},
  {id: 'slide_left', name: 'Slide Left', emoji: '⬅️', isPro: false},
  {id: 'slide_right', name: 'Slide Right', emoji: '➡️', isPro: false},
  {id: 'slide_up', name: 'Slide Up', emoji: '⬆️', isPro: false},
  {id: 'slide_down', name: 'Slide Down', emoji: '⬇️', isPro: false},
  {id: 'zoom_in', name: 'Zoom In', emoji: '🔍', isPro: false},
  {id: 'zoom_out', name: 'Zoom Out', emoji: '🔎', isPro: false},
  {id: 'flip', name: 'Flip', emoji: '🔄', isPro: true},
  {id: 'rotate', name: 'Rotate', emoji: '🌀', isPro: true},
  {id: 'dissolve', name: 'Dissolve', emoji: '💧', isPro: true},
  {id: 'wipe', name: 'Wipe', emoji: '🌊', isPro: true},
  {id: 'morph', name: 'Morph', emoji: '✨', isPro: true},
];

const DURATIONS = [
  {label: '0.3s', value: 300},
  {label: '0.5s', value: 500},
  {label: '0.8s', value: 800},
  {label: '1s', value: 1000},
  {label: '1.5s', value: 1500},
];

export default function TransitionsPanel() {
  const {currentScene, updateScene} = useVideoEditor();
  const {isPro, requirePro} = useSubscription();
  const [duration, setDuration] = useState(500);

  const current = currentScene?.transition ?? 'fade';

  const handleSelect = (transition: TransitionType, trans: typeof TRANSITIONS[0]) => {
    if (trans.isPro && !isPro) {
      requirePro('Transition: ' + trans.name);
      return;
    }
    if (!currentScene) {return;}
    updateScene(currentScene.id, {transition, transitionDuration: duration});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scene Transition</Text>
      <Text style={styles.subtitle}>Applied when leaving this scene</Text>

      <FlatList
        data={TRANSITIONS}
        numColumns={3}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          const isActive = current === item.id;
          return (
            <TouchableOpacity
              style={[styles.card, isActive && styles.cardActive]}
              onPress={() => handleSelect(item.id, item)}
              activeOpacity={0.8}>
              {isActive && (
                <LinearGradient
                  colors={[Colors.primaryTransparent20, Colors.transparent]}
                  style={StyleSheet.absoluteFill}
                  borderRadius={BorderRadius.md}
                />
              )}
              <Text style={styles.cardEmoji}>{item.emoji}</Text>
              <Text style={styles.cardName}>{item.name}</Text>
              {item.isPro && !isPro && <Badge label="PRO" variant="gold" small />}
            </TouchableOpacity>
          );
        }}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      />

      {/* Duration */}
      <View style={styles.durationSection}>
        <Text style={styles.durationTitle}>Duration</Text>
        <View style={styles.durationRow}>
          {DURATIONS.map(d => (
            <TouchableOpacity
              key={d.value}
              style={[styles.durationChip, duration === d.value && styles.durationChipActive]}
              onPress={() => {
                setDuration(d.value);
                if (currentScene) {
                  updateScene(currentScene.id, {transitionDuration: d.value});
                }
              }}>
              <Text style={[styles.durationLabel, duration === d.value && styles.durationLabelActive]}>
                {d.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.surface},
  title: {...Typography.h5, color: Colors.textPrimary, padding: Spacing.md, paddingBottom: 0},
  subtitle: {...Typography.caption, color: Colors.textMuted, paddingHorizontal: Spacing.md, marginBottom: Spacing.sm},
  grid: {paddingHorizontal: Spacing.md},
  row: {gap: Spacing.sm, marginBottom: Spacing.sm},
  card: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: '31%',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    overflow: 'hidden',
    position: 'relative',
  },
  cardActive: {borderColor: Colors.primary, borderWidth: 2},
  cardEmoji: {fontSize: 32},
  cardName: {...Typography.caption, color: Colors.textSecondary, fontWeight: '600', textAlign: 'center'},
  durationSection: {
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  durationTitle: {...Typography.h6, color: Colors.textPrimary, marginBottom: Spacing.sm},
  durationRow: {flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap'},
  durationChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  durationChipActive: {backgroundColor: Colors.primaryTransparent20, borderColor: Colors.primary},
  durationLabel: {...Typography.caption, color: Colors.textMuted, fontWeight: '600'},
  durationLabelActive: {color: Colors.primary},
});
