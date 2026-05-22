import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Platform,
  TextInput,
  ScrollView,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {Colors, Typography, Spacing, BorderRadius, Shadow} from '../../theme';
import {TEMPLATE_CATEGORIES} from '../../utils/constants';
import {useSubscription} from '../../hooks/useSubscription';
import {useProjectStore} from '../../store/useProjectStore';
import Badge from '../../components/ui/Badge';
import {formatDurationShort, formatNumber} from '../../utils/formatters';
import {useOrientation} from '../../hooks/useOrientation';

const {width: SCREEN_W} = Dimensions.get('window');

interface TemplateData {
  id: string;
  name: string;
  emoji: string;
  style: string;
  duration: number;
  uses: number;
  rating: number;
  isPro: boolean;
  category: string;
  gradient: string[];
  tags: string[];
}

const TEMPLATES: TemplateData[] = [
  {id: 't1', name: 'Birthday Surprise', emoji: '🎂', style: 'Anime', duration: 30000, uses: 124000, rating: 4.8, isPro: false, category: 'birthday', gradient: ['#FF6B9D', '#C44B7A'], tags: ['birthday', 'celebration', 'anime']},
  {id: 't2', name: 'Epic Battle', emoji: '⚔️', style: 'Comic', duration: 45000, uses: 98000, rating: 4.9, isPro: true, category: 'gaming', gradient: ['#FF4444', '#AA0000'], tags: ['action', 'gaming', 'comic']},
  {id: 't3', name: 'Love Confession', emoji: '❤️', style: 'Watercolor', duration: 60000, uses: 156000, rating: 4.7, isPro: false, category: 'love', gradient: ['#FF8A80', '#FF5252'], tags: ['romance', 'love', 'watercolor']},
  {id: 't4', name: 'Space Journey', emoji: '🚀', style: 'Cyberpunk', duration: 90000, uses: 72000, rating: 4.6, isPro: true, category: 'trending', gradient: ['#00E5FF', '#0097A7'], tags: ['sci-fi', 'space', 'cyberpunk']},
  {id: 't5', name: 'Fairy Tale Magic', emoji: '🧚', style: 'Chibi', duration: 120000, uses: 189000, rating: 4.9, isPro: false, category: 'kids', gradient: ['#E040FB', '#9C27B0'], tags: ['kids', 'fairy tale', 'chibi']},
  {id: 't6', name: 'Corporate Intro', emoji: '💼', style: 'Flat', duration: 30000, uses: 54000, rating: 4.5, isPro: true, category: 'business', gradient: ['#42A5F5', '#1976D2'], tags: ['business', 'professional', 'flat']},
  {id: 't7', name: 'Motivational Boost', emoji: '💪', style: 'Anime', duration: 45000, uses: 234000, rating: 5.0, isPro: false, category: 'motivational', gradient: ['#FF9800', '#F57F17'], tags: ['motivation', 'sports', 'anime']},
  {id: 't8', name: 'News Bulletin', emoji: '📰', style: 'Flat', duration: 60000, uses: 44000, rating: 4.4, isPro: true, category: 'news', gradient: ['#607D8B', '#37474F'], tags: ['news', 'professional', 'flat']},
  {id: 't9', name: 'Music Video', emoji: '🎵', style: 'Neon', duration: 180000, uses: 167000, rating: 4.8, isPro: true, category: 'music', gradient: ['#00E5FF', '#7C4DFF'], tags: ['music', 'neon', 'dancing']},
  {id: 't10', name: 'Sports Highlight', emoji: '⚽', style: 'Comic', duration: 60000, uses: 89000, rating: 4.7, isPro: false, category: 'sports', gradient: ['#4CAF50', '#1B5E20'], tags: ['sports', 'highlight', 'comic']},
  {id: 't11', name: 'Travel Diary', emoji: '✈️', style: 'Watercolor', duration: 90000, uses: 112000, rating: 4.6, isPro: false, category: 'travel', gradient: ['#64B5F6', '#0D47A1'], tags: ['travel', 'adventure', 'watercolor']},
  {id: 't12', name: 'Comedy Short', emoji: '😂', style: 'Chibi', duration: 45000, uses: 203000, rating: 4.9, isPro: false, category: 'comedy', gradient: ['#FFEB3B', '#F9A825'], tags: ['comedy', 'funny', 'chibi']},
  {id: 't13', name: 'Education Lesson', emoji: '📚', style: 'Flat', duration: 120000, uses: 67000, rating: 4.5, isPro: false, category: 'education', gradient: ['#66BB6A', '#2E7D32'], tags: ['education', 'learning', 'flat']},
  {id: 't14', name: 'Social Media Ad', emoji: '📲', style: 'Anime', duration: 30000, uses: 345000, rating: 4.8, isPro: true, category: 'social_media', gradient: ['#E91E63', '#880E4F'], tags: ['social media', 'marketing', 'anime']},
  {id: 't15', name: 'Christmas Story', emoji: '🎄', style: 'Chibi', duration: 60000, uses: 78000, rating: 4.7, isPro: false, category: 'holiday', gradient: ['#F44336', '#1B5E20'], tags: ['holiday', 'christmas', 'chibi']},
];

