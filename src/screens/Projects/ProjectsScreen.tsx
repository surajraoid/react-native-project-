import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import LinearGradient from 'expo-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {Colors, Typography, Spacing, BorderRadius, Shadow} from '../../theme';
import {useProjectStore} from '../../store/useProjectStore';
import {useOrientation} from '../../hooks/useOrientation';
import {formatRelativeTime, formatDurationShort} from '../../utils/formatters';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

type SortOption = 'recent' | 'oldest' | 'name' | 'duration' | 'favorites';

export default function ProjectsScreen() {
  const navigation = useNavigation();
  const {projects, openProject, deleteProject, duplicateProject, toggleFavorite} = useProjectStore();
  const {isLandscape, width} = useOrientation();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const isSelecting = selectedIds.length > 0;

  const filtered = projects
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'recent') {return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();}
      if (sortBy === 'oldest') {return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();}
      if (sortBy === 'name') {return a.name.localeCompare(b.name);}
      if (sortBy === 'duration') {return b.duration - a.duration;}
      if (sortBy === 'favorites') {return (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0);}
      return 0;
    });

  const numCols = isLandscape ? 3 : viewMode === 'grid' ? 2 : 1;

  const handleProjectPress = (id: string) => {
    if (isSelecting) {
      setSelectedIds(prev =>
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id],
      );
    } else {
      openProject(id);
      navigation.navigate('Editor' as never, {projectId: id} as never);
    }
  };

  const handleLongPress = (id: string) => {
    setSelectedIds(prev => [...prev, id]);
  };

  const handleDeleteSelected = () => {
    Alert.alert(
      'Delete Projects',
      `Delete ${selectedIds.length} project${selectedIds.length > 1 ? 's' : ''}? This cannot be undone.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            selectedIds.forEach(id => deleteProject(id));
            setSelectedIds([]);
          },
        },
      ],
    );
  };

  const cardW = viewMode === 'list' ? width - Spacing.base * 2 : (width - Spacing.base * 2 - Spacing.md * (numCols - 1)) / numCols;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[Colors.surface, Colors.background]} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>My Projects</Text>
            <Text style={styles.headerSub}>{projects.length} project{projects.length !== 1 ? 's' : ''}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.viewModeBtn}
              onPress={() => setViewMode(v => v === 'grid' ? 'list' : 'grid')}>
              <Text style={styles.viewModeBtnText}>{viewMode === 'grid' ? '☰' : '⊞'}</Text>
            </TouchableOpacity>
            <Button
              label="+ New"
              size="sm"
              onPress={() => navigation.navigate('Home' as never)}
            />
          </View>
        </View>

        {/* Selection mode bar */}
        {isSelecting && (
          <View style={styles.selectionBar}>
            <Text style={styles.selectionCount}>{selectedIds.length} selected</Text>
            <View style={styles.selectionActions}>
              <TouchableOpacity
                style={styles.selectionBtn}
                onPress={() => {
                  selectedIds.forEach(id => duplicateProject(id));
                  setSelectedIds([]);
                }}>
                <Text style={styles.selectionBtnText}>Duplicate</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.selectionBtn, styles.selectionBtnDanger]} onPress={handleDeleteSelected}>
                <Text style={[styles.selectionBtnText, styles.selectionBtnTextDanger]}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSelectedIds([])}>
                <Text style={styles.selectionBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Search + Sort */}
      <View style={styles.controls}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search projects..."
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

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortRow}>
          {[
            {id: 'recent' as SortOption, label: 'Recent'},
            {id: 'favorites' as SortOption, label: '⭐ Favorites'},
            {id: 'name' as SortOption, label: 'A–Z'},
            {id: 'duration' as SortOption, label: 'Duration'},
          ].map(s => (
            <TouchableOpacity
              key={s.id}
              style={[styles.sortChip, sortBy === s.id && styles.sortChipActive]}
              onPress={() => setSortBy(s.id)}>
              <Text style={[styles.sortChipText, sortBy === s.id && styles.sortChipTextActive]}>
                {s.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🎬</Text>
          <Text style={styles.emptyTitle}>No projects yet</Text>
          <Text style={styles.emptyDesc}>Create your first cartoon video and it will appear here</Text>
          <Button
            label="Create First Project"
            onPress={() => navigation.navigate('Home' as never)}
            size="lg"
            style={{marginTop: Spacing.lg}}
          />
        </View>
      ) : (
        <FlatList
          data={filtered}
          numColumns={numCols}
          key={String(numCols)}
          keyExtractor={item => item.id}
          renderItem={({item}) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <ProjectCard
                project={item}
                cardWidth={cardW}
                listMode={viewMode === 'list'}
                isSelected={isSelected}
                onPress={() => handleProjectPress(item.id)}
                onLongPress={() => handleLongPress(item.id)}
                onFavorite={() => toggleFavorite(item.id)}
                onDuplicate={() => duplicateProject(item.id)}
                onDelete={() => {
                  Alert.alert(
                    'Delete Project',
                    `Delete "${item.name}"?`,
                    [
                      {text: 'Cancel', style: 'cancel'},
                      {text: 'Delete', style: 'destructive', onPress: () => deleteProject(item.id)},
                    ],
                  );
                }}
              />
            );
          }}
          columnWrapperStyle={numCols > 1 ? styles.row : undefined}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

function ProjectCard({
  project,
  cardWidth,
  listMode,
  isSelected,
  onPress,
  onLongPress,
  onFavorite,
  onDuplicate,
  onDelete,
}: {
  project: ReturnType<typeof useProjectStore>['projects'][0];
  cardWidth: number;
  listMode: boolean;
  isSelected: boolean;
  onPress: () => void;
  onLongPress: () => void;
  onFavorite: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  if (listMode) {
    return (
      <TouchableOpacity
        style={[styles.listCard, isSelected && styles.listCardSelected, {width: cardWidth}]}
        onPress={onPress}
        onLongPress={onLongPress}
        activeOpacity={0.8}>
        <LinearGradient
          colors={['#1A1A35', '#0A0A1A']}
          style={styles.listThumb}>
          <Text style={styles.listThumbEmoji}>🎬</Text>
        </LinearGradient>
        <View style={styles.listInfo}>
          <Text style={styles.listName} numberOfLines={1}>{project.name}</Text>
          <Text style={styles.listMeta}>
            {project.scenes.length} scenes • {formatDurationShort(project.duration)}
          </Text>
          <Text style={styles.listDate}>{formatRelativeTime(project.updatedAt)}</Text>
        </View>
        <View style={styles.listActions}>
          <TouchableOpacity onPress={onFavorite}>
            <Text style={{fontSize: 18}}>{project.isFavorite ? '⭐' : '☆'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
            <Text style={styles.menuDots}>⋮</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.gridCard, isSelected && styles.gridCardSelected, {width: cardWidth}]}>
      <TouchableOpacity onPress={onPress} onLongPress={onLongPress} activeOpacity={0.85}>
        <LinearGradient
          colors={['#1A1A35', '#0A0A1A']}
          style={styles.gridThumb}>
          <Text style={styles.gridThumbEmoji}>🎬</Text>
          {isSelected && (
            <View style={styles.selectedOverlay}>
              <Text style={styles.selectedCheck}>✓</Text>
            </View>
          )}
          {project.isFavorite && (
            <View style={styles.favBadge}><Text style={{fontSize: 14}}>⭐</Text></View>
          )}
        </LinearGradient>
      </TouchableOpacity>
      <View style={styles.gridBody}>
        <Text style={styles.gridName} numberOfLines={1}>{project.name}</Text>
        <Text style={styles.gridMeta}>{project.scenes.length} scenes</Text>
        <Text style={styles.gridDate}>{formatRelativeTime(project.updatedAt)}</Text>
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
    gap: Spacing.sm,
  },
  headerTop: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  headerTitle: {...Typography.h2, color: Colors.textPrimary},
  headerSub: {...Typography.body, color: Colors.textMuted, marginTop: 2},
  headerActions: {flexDirection: 'row', gap: Spacing.sm, alignItems: 'center'},
  viewModeBtn: {
    width: 36,
    height: 36,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  viewModeBtnText: {color: Colors.textPrimary, fontSize: 16},
  selectionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primaryTransparent20,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  selectionCount: {...Typography.body, color: Colors.primary, fontWeight: '700'},
  selectionActions: {flexDirection: 'row', gap: Spacing.md},
  selectionBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.card,
  },
  selectionBtnDanger: {backgroundColor: Colors.error + '22'},
  selectionBtnText: {...Typography.caption, color: Colors.textSecondary, fontWeight: '600'},
  selectionBtnTextDanger: {color: Colors.error},
  controls: {paddingHorizontal: Spacing.base, gap: Spacing.sm, marginBottom: Spacing.sm},
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    height: 44,
    gap: Spacing.sm,
  },
  searchIcon: {fontSize: 14},
  searchInput: {flex: 1, ...Typography.body, color: Colors.textPrimary},
  searchClear: {color: Colors.textMuted, fontSize: 14},
  sortRow: {gap: Spacing.sm, paddingRight: Spacing.md},
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
  emptyState: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl2},
  emptyEmoji: {fontSize: 72, marginBottom: Spacing.md},
  emptyTitle: {...Typography.h3, color: Colors.textPrimary, textAlign: 'center'},
  emptyDesc: {...Typography.body, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.sm, lineHeight: 24},
  grid: {paddingHorizontal: Spacing.base, paddingBottom: 100},
  row: {gap: Spacing.md, marginBottom: Spacing.md},
  gridCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  gridCardSelected: {borderColor: Colors.primary, borderWidth: 2},
  gridThumb: {height: 120, alignItems: 'center', justifyContent: 'center', position: 'relative'},
  gridThumbEmoji: {fontSize: 48},
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.primaryTransparent20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCheck: {fontSize: 32, color: Colors.primary, fontWeight: '700'},
  favBadge: {position: 'absolute', top: Spacing.xs, right: Spacing.xs},
  gridBody: {padding: Spacing.sm, gap: 2},
  gridName: {...Typography.bodySmall, color: Colors.textPrimary, fontWeight: '700'},
  gridMeta: {...Typography.caption, color: Colors.textMuted},
  gridDate: {...Typography.caption, color: Colors.textMuted},
  listCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
    alignItems: 'center',
    ...Shadow.sm,
  },
  listCardSelected: {borderColor: Colors.primary},
  listThumb: {width: 80, height: 72, alignItems: 'center', justifyContent: 'center'},
  listThumbEmoji: {fontSize: 32},
  listInfo: {flex: 1, padding: Spacing.sm},
  listName: {...Typography.body, color: Colors.textPrimary, fontWeight: '700'},
  listMeta: {...Typography.caption, color: Colors.textMuted, marginTop: 2},
  listDate: {...Typography.caption, color: Colors.textMuted},
  listActions: {paddingRight: Spacing.md, gap: Spacing.sm, alignItems: 'center'},
  menuDots: {color: Colors.textMuted, fontSize: 20, padding: Spacing.xs},
});
