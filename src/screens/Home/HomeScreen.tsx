import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  FlatList,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {Colors, Typography, Spacing, BorderRadius, Shadow} from '../../theme';
import {useAppStore} from '../../store/useAppStore';
import {useProjectStore} from '../../store/useProjectStore';
import {useSubscriptionStore} from '../../store/useSubscriptionStore';
import {useOrientation} from '../../hooks/useOrientation';
import {useFadeIn, useSlideIn} from '../../hooks/useAnimation';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Animated from 'react-native-reanimated';
import {formatRelativeTime, formatDurationShort} from '../../utils/formatters';
import {ASPECT_RATIOS, CARTOON_STYLES} from '../../utils/constants';

const {width: SCREEN_W} = Dimensions.get('window');

const QUICK_ACTIONS = [
  {id: 'blank', emoji: '✏️', label: 'Blank Project', gradient: Colors.gradientPrimary},
  {id: 'template', emoji: '🎨', label: 'From Template', gradient: Colors.gradientSecondary},
  {id: 'camera', emoji: '📸', label: 'From Camera', gradient: Colors.gradientAccent},
  {id: 'ai', emoji: '🤖', label: 'AI Generate', gradient: Colors.gradientGold},
];

const FEATURED_TEMPLATES = [
  {id: 't1', name: 'Birthday Surprise', emoji: '🎂', style: 'Anime', duration: 30000, uses: 12400, isPro: false, gradient: ['#FF6B9D', '#C44B7A']},
  {id: 't2', name: 'Epic Battle Scene', emoji: '⚔️', style: 'Comic', duration: 45000, uses: 9800, isPro: true, gradient: ['#FF4444', '#AA0000']},
  {id: 't3', name: 'Love Story', emoji: '❤️', style: 'Watercolor', duration: 60000, uses: 15600, isPro: false, gradient: ['#FF8A80', '#FF5252']},
  {id: 't4', name: 'Sci-Fi Adventure', emoji: '🚀', style: 'Cyberpunk', duration: 90000, uses: 7200, isPro: true, gradient: ['#00E5FF', '#0097A7']},
  {id: 't5', name: 'Kids Fairy Tale', emoji: '🧚', style: 'Chibi', duration: 120000, uses: 18900, isPro: false, gradient: ['#E040FB', '#9C27B0']},
  {id: 't6', name: 'Corporate Intro', emoji: '💼', style: 'Flat', duration: 30000, uses: 5400, isPro: true, gradient: ['#42A5F5', '#1976D2']},
];

const TRENDING_STYLES = CARTOON_STYLES.slice(0, 6);

