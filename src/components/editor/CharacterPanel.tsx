import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList} from 'react-native';
import {Colors, Spacing, Typography, BorderRadius} from '../../theme';
import Badge from '../ui/Badge';
import {ANIMATION_TYPES} from '../../utils/constants';
import {useVideoEditor} from '../../hooks/useVideoEditor';
import {useSubscription} from '../../hooks/useSubscription';

type CharacterCategory = 'all' | 'human' | 'animal' | 'fantasy' | 'robot' | 'cartoon' | 'custom';

const CHARACTERS = [
  {id: 'c1', name: 'Hero Boy', emoji: '🦸‍♂️', category: 'human', isPro: false, style: 'anime'},
  {id: 'c2', name: 'Hero Girl', emoji: '🦸‍♀️', category: 'human', isPro: false, style: 'anime'},
  {id: 'c3', name: 'Wizard', emoji: '🧙‍♂️', category: 'fantasy', isPro: false, style: 'fantasy'},
  {id: 'c4', name: 'Robot', emoji: '🤖', category: 'robot', isPro: true, style: 'cyberpunk'},
  {id: 'c5', name: 'Dragon', emoji: '🐉', category: 'fantasy', isPro: true, style: 'fantasy'},
  {id: 'c6', name: 'Cat', emoji: '🐱', category: 'animal', isPro: false, style: 'chibi'},
  {id: 'c7', name: 'Fox', emoji: '🦊', category: 'animal', isPro: false, style: 'chibi'},
  {id: 'c8', name: 'Alien', emoji: '👽', category: 'cartoon', isPro: true, style: 'cartoon'},
  {id: 'c9', name: 'Princess', emoji: '👸', category: 'human', isPro: false, style: 'anime'},
  {id: 'c10', name: 'Knight', emoji: '🏰', category: 'human', isPro: true, style: 'fantasy'},
  {id: 'c11', name: 'Bear', emoji: '🐻', category: 'animal', isPro: false, style: 'chibi'},
  {id: 'c12', name: 'Vampire', emoji: '🧛', category: 'fantasy', isPro: true, style: 'fantasy'},
  {id: 'c13', name: 'Ninja', emoji: '🥷', category: 'human', isPro: true, style: 'anime'},
  {id: 'c14', name: 'Unicorn', emoji: '🦄', category: 'fantasy', isPro: false, style: 'fantasy'},
  {id: 'c15', name: 'Dinosaur', emoji: '🦕', category: 'animal', isPro: false, style: 'cartoon'},
  {id: 'c16', name: 'Astronaut', emoji: '👨‍🚀', category: 'human', isPro: true, style: 'cyberpunk'},
];

const CATEGORIES: {id: CharacterCategory; label: string; emoji: string}[] = [
  {id: 'all', label: 'All', emoji: '🌟'},
  {id: 'human', label: 'Human', emoji: '🧑'},
  {id: 'animal', label: 'Animal', emoji: '🐾'},
  {id: 'fantasy', label: 'Fantasy', emoji: '🧙'},
  {id: 'robot', label: 'Robot', emoji: '🤖'},
  {id: 'cartoon', label: 'Cartoon', emoji: '🎨'},
];

