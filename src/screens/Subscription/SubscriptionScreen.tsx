import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {Colors, Typography, Spacing, BorderRadius, Shadow} from '../../theme';
import {useSubscriptionStore} from '../../store/useSubscriptionStore';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ProgressBar from '../../components/ui/ProgressBar';

const COMPARISON_FEATURES = [
  {label: 'Videos per month', free: '1 video', pro: 'Unlimited'},
  {label: 'Max duration', free: '30 seconds', pro: 'Unlimited'},
  {label: 'Export quality', free: 'Up to 720p', pro: '4K Ultra HD'},
  {label: 'Watermark', free: 'Yes', pro: 'No watermark'},
  {label: 'Cartoon styles', free: '5 basic styles', pro: '15+ styles'},
  {label: 'Characters', free: '10 basic', pro: '100+ premium'},
  {label: 'Templates', free: '10 basic', pro: '100+ premium'},
  {label: 'AI scene generation', free: '✕', pro: '✓'},
  {label: 'AI voice & lip sync', free: '✕', pro: '✓'},
  {label: 'Cloud backup', free: '✕', pro: '5 GB (20 GB yearly)'},
  {label: 'Audio tracks', free: '2 tracks', pro: 'Unlimited'},
  {label: 'Priority support', free: '✕', pro: '✓'},
];

const TESTIMONIALS = [
  {name: 'Rahul K.', role: 'Content Creator', text: 'ToonCraft Pro changed my YouTube channel! Views went up 300% 🚀', rating: 5},
  {name: 'Priya S.', role: 'Teacher', text: 'Perfect for making engaging educational videos for my students!', rating: 5},
  {name: 'Arjun M.', role: 'Marketing', text: 'Best ₹99 I spend each month. ROI is incredible for my business ads.', rating: 5},
];