export default function HomeScreen() {
  const navigation = useNavigation();
  const {user} = useAppStore();
  const {projects, createProject, openProject} = useProjectStore();
  const {currentPlan} = useSubscriptionStore();
  const {isLandscape, width} = useOrientation();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<string>('16:9');
  const [selectedStyle, setSelectedStyle] = useState<string>('anime');

  const heroAnim = useFadeIn(0);
  const actionsAnim = useSlideIn('up', 30, 100);
  const templatesAnim = useSlideIn('up', 30, 200);

  const recentProjects = projects.slice(0, 6);
  const isPro = currentPlan !== 'free';

  const handleQuickAction = (id: string) => {
    if (id === 'blank') {
      setShowCreateModal(true);
    } else if (id === 'template') {
      navigation.navigate('Templates' as never);
    } else {
      navigation.navigate('Subscription' as never, {highlight: 'AI Generate'} as never);
    }
  };

  const handleCreateProject = useCallback(() => {
    const project = createProject(
      `My Cartoon ${projects.length + 1}`,
      selectedAspectRatio as never,
      selectedStyle as never,
    );
    setShowCreateModal(false);
    openProject(project.id);
    navigation.navigate('Editor' as never, {projectId: project.id} as never);
  }, [createProject, openProject, navigation, projects.length, selectedAspectRatio, selectedStyle]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={[Colors.surface, Colors.background]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, isLandscape && styles.scrollLandscape]}>

        {/* Header */}
        <Animated.View style={[styles.header, heroAnim]}>
          <LinearGradient
            colors={['#1A0A35', Colors.background]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>
                {getGreeting()}, {user?.name ?? 'Creator'} 👋
              </Text>
              <Text style={styles.appName}>ToonCraft Pro</Text>
            </View>
            <TouchableOpacity
              style={styles.proBtn}
              onPress={() => navigation.navigate('Subscription' as never)}>
              <LinearGradient
                colors={Colors.gradientGold as unknown as string[]}
                style={styles.proBtnGradient}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}>
                <Text style={styles.proBtnText}>
                  {isPro ? '⭐ PRO' : '🔓 Get PRO'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Hero stats */}
          {!isPro && (
            <View style={styles.freeTrialBanner}>
              <LinearGradient
                colors={[Colors.primaryTransparent20, Colors.secondaryTransparent20]}
                style={StyleSheet.absoluteFill}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
              />
              <Text style={styles.freeTrialText}>
                🎉 1 free video included • Upgrade for unlimited creation
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Subscription' as never)}>
                <Text style={styles.freeTrialCta}>Get Pro ₹99/mo →</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View style={[styles.section, actionsAnim]}>
          <Text style={styles.sectionTitle}>Create New</Text>
          <View style={[styles.quickActionsGrid, isLandscape && styles.quickActionsGridLandscape]}>
            {QUICK_ACTIONS.map(action => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionCard}
                onPress={() => handleQuickAction(action.id)}
                activeOpacity={0.8}>
                <LinearGradient
                  colors={action.gradient as unknown as string[]}
                  style={StyleSheet.absoluteFill}
                  borderRadius={BorderRadius.base}
                />
                <Text style={styles.quickActionEmoji}>{action.emoji}</Text>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Recent Projects */}
        {recentProjects.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Projects</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Projects' as never)}>
                <Text style={styles.sectionSeeAll}>See all →</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.projectsRow}>
              {recentProjects.map(project => (
                <TouchableOpacity
                  key={project.id}
                  style={styles.projectCard}
                  onPress={() => {
                    openProject(project.id);
                    navigation.navigate('Editor' as never, {projectId: project.id} as never);
                  }}>
                  <LinearGradient
                    colors={['#1A1A35', Colors.background]}
                    style={styles.projectThumbnail}>
                    <Text style={styles.projectThumbnailEmoji}>🎬</Text>
                  </LinearGradient>
                  <View style={styles.projectInfo}>
                    <Text style={styles.projectName} numberOfLines={1}>{project.name}</Text>
                    <Text style={styles.projectMeta}>
                      {formatDurationShort(project.duration)} • {formatRelativeTime(project.updatedAt)}
                    </Text>
                  </View>
                  {project.isFavorite && <Text style={styles.favStar}>⭐</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Featured Templates */}
        <Animated.View style={[styles.section, templatesAnim]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔥 Trending Templates</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Templates' as never)}>
              <Text style={styles.sectionSeeAll}>See all →</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.templatesRow}>
            {FEATURED_TEMPLATES.map(tmpl => (
              <TouchableOpacity key={tmpl.id} style={styles.templateCard} activeOpacity={0.85}>
                <LinearGradient
                  colors={tmpl.gradient}
                  style={styles.templateThumb}>
                  <Text style={styles.templateEmoji}>{tmpl.emoji}</Text>
                  {tmpl.isPro && (
                    <View style={styles.templateProBadge}>
                      <Badge label="PRO" variant="gold" small />
                    </View>
                  )}
                </LinearGradient>
                <View style={styles.templateInfo}>
                  <Text style={styles.templateName} numberOfLines={1}>{tmpl.name}</Text>
                  <Text style={styles.templateMeta}>{tmpl.style} • {formatDurationShort(tmpl.duration)}</Text>
                  <Text style={styles.templateUses}>{(tmpl.uses / 1000).toFixed(1)}K uses</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Explore Styles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ Explore Styles</Text>
          <View style={styles.stylesGrid}>
            {TRENDING_STYLES.map(style => (
              <TouchableOpacity
                key={style.id}
                style={styles.styleCard}
                activeOpacity={0.8}>
                <View style={[styles.stylePreview, {backgroundColor: style.color + '22', borderColor: style.color + '55'}]}>
                  <Text style={styles.styleEmoji}>{style.icon}</Text>
                </View>
                <Text style={styles.styleName}>{style.name}</Text>
                {style.isPro && <Badge label="PRO" variant="gold" small />}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Pro Banner (for free users) */}
        {!isPro && (
          <View style={styles.proBanner}>
            <LinearGradient
              colors={['#1A0A35', '#350A1A']}
              style={StyleSheet.absoluteFill}
              borderRadius={BorderRadius.xl}
            />
            <View style={styles.proBannerInner}>
              <Text style={styles.proBannerEmoji}>⭐</Text>
              <Text style={styles.proBannerTitle}>Unlock ToonCraft Pro</Text>
              <Text style={styles.proBannerDesc}>
                Unlimited videos, 4K export, no watermark, 15+ styles, AI features & more
              </Text>
              <View style={styles.proBannerPrice}>
                <Text style={styles.proBannerPriceText}>₹99</Text>
                <Text style={styles.proBannerPricePer}>/month</Text>
              </View>
              <Button
                label="Start Pro ₹99/mo"
                onPress={() => navigation.navigate('Subscription' as never)}
                variant="gold"
                size="lg"
                fullWidth
              />
              <Text style={styles.proBannerSub}>Cancel anytime • ₹799/year (save 33%)</Text>
            </View>
          </View>
        )}

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* Create Project Modal */}
      {showCreateModal && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setShowCreateModal(false)} />
          <View style={styles.modal}>
            <LinearGradient
              colors={[Colors.card, Colors.surface]}
              style={StyleSheet.absoluteFill}
              borderRadius={BorderRadius.xl}
            />
            <Text style={styles.modalTitle}>New Project</Text>

            <Text style={styles.modalLabel}>Aspect Ratio</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.modalRow}>
              {ASPECT_RATIOS.map(r => (
                <TouchableOpacity
                  key={r.id}
                  style={[styles.modalChip, selectedAspectRatio === r.id && styles.modalChipActive]}
                  onPress={() => setSelectedAspectRatio(r.id)}>
                  <Text style={styles.modalChipEmoji}>{r.icon}</Text>
                  <Text style={styles.modalChipText}>{r.label}</Text>
                  <Text style={styles.modalChipDesc}>{r.description}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.modalLabel}>Cartoon Style</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.modalRow}>
              {CARTOON_STYLES.filter(s => !s.isPro).map(s => (
                <TouchableOpacity
                  key={s.id}
                  style={[styles.modalStyleChip, selectedStyle === s.id && styles.modalChipActive]}
                  onPress={() => setSelectedStyle(s.id)}>
                  <Text style={styles.modalChipEmoji}>{s.icon}</Text>
                  <Text style={styles.modalChipText}>{s.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalBtns}>
              <Button label="Cancel" variant="ghost" onPress={() => setShowCreateModal(false)} style={{flex: 1}} />
              <Button label="Create ✨" onPress={handleCreateProject} style={{flex: 2}} />
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) {return 'Good morning';}
  if (h < 17) {return 'Good afternoon';}
  return 'Good evening';
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  scroll: {paddingTop: 30},
  scrollLandscape: {},
  header: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
    overflow: 'hidden',
    gap: Spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {gap: 4},
  greeting: {...Typography.body, color: Colors.textMuted},
  appName: {...Typography.h2, color: Colors.textPrimary},
  proBtn: {borderRadius: BorderRadius.full, overflow: 'hidden'},
  proBtnGradient: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  proBtnText: {...Typography.button, color: '#0A0A1A'},
  freeTrialBanner: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.primaryTransparent20,
  },
  freeTrialText: {...Typography.bodySmall, color: Colors.textSecondary, flex: 1},
  freeTrialCta: {...Typography.bodySmall, color: Colors.primary, fontWeight: '700', marginLeft: Spacing.sm},
  section: {paddingHorizontal: Spacing.base, marginBottom: Spacing.xl},
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  sectionTitle: {...Typography.h5, color: Colors.textPrimary},
  sectionSeeAll: {...Typography.bodySmall, color: Colors.primary, fontWeight: '600'},
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  quickActionsGridLandscape: {
    flexWrap: 'nowrap',
  },
  quickActionCard: {
    flex: 1,
    minWidth: '45%',
    maxWidth: '48%',
    aspectRatio: 2,
    borderRadius: BorderRadius.base,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    gap: Spacing.xs,
    ...Shadow.primary,
  },
  quickActionEmoji: {fontSize: 28},
  quickActionLabel: {...Typography.body, color: Colors.white, fontWeight: '700'},
  projectsRow: {gap: Spacing.md, paddingRight: Spacing.base},
  projectCard: {
    width: 160,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  projectThumbnail: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  projectThumbnailEmoji: {fontSize: 40},
  projectInfo: {padding: Spacing.sm},
  projectName: {...Typography.bodySmall, color: Colors.textPrimary, fontWeight: '600'},
  projectMeta: {...Typography.caption, color: Colors.textMuted, marginTop: 2},
  favStar: {position: 'absolute', top: Spacing.xs, right: Spacing.xs, fontSize: 16},
  templatesRow: {gap: Spacing.md, paddingRight: Spacing.base},
  templateCard: {
    width: 180,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  templateThumb: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  templateEmoji: {fontSize: 52},
  templateProBadge: {position: 'absolute', top: Spacing.sm, right: Spacing.sm},
  templateInfo: {padding: Spacing.sm, gap: 2},
  templateName: {...Typography.bodySmall, color: Colors.textPrimary, fontWeight: '700'},
  templateMeta: {...Typography.caption, color: Colors.textMuted},
  templateUses: {...Typography.caption, color: Colors.primary, fontWeight: '600'},
  stylesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  styleCard: {
    width: '30%',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  stylePreview: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  styleEmoji: {fontSize: 36},
  styleName: {...Typography.caption, color: Colors.textSecondary, fontWeight: '600', textAlign: 'center'},
  proBanner: {
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.xl,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.primaryTransparent20,
    ...Shadow.xl,
  },
  proBannerInner: {
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.md,
  },
  proBannerEmoji: {fontSize: 48},
  proBannerTitle: {...Typography.h3, color: Colors.gold},
  proBannerDesc: {...Typography.body, color: Colors.textSecondary, textAlign: 'center', lineHeight: 24},
  proBannerPrice: {flexDirection: 'row', alignItems: 'flex-end'},
  proBannerPriceText: {...Typography.price, color: Colors.gold},
  proBannerPricePer: {...Typography.body, color: Colors.textMuted, marginBottom: 4},
  proBannerSub: {...Typography.caption, color: Colors.textMuted},
  bottomPad: {height: 100},
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.blackTransparent80,
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  modal: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius.xl2,
    borderTopRightRadius: BorderRadius.xl2,
    padding: Spacing.xl,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
    overflow: 'hidden',
  },
  modalTitle: {...Typography.h4, color: Colors.textPrimary},
  modalLabel: {...Typography.label, color: Colors.textMuted, marginTop: Spacing.sm},
  modalRow: {gap: Spacing.sm, paddingRight: Spacing.md},
  modalChip: {
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 90,
    gap: Spacing.xs,
  },
  modalStyleChip: {
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 76,
    gap: Spacing.xs,
  },
  modalChipActive: {borderColor: Colors.primary, backgroundColor: Colors.primaryTransparent10},
  modalChipEmoji: {fontSize: 24},
  modalChipText: {...Typography.caption, color: Colors.textPrimary, fontWeight: '700', textAlign: 'center'},
  modalChipDesc: {...Typography.overline, color: Colors.textMuted, textAlign: 'center'},
  modalBtns: {flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.sm},
});
