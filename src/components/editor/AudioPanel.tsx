import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList} from 'react-native';
import Slider from '@react-native-community/slider';
import {Colors, Spacing, Typography, BorderRadius} from '../../theme';
import Badge from '../ui/Badge';
import {VOICE_CARTOON_EFFECTS, MUSIC_MOODS} from '../../utils/constants';
import {useSubscription} from '../../hooks/useSubscription';
import {useVideoEditor} from '../../hooks/useVideoEditor';
import {formatDurationShort} from '../../utils/formatters';

type AudioTab = 'music' | 'sfx' | 'voice' | 'record';

const MUSIC_TRACKS = [
  {id: 'm1', name: 'Happy Adventure', artist: 'ToonBeats', duration: 180000, mood: 'Happy', isPro: false, genre: 'Cartoon'},
  {id: 'm2', name: 'Epic Battle', artist: 'ToonBeats', duration: 240000, mood: 'Epic', isPro: false, genre: 'Action'},
  {id: 'm3', name: 'Romantic Sunset', artist: 'ToonBeats', duration: 200000, mood: 'Romantic', isPro: true, genre: 'Ambient'},
  {id: 'm4', name: 'Funny Chase', artist: 'ToonBeats', duration: 120000, mood: 'Funny', isPro: false, genre: 'Comedy'},
  {id: 'm5', name: 'Kids Play', artist: 'ToonBeats', duration: 150000, mood: 'Kids', isPro: false, genre: 'Kids'},
  {id: 'm6', name: 'Cyberpunk City', artist: 'ToonBeats', duration: 180000, mood: 'Action', isPro: true, genre: 'Electronic'},
  {id: 'm7', name: 'Mysterious Forest', artist: 'ToonBeats', duration: 200000, mood: 'Mysterious', isPro: true, genre: 'Ambient'},
  {id: 'm8', name: 'Corporate Intro', artist: 'ToonBeats', duration: 90000, mood: 'Corporate', isPro: true, genre: 'Corporate'},
];

const SFX_LIST = [
  {id: 's1', name: 'Cartoon Boing', category: 'Cartoon', isPro: false, emoji: '🎪'},
  {id: 's2', name: 'Magic Sparkle', category: 'Magic', isPro: false, emoji: '✨'},
  {id: 's3', name: 'Punch Hit', category: 'Action', isPro: false, emoji: '💥'},
  {id: 's4', name: 'Laugh Track', category: 'Comedy', isPro: false, emoji: '😂'},
  {id: 's5', name: 'Laser Beam', category: 'Sci-Fi', isPro: true, emoji: '⚡'},
  {id: 's6', name: 'Level Up', category: 'Gaming', isPro: false, emoji: '🎮'},
  {id: 's7', name: 'Glass Break', category: 'Action', isPro: true, emoji: '💎'},
  {id: 's8', name: 'Fanfare', category: 'Music', isPro: false, emoji: '🎺'},
];