export default function TemplatesScreen() {
  const navigation = useNavigation();
  const {isPro, requirePro} = useSubscription();
  const {createProject, openProject} = useProjectStore();
  const {isLandscape, width} = useOrientation();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'rating'>('popular');

  const filtered = TEMPLATES.filter(t => {
    const matchesSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.tags.some(tag => tag.includes(search.toLowerCase()));
    const matchesCategory = activeCategory === 'all' || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) =>
    sortBy === 'popular' ? b.uses - a.uses
    : sortBy === 'rating' ? b.rating - a.rating
    : 0,
  );

  const numCols = isLandscape ? 3 : 2;
  const cardW = (width - Spacing.base * 2 - Spacing.md * (numCols - 1)) / numCols;

  const handleUseTemplate = useCallback((template: TemplateData) => {
    if (template.isPro && !isPro) {
      requirePro('Template: ' + template.name);
      return;
    }
    const project = createProject(template.name, '16:9', template.style.toLowerCase() as never);
    openProject(project.id);
    navigation.navigate('Editor' as never, {projectId: project.id} as never);
  }, [isPro, requirePro, createProject, openProject, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[Colors.surface, Colors.background]} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Templates</Text>
        <Text style={styles.headerSub}>{TEMPLATES.length}+ professional cartoon templates</Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search templates..."
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={styles.searchClear}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Sort */}
        <View style={styles.sortRow}>
          {(['popular', 'newest', 'rating'] as const).map(s => (
            <TouchableOpacity
              key={s}
              style={[styles.sortChip, sortBy === s && styles.sortChipActive]}
              onPress={() => setSortBy(s)}>
              <Text style={[styles.sortChipText, sortBy === s && styles.sortChipTextActive]}>
                {s === 'popular' ? '🔥 Popular' : s === 'newest' ? '✨ Newest' : '⭐ Top Rated'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Category tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.catScroll}
        contentContainerStyle={styles.catRow}>
        <TouchableOpacity
          style={[styles.catChip, activeCategory === 'all' && styles.catChipActive]}
          onPress={() => setActiveCategory('all')}>
          <Text style={styles.catText}>🌟 All</Text>
        </TouchableOpacity>
        {TEMPLATE_CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.catChip, activeCategory === cat.id && styles.catChipActive]}
            onPress={() => setActiveCategory(cat.id)}>
            <Text style={styles.catText}>{cat.icon} {cat.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Count */}
      <Text style={styles.countText}>{filtered.length} templates</Text>

      {/* Grid */}
      <FlatList
        data={filtered}
        numColumns={numCols}
        key={String(numCols)}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TemplateCard
            template={item}
            cardWidth={cardW}
            isPro={isPro}
            onUse={() => handleUseTemplate(item)}
            onPreview={() => {}}
          />
        )}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function TemplateCard({
  template,
  cardWidth,
  isPro: userIsPro,
  onUse,
  onPreview,
}: {
  template: TemplateData;
  cardWidth: number;
  isPro: boolean;
  onUse: () => void;
  onPreview: () => void;
}) {
  const isLocked = template.isPro && !userIsPro;

  return (
    <View style={[styles.card, {width: cardWidth}]}>
      <TouchableOpacity onPress={onUse} activeOpacity={0.85}>
        <View style={styles.cardThumb}>
          <LinearGradient colors={template.gradient} style={StyleSheet.absoluteFill} />
          <Text style={styles.cardEmoji}>{template.emoji}</Text>
          {isLocked && (
            <View style={styles.lockOverlay}>
              <LinearGradient
                colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.8)']}
                style={StyleSheet.absoluteFill}
              />
              <Text style={styles.lockEmoji}>🔒</Text>
              <Badge label="PRO" variant="gold" small />
            </View>
          )}
          {!isLocked && template.isPro && (
            <View style={styles.cardBadge}>
              <Badge label="PRO" variant="gold" small />
            </View>
          )}
        </View>
      </TouchableOpacity>
      <View style={styles.cardBody}>
        <Text style={styles.cardName} numberOfLines={1}>{template.name}</Text>
        <Text style={styles.cardStyle}>{template.style}</Text>
        <View style={styles.cardMeta}>
          <Text style={styles.cardUses}>👁 {formatNumber(template.uses)}</Text>
          <Text style={styles.cardRating}>⭐ {template.rating}</Text>
          <Text style={styles.cardDur}>{formatDurationShort(template.duration)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.useBtn, isLocked && styles.useBtnLocked]}
          onPress={onUse}>
          <LinearGradient
            colors={isLocked ? (Colors.gradientGold as unknown as string[]) : (Colors.gradientPrimary as unknown as string[])}
            style={StyleSheet.absoluteFill}
            borderRadius={BorderRadius.full}
          />
          <Text style={styles.useBtnText}>{isLocked ? '🔓 Unlock' : '▶ Use'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {
    paddingHorizontal: Spacing.base,
    paddingTop: 40,
    paddingBottom: Spacing.md,
  },
  headerTitle: {...Typography.h2, color: Colors.textPrimary},
  headerSub: {...Typography.body, color: Colors.textMuted, marginTop: 2},
  searchWrapper: {paddingHorizontal: Spacing.base, gap: Spacing.sm, marginBottom: Spacing.sm},
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.base,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    height: 48,
    gap: Spacing.sm,
  },
  searchIcon: {fontSize: 16},
  searchInput: {flex: 1, ...Typography.body, color: Colors.textPrimary},
  searchClear: {color: Colors.textMuted, fontSize: 14, padding: Spacing.xs},
  sortRow: {flexDirection: 'row', gap: Spacing.sm},
  sortChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sortChipActive: {backgroundColor: Colors.primaryTransparent20, borderColor: Colors.primary},
  sortChipText: {...Typography.caption, color: Colors.textMuted, fontWeight: '600'},
  sortChipTextActive: {color: Colors.primary},
  catScroll: {flexGrow: 0, marginBottom: Spacing.sm},
  catRow: {gap: Spacing.sm, paddingHorizontal: Spacing.base, paddingRight: Spacing.xl},
  catChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  catChipActive: {backgroundColor: Colors.primaryTransparent20, borderColor: Colors.primary},
  catText: {...Typography.caption, color: Colors.textSecondary, fontWeight: '600'},
  countText: {
    ...Typography.caption,
    color: Colors.textMuted,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
  },
  grid: {paddingHorizontal: Spacing.base, paddingBottom: 100},
  row: {gap: Spacing.md, marginBottom: Spacing.md},
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.base,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.md,
  },
  cardThumb: {
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  cardEmoji: {fontSize: 60},
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  lockEmoji: {fontSize: 24},
  cardBadge: {position: 'absolute', top: Spacing.sm, right: Spacing.sm},
  cardBody: {padding: Spacing.md, gap: Spacing.xs},
  cardName: {...Typography.bodySmall, color: Colors.textPrimary, fontWeight: '700'},
  cardStyle: {...Typography.caption, color: Colors.primary},
  cardMeta: {flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap'},
  cardUses: {...Typography.overline, color: Colors.textMuted, fontSize: 10},
  cardRating: {...Typography.overline, color: Colors.gold, fontSize: 10},
  cardDur: {...Typography.overline, color: Colors.textMuted, fontSize: 10},
  useBtn: {
    height: 36,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginTop: Spacing.xs,
  },
  useBtnLocked: {},
  useBtnText: {...Typography.buttonSmall, color: Colors.white},
});
