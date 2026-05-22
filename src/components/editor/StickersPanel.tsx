import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView} from 'react-native';
import {Colors, Spacing, Typography, BorderRadius} from '../../theme';
import Badge from '../ui/Badge';
import {useVideoEditor} from '../../hooks/useVideoEditor';
import {useSubscription} from '../../hooks/useSubscription';

type StickerCategory = 'emoji' | 'effects' | 'speech' | 'shapes' | 'seasonal' | 'ratings' | 'arrows';

const STICKER_CATEGORIES: {id: StickerCategory; label: string}[] = [
  {id: 'emoji', label: '😄 Emoji'},
  {id: 'effects', label: '✨ Effects'},
  {id: 'speech', label: '💬 Speech'},
  {id: 'shapes', label: '🔷 Shapes'},
  {id: 'seasonal', label: '🎄 Seasonal'},
  {id: 'ratings', label: '⭐ Ratings'},
  {id: 'arrows', label: '➡️ Arrows'},
];

const STICKERS: {id: string; emoji: string; category: StickerCategory; isPro: boolean}[] = [
  {id: 's1', emoji: '😂', category: 'emoji', isPro: false},
  {id: 's2', emoji: '🔥', category: 'effects', isPro: false},
  {id: 's3', emoji: '💥', category: 'effects', isPro: false},
  {id: 's4', emoji: '⭐', category: 'ratings', isPro: false},
  {id: 's5', emoji: '💬', category: 'speech', isPro: false},
  {id: 's6', emoji: '😍', category: 'emoji', isPro: false},
  {id: 's7', emoji: '🎉', category: 'seasonal', isPro: false},
  {id: 's8', emoji: '💯', category: 'ratings', isPro: false},
  {id: 's9', emoji: '✨', category: 'effects', isPro: false},
  {id: 's10', emoji: '❤️', category: 'emoji', isPro: false},
  {id: 's11', emoji: '🏆', category: 'ratings', isPro: true},
  {id: 's12', emoji: '🎵', category: 'effects', isPro: false},
  {id: 's13', emoji: '➡️', category: 'arrows', isPro: false},
  {id: 's14', emoji: '⬆️', category: 'arrows', isPro: false},
  {id: 's15', emoji: '❓', category: 'speech', isPro: false},
  {id: 's16', emoji: '❗', category: 'speech', isPro: false},
  {id: 's17', emoji: '💎', category: 'ratings', isPro: true},
  {id: 's18', emoji: '🌟', category: 'effects', isPro: false},
  {id: 's19', emoji: '🤣', category: 'emoji', isPro: false},
  {id: 's20', emoji: '😎', category: 'emoji', isPro: false},
  {id: 's21', emoji: '🦄', category: 'seasonal', isPro: true},
  {id: 's22', emoji: '🌈', category: 'effects', isPro: true},
  {id: 's23', emoji: '💫', category: 'effects', isPro: false},
  {id: 's24', emoji: '🎯', category: 'shapes', isPro: false},
];

export default function StickersPanel() {
  const [activeCategory, setActiveCategory] = useState<StickerCategory>('emoji');
  const {addStickerToCurrentScene, currentScene} = useVideoEditor();
  const {isPro, requirePro} = useSubscription();

  const filtered = STICKERS.filter(s => s.category === activeCategory);

  const handleAddSticker = (sticker: typeof STICKERS[0]) => {
    if (sticker.isPro && !isPro) {
      requirePro('Sticker');
      return;
    }
    if (!currentScene) {return;}
    addStickerToCurrentScene({
      uri: sticker.emoji,
      transform: {
        position: {x: 0.2, y: 0.2},
        scale: 1,
        rotation: 0,
        flipX: false,
        flipY: false,
      },
      isVisible: true,
      layer: 15,
    });
  };

  return (
    <View style={styles.container}>
      {/* Category tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cats}>
        {STICKER_CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.catBtn, activeCategory === cat.id && styles.catBtnActive]}
            onPress={() => setActiveCategory(cat.id)}>
            <Text style={[styles.catLabel, activeCategory === cat.id && styles.catLabelActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sticker grid */}
      <FlatList
        data={filtered}
        numColumns={5}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.stickerCell}
            onPress={() => handleAddSticker(item)}
            activeOpacity={0.7}>
            <Text style={styles.stickerEmoji}>{item.emoji}</Text>
            {item.isPro && !isPro && (
              <View style={styles.lockBadge}>
                <Text style={styles.lockText}>🔒</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      />

      {/* Custom sticker upload */}
      <View style={styles.uploadRow}>
        <TouchableOpacity
          style={styles.uploadBtn}
          onPress={() => requirePro('Custom Stickers')}>
          <Text style={styles.uploadEmoji}>📁</Text>
          <Text style={styles.uploadLabel}>Upload Custom</Text>
          {!isPro && <Badge label="PRO" variant="gold" small />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.surface},
  cats: {
    gap: Spacing.xs,
    padding: Spacing.sm,
    paddingRight: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  catBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  catBtnActive: {backgroundColor: Colors.primaryTransparent20, borderColor: Colors.primary},
  catLabel: {...Typography.caption, color: Colors.textSecondary, fontWeight: '600'},
  catLabelActive: {color: Colors.primary},
  grid: {padding: Spacing.md},
  gridRow: {gap: Spacing.sm, marginBottom: Spacing.sm},
  stickerCell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
    maxWidth: '19%',
  },
  stickerEmoji: {fontSize: 32},
  lockBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 6,
    padding: 1,
  },
  lockText: {fontSize: 10},
  uploadRow: {padding: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border},
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.border,
  },
  uploadEmoji: {fontSize: 20},
  uploadLabel: {...Typography.body, color: Colors.textSecondary},
});