export default function AudioPanel() {
  const [activeTab, setActiveTab] = useState<AudioTab>('music');
  const [activeMood, setActiveMood] = useState<string>('all');
  const [volume, setVolume] = useState(0.8);
  const [selectedVoiceEffect, setSelectedVoiceEffect] = useState('none');
  const [isRecording, setIsRecording] = useState(false);
  const {isPro, requirePro} = useSubscription();
  const {addAudioToCurrentScene, currentScene} = useVideoEditor();

  const tabs: {id: AudioTab; emoji: string; label: string}[] = [
    {id: 'music', emoji: '🎵', label: 'Music'},
    {id: 'sfx', emoji: '🔊', label: 'SFX'},
    {id: 'voice', emoji: '🎙️', label: 'Voice AI'},
    {id: 'record', emoji: '⏺️', label: 'Record'},
  ];

  const filteredTracks = activeMood === 'all'
    ? MUSIC_TRACKS
    : MUSIC_TRACKS.filter(t => t.mood === activeMood);

  const handleAddMusic = (track: typeof MUSIC_TRACKS[0]) => {
    if (track.isPro && !isPro) {
      requirePro('Music: ' + track.name);
      return;
    }
    if (!currentScene) {return;}
    addAudioToCurrentScene({
      uri: '',
      name: track.name,
      type: 'music',
      startTime: 0,
      duration: track.duration,
      volume,
      isVisible: true,
      color: Colors.trackMusic,
    });
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            onPress={() => setActiveTab(tab.id)}>
            <Text style={styles.tabEmoji}>{tab.emoji}</Text>
            <Text style={[styles.tabLabel, activeTab === tab.id && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Master Volume */}
      <View style={styles.volumeRow}>
        <Text style={styles.sectionLabel}>🔊 Volume</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          value={volume}
          onValueChange={setVolume}
          minimumTrackTintColor={Colors.primary}
          maximumTrackTintColor={Colors.border}
          thumbTintColor={Colors.primary}
        />
        <Text style={styles.volumeValue}>{Math.round(volume * 100)}%</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {activeTab === 'music' && (
          <>
            {/* Mood filter */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.moodRow}>
              <TouchableOpacity
                style={[styles.moodChip, activeMood === 'all' && styles.moodChipActive]}
                onPress={() => setActiveMood('all')}>
                <Text style={styles.moodChipText}>All</Text>
              </TouchableOpacity>
              {MUSIC_MOODS.map(mood => (
                <TouchableOpacity
                  key={mood}
                  style={[styles.moodChip, activeMood === mood && styles.moodChipActive]}
                  onPress={() => setActiveMood(mood)}>
                  <Text style={styles.moodChipText}>{mood}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {filteredTracks.map(track => (
              <TouchableOpacity
                key={track.id}
                style={styles.trackRow}
                onPress={() => handleAddMusic(track)}>
                <View style={styles.trackIcon}>
                  <Text style={{fontSize: 28}}>🎵</Text>
                </View>
                <View style={styles.trackInfo}>
                  <Text style={styles.trackName}>{track.name}</Text>
                  <Text style={styles.trackMeta}>{track.artist} • {track.mood} • {formatDurationShort(track.duration)}</Text>
                </View>
                <View style={styles.trackActions}>
                  {track.isPro && !isPro ? (
                    <Badge label="PRO" variant="gold" small />
                  ) : (
                    <TouchableOpacity style={styles.addBtn} onPress={() => handleAddMusic(track)}>
                      <Text style={styles.addBtnText}>+</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {activeTab === 'sfx' && (
          <View style={styles.sfxGrid}>
            {SFX_LIST.map(sfx => (
              <TouchableOpacity
                key={sfx.id}
                style={styles.sfxCard}
                onPress={() => {
                  if (sfx.isPro && !isPro) {requirePro('SFX: ' + sfx.name);}
                }}>
                <Text style={styles.sfxEmoji}>{sfx.emoji}</Text>
                <Text style={styles.sfxName}>{sfx.name}</Text>
                <Text style={styles.sfxCategory}>{sfx.category}</Text>
                {sfx.isPro && !isPro && <Badge label="PRO" variant="gold" small />}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeTab === 'voice' && (
          <>
            <Text style={styles.sectionTitle}>AI Voice Generator</Text>
            <Text style={styles.sectionDesc}>
              Type text and our AI will generate natural cartoon voices with lip sync.
            </Text>

            <Text style={styles.sectionLabel}>Cartoon Voice Effect</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.voiceEffectsRow}>
              {VOICE_CARTOON_EFFECTS.map(effect => (
                <TouchableOpacity
                  key={effect.id}
                  style={[styles.voiceEffectChip, selectedVoiceEffect === effect.id && styles.voiceEffectActive]}
                  onPress={() => setSelectedVoiceEffect(effect.id)}>
                  <Text style={styles.voiceEffectLabel}>{effect.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.proFeature}>
              <Text style={styles.proFeatureEmoji}>🤖</Text>
              <Text style={styles.proFeatureTitle}>AI Voice & Lip Sync</Text>
              <Text style={styles.proFeatureDesc}>
                Generate realistic cartoon voices with automatic lip synchronization for your characters.
              </Text>
              {!isPro && <Badge label="PRO FEATURE" variant="gold" />}
            </View>
          </>
        )}

        {activeTab === 'record' && (
          <>
            <Text style={styles.sectionTitle}>Voice Recording</Text>
            <View style={styles.recordContainer}>
              <TouchableOpacity
                style={[styles.recordBtn, isRecording && styles.recordBtnActive]}
                onPress={() => setIsRecording(!isRecording)}>
                <Text style={styles.recordBtnEmoji}>{isRecording ? '⏹' : '⏺️'}</Text>
                <Text style={styles.recordBtnLabel}>{isRecording ? 'Stop Recording' : 'Start Recording'}</Text>
              </TouchableOpacity>
              {isRecording && (
                <View style={styles.recordingIndicator}>
                  <View style={styles.recordingDot} />
                  <Text style={styles.recordingText}>Recording...</Text>
                </View>
              )}
            </View>

            <Text style={styles.sectionLabel}>Apply Voice Effect After Recording</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.voiceEffectsRow}>
              {VOICE_CARTOON_EFFECTS.map(effect => (
                <TouchableOpacity
                  key={effect.id}
                  style={[styles.voiceEffectChip, selectedVoiceEffect === effect.id && styles.voiceEffectActive]}
                  onPress={() => setSelectedVoiceEffect(effect.id)}>
                  <Text style={styles.voiceEffectLabel}>{effect.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    gap: 2,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabEmoji: {fontSize: 16},
  tabLabel: {
    ...Typography.overline,
    color: Colors.textMuted,
    fontSize: 9,
  },
  tabLabelActive: {color: Colors.primary},
  volumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    gap: Spacing.sm,
  },
  sectionLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  slider: {flex: 1, height: 32},
  volumeValue: {
    ...Typography.caption,
    color: Colors.textSecondary,
    minWidth: 32,
    textAlign: 'right',
  },
  content: {flex: 1, padding: Spacing.md},
  moodRow: {gap: Spacing.xs, marginBottom: Spacing.md, paddingRight: Spacing.md},
  moodChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  moodChipActive: {
    backgroundColor: Colors.primaryTransparent20,
    borderColor: Colors.primary,
  },
  moodChipText: {...Typography.caption, color: Colors.textSecondary, fontWeight: '500'},
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    gap: Spacing.sm,
  },
  trackIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackInfo: {flex: 1},
  trackName: {...Typography.bodySmall, color: Colors.textPrimary, fontWeight: '600'},
  trackMeta: {...Typography.caption, color: Colors.textMuted, marginTop: 2},
  trackActions: {alignItems: 'flex-end'},
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {color: Colors.white, fontSize: 18, fontWeight: '700', lineHeight: 24},
  sfxGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm},
  sfxCard: {
    width: '47%',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.xs,
  },
  sfxEmoji: {fontSize: 32},
  sfxName: {...Typography.bodySmall, color: Colors.textPrimary, fontWeight: '600', textAlign: 'center'},
  sfxCategory: {...Typography.caption, color: Colors.textMuted},
  sectionTitle: {...Typography.h5, color: Colors.textPrimary, marginBottom: Spacing.xs},
  sectionDesc: {...Typography.bodySmall, color: Colors.textMuted, marginBottom: Spacing.md, lineHeight: 20},
  voiceEffectsRow: {gap: Spacing.xs, paddingRight: Spacing.md, marginBottom: Spacing.md},
  voiceEffectChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  voiceEffectActive: {backgroundColor: Colors.primaryTransparent20, borderColor: Colors.primary},
  voiceEffectLabel: {...Typography.caption, color: Colors.textSecondary},
  proFeature: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.gold + '44',
  },
  proFeatureEmoji: {fontSize: 48},
  proFeatureTitle: {...Typography.h5, color: Colors.gold},
  proFeatureDesc: {...Typography.bodySmall, color: Colors.textMuted, textAlign: 'center', lineHeight: 20},
  recordContainer: {alignItems: 'center', paddingVertical: Spacing.xl},
  recordBtn: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.card,
    borderWidth: 3,
    borderColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  recordBtnActive: {backgroundColor: Colors.error + '22'},
  recordBtnEmoji: {fontSize: 36},
  recordBtnLabel: {...Typography.caption, color: Colors.textPrimary, textAlign: 'center'},
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
  },
  recordingText: {...Typography.body, color: Colors.error},
});
