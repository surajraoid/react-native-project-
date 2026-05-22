import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Switch,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {Colors, Typography, Spacing, BorderRadius, Shadow} from '../../theme';
import {useAppStore} from '../../store/useAppStore';
import {useSubscriptionStore} from '../../store/useSubscriptionStore';
import {useProjectStore} from '../../store/useProjectStore';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ProgressBar from '../../components/ui/ProgressBar';
import {formatDate, formatDurationShort} from '../../utils/formatters';

type SettingsSection = {
  title: string;
  items: SettingsItem[];
};

type SettingsItem = {
  id: string;
  emoji: string;
  label: string;
  subtitle?: string;
  type: 'toggle' | 'link' | 'action' | 'info';
  value?: boolean;
  onToggle?: (val: boolean) => void;
  onPress?: () => void;
  isPro?: boolean;
};

export default function ProfileScreen() {
  const navigation = useNavigation();
  const {user, preferences, updatePreferences, logout} = useAppStore();
  const {currentPlan, expiryDate, plans} = useSubscriptionStore();
  const {projects} = useProjectStore();
  const isPro = currentPlan !== 'free';

  const totalDuration = projects.reduce((sum, p) => sum + p.duration, 0);

  const settingsSections: SettingsSection[] = [
    {
      title: 'Editor Preferences',
      items: [
        {
          id: 'autoSave',
          emoji: '💾',
          label: 'Auto Save',
          subtitle: 'Save projects automatically every 2 minutes',
          type: 'toggle',
          value: preferences.autoSave,
          onToggle: val => updatePreferences({autoSave: val}),
        },
        {
          id: 'haptic',
          emoji: '📳',
          label: 'Haptic Feedback',
          subtitle: 'Vibration on interactions',
          type: 'toggle',
          value: preferences.hapticFeedback,
          onToggle: val => updatePreferences({hapticFeedback: val}),
        },
        {
          id: 'quality',
          emoji: '🎬',
          label: 'Default Export Quality',
          subtitle: preferences.defaultExportQuality,
          type: 'link',
          onPress: () => {},
        },
        {
          id: 'ratio',
          emoji: '📐',
          label: 'Default Aspect Ratio',
          subtitle: preferences.defaultAspectRatio,
          type: 'link',
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          id: 'pushNotifs',
          emoji: '🔔',
          label: 'Push Notifications',
          subtitle: 'Export complete, new features',
          type: 'toggle',
          value: preferences.pushNotifications,
          onToggle: val => updatePreferences({pushNotifications: val}),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          emoji: '❓',
          label: 'Help Center',
          type: 'link',
          onPress: () => {},
        },
        {
          id: 'feedback',
          emoji: '💬',
          label: 'Send Feedback',
          type: 'link',
          onPress: () => {},
        },
        {
          id: 'rate',
          emoji: '⭐',
          label: 'Rate on Play Store',
          type: 'link',
          onPress: () => {},
        },
        {
          id: 'share',
          emoji: '🔗',
          label: 'Share ToonCraft Pro',
          type: 'link',
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Legal',
      items: [
        {id: 'privacy', emoji: '🔒', label: 'Privacy Policy', type: 'link', onPress: () => {}},
        {id: 'terms', emoji: '📄', label: 'Terms of Service', type: 'link', onPress: () => {}},
        {id: 'licenses', emoji: '⚖️', label: 'Open Source Licenses', type: 'link', onPress: () => {}},
      ],
    },
    {
      title: 'Account',
      items: [
        {
          id: 'version',
          emoji: 'ℹ️',
          label: 'App Version',
          subtitle: '1.0.0 (Build 1)',
          type: 'info',
        },
        {
          id: 'logout',
          emoji: '🚪',
          label: 'Sign Out',
          type: 'action',
          onPress: () => {
            Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
              {text: 'Cancel', style: 'cancel'},
              {text: 'Sign Out', style: 'destructive', onPress: logout},
            ]);
          },
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[Colors.surface, Colors.background]} style={StyleSheet.absoluteFill} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile header */}
        <View style={styles.profileHeader}>
          <LinearGradient
            colors={['#1A0A35', Colors.background]}
            style={StyleSheet.absoluteFill}
          />

          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={Colors.gradientPrimary as unknown as string[]}
              style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0)?.toUpperCase() ?? '?'}
              </Text>
            </LinearGradient>
            {isPro && (
              <View style={styles.proCrown}>
                <Text style={styles.proCrownText}>⭐</Text>
              </View>
            )}
          </View>

          <Text style={styles.userName}>{user?.name ?? 'Creator'}</Text>
          <Text style={styles.userEmail}>{user?.email ?? 'Sign in to sync your work'}</Text>

          <View style={styles.userBadges}>
            {isPro ? (
              <Badge label="PRO" variant="pro" />
            ) : (
              <Badge label="FREE" variant="outline" />
            )}
            <Badge label={`${projects.length} Projects`} variant="primary" />
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{projects.length}</Text>
              <Text style={styles.statLabel}>Projects</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{projects.reduce((sum, p) => sum + p.scenes.length, 0)}</Text>
              <Text style={styles.statLabel}>Scenes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatDurationShort(totalDuration)}</Text>
              <Text style={styles.statLabel}>Created</Text>
            </View>
          </View>
        </View>

        {/* Subscription card */}
        <View style={styles.subCard}>
          <LinearGradient
            colors={isPro ? ['#1A0A35', '#350A1A'] : [Colors.card, Colors.surface]}
            style={StyleSheet.absoluteFill}
            borderRadius={BorderRadius.xl}
          />
          <View style={styles.subCardInner}>
            <View>
              <Text style={styles.subCardTitle}>
                {isPro ? '⭐ Pro Subscription' : 'Free Plan'}
              </Text>
              {isPro && expiryDate ? (
                <Text style={styles.subCardSub}>Renews {formatDate(expiryDate)}</Text>
              ) : (
                <Text style={styles.subCardSub}>
                  {isPro ? '' : '1 free video included'}
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.subCardBtn}
              onPress={() => navigation.navigate('Subscription' as never)}>
              <LinearGradient
                colors={Colors.gradientGold as unknown as string[]}
                style={styles.subCardBtnGradient}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}>
                <Text style={styles.subCardBtnText}>
                  {isPro ? 'Manage' : 'Upgrade ₹99/mo'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          {!isPro && (
            <View style={styles.subProgress}>
              <View style={styles.subProgressRow}>
                <Text style={styles.subProgressLabel}>Videos used this month</Text>
                <Text style={styles.subProgressValue}>1/1</Text>
              </View>
              <ProgressBar progress={1} height={4} colors={Colors.gradientSecondary as unknown as string[]} />
            </View>
          )}
        </View>

        {/* Settings sections */}
        {settingsSections.map(section => (
          <View key={section.title} style={styles.settingsSection}>
            <Text style={styles.settingsSectionTitle}>{section.title}</Text>
            <View style={styles.settingsList}>
              {section.items.map((item, i) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.settingsItem,
                    i === 0 && styles.settingsItemFirst,
                    i === section.items.length - 1 && styles.settingsItemLast,
                    item.id === 'logout' && styles.settingsItemDanger,
                  ]}
                  onPress={item.type !== 'toggle' ? item.onPress : undefined}
                  disabled={item.type === 'info' || item.type === 'toggle'}>
                  <Text style={styles.settingsEmoji}>{item.emoji}</Text>
                  <View style={styles.settingsInfo}>
                    <Text style={[
                      styles.settingsLabel,
                      item.id === 'logout' && styles.settingsLabelDanger,
                    ]}>
                      {item.label}
                    </Text>
                    {item.subtitle && (
                      <Text style={styles.settingsSubtitle}>{item.subtitle}</Text>
                    )}
                  </View>
                  {item.type === 'toggle' && (
                    <Switch
                      value={item.value}
                      onValueChange={item.onToggle}
                      trackColor={{false: Colors.border, true: Colors.primary}}
                      thumbColor={Colors.white}
                    />
                  )}
                  {item.type === 'link' && (
                    <Text style={styles.settingsArrow}>›</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>ToonCraft Pro v1.0.0</Text>
          <Text style={styles.footerText}>Made with ❤️ for creators worldwide</Text>
        </View>
        <View style={styles.bottomPad} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  profileHeader: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    overflow: 'hidden',
    gap: Spacing.sm,
  },
  avatarContainer: {position: 'relative', marginBottom: Spacing.sm},
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.primary,
  },
  avatarText: {...Typography.h1, color: Colors.white},
  proCrown: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proCrownText: {fontSize: 14},
  userName: {...Typography.h4, color: Colors.textPrimary},
  userEmail: {...Typography.body, color: Colors.textMuted, marginTop: 2},
  userBadges: {flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.xs},
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginTop: Spacing.md,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statItem: {flex: 1, alignItems: 'center', gap: 4},
  statValue: {...Typography.h4, color: Colors.textPrimary},
  statLabel: {...Typography.caption, color: Colors.textMuted},
  statDivider: {width: 1, height: 36, backgroundColor: Colors.border},
  subCard: {
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.xl,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.primaryTransparent20,
    ...Shadow.primary,
  },
  subCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.base,
  },
  subCardTitle: {...Typography.h5, color: Colors.textPrimary},
  subCardSub: {...Typography.caption, color: Colors.textMuted, marginTop: 2},
  subCardBtn: {borderRadius: BorderRadius.full, overflow: 'hidden'},
  subCardBtnGradient: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  subCardBtnText: {...Typography.buttonSmall, color: '#0A0A1A'},
  subProgress: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    gap: Spacing.xs,
  },
  subProgressRow: {flexDirection: 'row', justifyContent: 'space-between'},
  subProgressLabel: {...Typography.caption, color: Colors.textMuted},
  subProgressValue: {...Typography.caption, color: Colors.error, fontWeight: '700'},
  settingsSection: {marginBottom: Spacing.lg, paddingHorizontal: Spacing.base},
  settingsSectionTitle: {
    ...Typography.label,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  settingsList: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    gap: Spacing.md,
  },
  settingsItemFirst: {borderTopWidth: 0},
  settingsItemLast: {},
  settingsItemDanger: {},
  settingsEmoji: {fontSize: 20, width: 28, textAlign: 'center'},
  settingsInfo: {flex: 1},
  settingsLabel: {...Typography.body, color: Colors.textPrimary},
  settingsLabelDanger: {color: Colors.error},
  settingsSubtitle: {...Typography.caption, color: Colors.textMuted, marginTop: 1},
  settingsArrow: {color: Colors.textMuted, fontSize: 20},
  footer: {alignItems: 'center', padding: Spacing.xl, gap: Spacing.xs},
  footerText: {...Typography.caption, color: Colors.textMuted},
  bottomPad: {height: 80},
});