export default function CharacterPanel() {
  const [activeCategory, setActiveCategory] = useState<CharacterCategory>('all');
  const [selectedChar, setSelectedChar] = useState<string | null>(null);
  const [selectedAnimation, setSelectedAnimation] = useState('idle');
  const {addCharacterToCurrentScene} = useVideoEditor();
  const {isPro, requirePro} = useSubscription();

  const filtered = activeCategory === 'all'
    ? CHARACTERS
    : CHARACTERS.filter(c => c.category === activeCategory);

  const handleAddCharacter = (char: typeof CHARACTERS[0]) => {
    if (char.isPro && !isPro) {
      requirePro('Character: ' + char.name);
      return;
    }
    addCharacterToCurrentScene({
      name: char.name,
      avatarUri: char.emoji,
      style: char.style as never,
      transform: {
        position: {x: 0.3, y: 0.3},
        scale: 1,
        rotation: 0,
        flipX: false,
        flipY: false,
      },
      animation: selectedAnimation as never,
      isVisible: true,
      opacity: 1,
      layer: 5,
      effects: [],
    });
  };

  return (
    <View style={styles.container}>
      {/* Category filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.catScroll}
        contentContainerStyle={styles.catRow}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.catChip, activeCategory === cat.id && styles.catChipActive]}
            onPress={() => setActiveCategory(cat.id)}>
            <Text style={styles.catEmoji}>{cat.emoji}</Text>
            <Text style={[styles.catLabel, activeCategory === cat.id && styles.catLabelActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Character Grid */}
      <FlatList
        data={filtered}
        numColumns={3}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          const isSelected = selectedChar === item.id;
          return (
            <TouchableOpacity
              style={[styles.charCard, isSelected && styles.charCardSelected]}
              onPress={() => setSelectedChar(item.id)}
              activeOpacity={0.8}>
              <Text style={styles.charEmoji}>{item.emoji}</Text>
              <Text style={styles.charName} numberOfLines={1}>{item.name}</Text>
              {item.isPro && !isPro && (
                <View style={styles.proOverlay}>
                  <Badge label="PRO" variant="gold" small />
                </View>
              )}
            </TouchableOpacity>
          );
        }}
        columnWrapperStyle={styles.charRow}
        contentContainerStyle={styles.charGrid}
        showsVerticalScrollIndicator={false}
        style={styles.list}
      />

      {/* Add controls */}
      {selectedChar && (
        <View style={styles.addControls}>
          <Text style={styles.addControlsTitle}>Animation:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.animRow}>
            {ANIMATION_TYPES.map(anim => (
              <TouchableOpacity
                key={anim.id}
                style={[styles.animChip, selectedAnimation === anim.id && styles.animChipActive]}
                onPress={() => setSelectedAnimation(anim.id)}>
                <Text style={styles.animEmoji}>{anim.icon}</Text>
                <Text style={[styles.animLabel, selectedAnimation === anim.id && styles.animLabelActive]}>
                  {anim.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.addCharBtn}
            onPress={() => {
              const char = CHARACTERS.find(c => c.id === selectedChar);
              if (char) {handleAddCharacter(char);}
            }}>
            <Text style={styles.addCharBtnText}>+ Add to Scene</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Upload custom */}
      <View style={styles.uploadSection}>
        <TouchableOpacity
          style={styles.uploadBtn}
          onPress={() => requirePro('Custom Character Upload')}>
          <Text style={styles.uploadEmoji}>📸</Text>
          <Text style={styles.uploadTitle}>Upload Custom Character</Text>
          <Text style={styles.uploadDesc}>Import your own PNG/SVG character</Text>
          {!isPro && <Badge label="PRO" variant="gold" />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.surface},
  catScroll: {flexGrow: 0, borderBottomWidth: 1, borderBottomColor: Colors.border},
  catRow: {
    flexDirection: 'row',
    padding: Spacing.sm,
    gap: Spacing.xs,
    paddingRight: Spacing.md,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.xs2,
  },
  catChipActive: {
    backgroundColor: Colors.primaryTransparent20,
    borderColor: Colors.primary,
  },
  catEmoji: {fontSize: 14},
  catLabel: {...Typography.caption, color: Colors.textSecondary, fontWeight: '600'},
  catLabelActive: {color: Colors.primary},
  list: {flex: 1},
  charRow: {gap: Spacing.sm, marginBottom: Spacing.sm},
  charGrid: {padding: Spacing.md, gap: Spacing.sm},
  charCard: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.xs,
    position: 'relative',
    overflow: 'hidden',
    maxWidth: '33%',
    padding: Spacing.sm,
  },
  charCardSelected: {borderColor: Colors.primary, borderWidth: 2, backgroundColor: Colors.primaryTransparent10},
  charEmoji: {fontSize: 36},
  charName: {...Typography.caption, color: Colors.textSecondary, textAlign: 'center', fontWeight: '600'},
  proOverlay: {position: 'absolute', top: Spacing.xs, right: Spacing.xs},
  addControls: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    padding: Spacing.md,
    backgroundColor: Colors.card,
  },
  addControlsTitle: {...Typography.caption, color: Colors.textMuted, fontWeight: '600', marginBottom: Spacing.sm},
  animRow: {gap: Spacing.xs, marginBottom: Spacing.sm, paddingRight: Spacing.md},
  animChip: {
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 2,
  },
  animChipActive: {backgroundColor: Colors.primaryTransparent20, borderColor: Colors.primary},
  animEmoji: {fontSize: 16},
  animLabel: {...Typography.overline, color: Colors.textMuted, fontSize: 9},
  animLabelActive: {color: Colors.primary},
  addCharBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  addCharBtnText: {...Typography.button, color: Colors.white},
  uploadSection: {padding: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border},
  uploadBtn: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.borderLight,
    gap: Spacing.xs,
  },
  uploadEmoji: {fontSize: 32},
  uploadTitle: {...Typography.body, color: Colors.textPrimary, fontWeight: '600'},
  uploadDesc: {...Typography.caption, color: Colors.textMuted},
});