export default function SubscriptionScreen() {
  const navigation = useNavigation();
  const {plans, currentPlan, subscribe, restorePurchases, isLoading, expiryDate} = useSubscriptionStore();
  const [selectedPlan, setSelectedPlan] = useState<'pro_monthly' | 'pro_yearly'>('pro_monthly');
  const isPro = currentPlan !== 'free';

  const proMonthly = plans.find(p => p.id === 'pro_monthly')!;
  const proYearly = plans.find(p => p.id === 'pro_yearly')!;

  const handleSubscribe = async () => {
    try {
      await subscribe(selectedPlan);
      Alert.alert('🎉 Welcome to Pro!', 'Your subscription is now active. Enjoy all premium features!', [
        {text: 'Start Creating!', onPress: () => navigation.goBack()},
      ]);
    } catch {
      Alert.alert('Error', 'Could not complete purchase. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" />

      {/* Hero */}
      <View style={styles.hero}>
        <LinearGradient
          colors={['#1A0A35', '#350A1A', '#0A0A1A']}
          style={StyleSheet.absoluteFill}
        />
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>

        <View style={styles.heroBadge}>
          <LinearGradient
            colors={Colors.gradientGold as unknown as string[]}
            style={styles.heroBadgeGradient}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}>
            <Text style={styles.heroBadgeText}>⭐ TOONCRAFT PRO</Text>
          </LinearGradient>
        </View>

        <Text style={styles.heroTitle}>Unleash Your{'\n'}Creative Power</Text>
        <Text style={styles.heroSub}>
          Join 500,000+ creators making amazing cartoon videos
        </Text>

        {/* Social proof */}
        <View style={styles.socialProof}>
          {['📱 500K+\nCreators', '⭐ 4.9\nRating', '🎬 10M+\nVideos'].map(item => {
            const [num, label] = item.split('\n');
            return (
              <View key={label} style={styles.socialItem}>
                <Text style={styles.socialNum}>{num}</Text>
                <Text style={styles.socialLabel}>{label}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Plan selector */}
      <View style={styles.planSelector}>
        <Text style={styles.sectionTitle}>Choose Your Plan</Text>

        {/* Monthly plan */}
        <TouchableOpacity
          style={[styles.planCard, selectedPlan === 'pro_monthly' && styles.planCardActive]}
          onPress={() => setSelectedPlan('pro_monthly')}>
          {selectedPlan === 'pro_monthly' && (
            <LinearGradient
              colors={[Colors.primaryTransparent10, Colors.secondaryTransparent10]}
              style={StyleSheet.absoluteFill}
              borderRadius={BorderRadius.xl}
            />
          )}
          <View style={styles.planHeader}>
            <View>
              <Text style={styles.planName}>Pro Monthly</Text>
              <Text style={styles.planDesc}>Perfect for creators</Text>
            </View>
            <View style={styles.planPriceBox}>
              <Text style={styles.planPrice}>₹99</Text>
              <Text style={styles.planPer}>/month</Text>
            </View>
          </View>
          {selectedPlan === 'pro_monthly' && (
            <View style={styles.planCheckmark}>
              <Text style={styles.planCheckmarkText}>✓</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Yearly plan */}
        <TouchableOpacity
          style={[styles.planCard, selectedPlan === 'pro_yearly' && styles.planCardActive]}
          onPress={() => setSelectedPlan('pro_yearly')}>
          {selectedPlan === 'pro_yearly' && (
            <LinearGradient
              colors={[Colors.primaryTransparent10, Colors.secondaryTransparent10]}
              style={StyleSheet.absoluteFill}
              borderRadius={BorderRadius.xl}
            />
          )}
          <View style={styles.bestValueBadge}>
            <LinearGradient
              colors={Colors.gradientGold as unknown as string[]}
              style={styles.bestValueGradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}>
              <Text style={styles.bestValueText}>BEST VALUE – SAVE 33%</Text>
            </LinearGradient>
          </View>
          <View style={[styles.planHeader, {marginTop: Spacing.lg}]}>
            <View>
              <Text style={styles.planName}>Pro Yearly</Text>
              <Text style={styles.planDesc}>₹66/month billed annually</Text>
            </View>
            <View style={styles.planPriceBox}>
              <Text style={styles.planPrice}>₹799</Text>
              <Text style={styles.planPer}>/year</Text>
            </View>
          </View>
          {selectedPlan === 'pro_yearly' && (
            <View style={styles.planCheckmark}>
              <Text style={styles.planCheckmarkText}>✓</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Features included */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Everything in Pro</Text>
        <View style={styles.featuresList}>
          {(selectedPlan === 'pro_monthly' ? proMonthly : proYearly).features
            .filter(f => f.included)
            .map((feature, i) => (
              <View key={i} style={[styles.featureRow, feature.highlight && styles.featureRowHighlight]}>
                <Text style={styles.featureCheck}>✓</Text>
                <Text style={[styles.featureLabel, feature.highlight && styles.featureLabelHighlight]}>
                  {feature.label}
                </Text>
                {feature.highlight && <Badge label="NEW" variant="primary" small />}
              </View>
            ))}
        </View>
      </View>

      {/* Comparison table */}
      <View style={styles.comparisonSection}>
        <Text style={styles.sectionTitle}>Free vs Pro</Text>
        <View style={styles.comparisonTable}>
          <View style={[styles.comparisonRow, styles.comparisonHeader]}>
            <Text style={[styles.comparisonCell, styles.comparisonCellLabel, styles.comparisonHeaderText]}>Feature</Text>
            <Text style={[styles.comparisonCellValue, styles.comparisonHeaderText]}>Free</Text>
            <Text style={[styles.comparisonCellPro, styles.comparisonHeaderText, {color: Colors.primary}]}>Pro ⭐</Text>
          </View>
          {COMPARISON_FEATURES.map((row, i) => (
            <View key={i} style={[styles.comparisonRow, i % 2 === 0 && styles.comparisonRowAlt]}>
              <Text style={[styles.comparisonCell, styles.comparisonCellLabel]}>{row.label}</Text>
              <Text style={styles.comparisonCellValue}>{row.free}</Text>
              <Text style={[styles.comparisonCellPro, {color: row.pro === '✕' ? Colors.error : Colors.success}]}>
                {row.pro}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Testimonials */}
      <View style={styles.testimonialsSection}>
        <Text style={styles.sectionTitle}>What Creators Say</Text>
        {TESTIMONIALS.map((t, i) => (
          <View key={i} style={styles.testimonialCard}>
            <LinearGradient
              colors={[Colors.card, Colors.surface]}
              style={StyleSheet.absoluteFill}
              borderRadius={BorderRadius.lg}
            />
            <View style={styles.testimonialStars}>
              {Array.from({length: t.rating}).map((_, j) => (
                <Text key={j} style={{fontSize: 14}}>⭐</Text>
              ))}
            </View>
            <Text style={styles.testimonialText}>"{t.text}"</Text>
            <Text style={styles.testimonialAuthor}>– {t.name}, {t.role}</Text>
          </View>
        ))}
      </View>

      {/* CTA */}
      <View style={styles.ctaSection}>
        {isPro ? (
          <View style={styles.activeSubscription}>
            <Text style={styles.activeText}>⭐ You're on Pro!</Text>
            {expiryDate && (
              <Text style={styles.activeExpiry}>
                Renews {new Date(expiryDate).toLocaleDateString()}
              </Text>
            )}
            <Button
              label="Continue Creating"
              onPress={() => navigation.goBack()}
              variant="primary"
              size="xl"
              fullWidth
            />
          </View>
        ) : (
          <>
            <Button
              label={`Start ${selectedPlan === 'pro_monthly' ? '₹99/month' : '₹799/year'} • Cancel Anytime`}
              onPress={handleSubscribe}
              variant="gold"
              size="xl"
              fullWidth
              loading={isLoading}
            />
            <Text style={styles.legalText}>
              Secure payment via Google Play / App Store. Cancel anytime from your account settings.
            </Text>
            <TouchableOpacity onPress={restorePurchases} style={styles.restoreBtn}>
              <Text style={styles.restoreBtnText}>Restore Purchases</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.bottomPad} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  hero: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl2,
    alignItems: 'center',
    gap: Spacing.md,
    overflow: 'hidden',
  },
  closeBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: Spacing.base,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {color: Colors.textPrimary, fontSize: 16, fontWeight: '700'},
  heroBadge: {borderRadius: BorderRadius.full, overflow: 'hidden'},
  heroBadgeGradient: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  heroBadgeText: {...Typography.label, color: '#0A0A1A', fontSize: 11},
  heroTitle: {...Typography.h1, color: Colors.textPrimary, textAlign: 'center', lineHeight: 44},
  heroSub: {...Typography.bodyLarge, color: Colors.textSecondary, textAlign: 'center'},
  socialProof: {
    flexDirection: 'row',
    gap: Spacing.xl,
    marginTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.lg,
    width: '100%',
    justifyContent: 'center',
  },
  socialItem: {alignItems: 'center', gap: Spacing.xs},
  socialNum: {...Typography.h4, color: Colors.textPrimary},
  socialLabel: {...Typography.caption, color: Colors.textMuted},
  planSelector: {padding: Spacing.xl, gap: Spacing.md},
  sectionTitle: {...Typography.h4, color: Colors.textPrimary, marginBottom: Spacing.sm},
  planCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    overflow: 'hidden',
    position: 'relative',
    ...Shadow.md,
  },
  planCardActive: {borderColor: Colors.primary},
  planHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  planName: {...Typography.h5, color: Colors.textPrimary},
  planDesc: {...Typography.caption, color: Colors.textMuted, marginTop: 2},
  planPriceBox: {alignItems: 'flex-end'},
  planPrice: {...Typography.price, color: Colors.gold},
  planPer: {...Typography.caption, color: Colors.textMuted},
  planCheckmark: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planCheckmarkText: {color: Colors.white, fontWeight: '700', fontSize: 12},
  bestValueBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  bestValueGradient: {paddingVertical: Spacing.xs, alignItems: 'center'},
  bestValueText: {...Typography.overline, color: '#0A0A1A', letterSpacing: 1},
  featuresSection: {paddingHorizontal: Spacing.xl, marginBottom: Spacing.xl},
  featuresList: {gap: Spacing.sm},
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  featureRowHighlight: {
    backgroundColor: Colors.primaryTransparent10,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
  },
  featureCheck: {color: Colors.success, fontSize: 16, width: 20, textAlign: 'center'},
  featureLabel: {...Typography.body, color: Colors.textSecondary, flex: 1},
  featureLabelHighlight: {color: Colors.textPrimary, fontWeight: '600'},
  comparisonSection: {paddingHorizontal: Spacing.xl, marginBottom: Spacing.xl},
  comparisonTable: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  comparisonRow: {
    flexDirection: 'row',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  comparisonRowAlt: {backgroundColor: Colors.whiteTransparent5},
  comparisonHeader: {
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  comparisonHeaderText: {fontWeight: '700', color: Colors.textPrimary},
  comparisonCell: {flex: 2, ...Typography.bodySmall, color: Colors.textSecondary},
  comparisonCellLabel: {},
  comparisonCellValue: {flex: 1, ...Typography.bodySmall, color: Colors.textMuted, textAlign: 'center'},
  comparisonCellPro: {flex: 1, ...Typography.bodySmall, fontWeight: '700', textAlign: 'center'},
  testimonialsSection: {paddingHorizontal: Spacing.xl, gap: Spacing.md, marginBottom: Spacing.xl},
  testimonialCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.xs,
  },
  testimonialStars: {flexDirection: 'row', gap: 2},
  testimonialText: {...Typography.body, color: Colors.textSecondary, fontStyle: 'italic', lineHeight: 24},
  testimonialAuthor: {...Typography.caption, color: Colors.textMuted, fontWeight: '600'},
  ctaSection: {paddingHorizontal: Spacing.xl, gap: Spacing.md},
  activeSubscription: {alignItems: 'center', gap: Spacing.md},
  activeText: {...Typography.h4, color: Colors.gold},
  activeExpiry: {...Typography.caption, color: Colors.textMuted},
  legalText: {...Typography.caption, color: Colors.textMuted, textAlign: 'center', lineHeight: 18},
  restoreBtn: {alignItems: 'center', paddingVertical: Spacing.sm},
  restoreBtnText: {...Typography.body, color: Colors.primary},
  bottomPad: {height: 60},
});
