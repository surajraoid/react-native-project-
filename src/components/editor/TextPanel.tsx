import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput} from 'react-native';
import {Colors, Spacing, Typography, BorderRadius} from '../../theme';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import {useVideoEditor} from '../../hooks/useVideoEditor';
import {useSubscription} from '../../hooks/useSubscription';

const FONT_PRESETS = [
  {id: 'cartoon_bold', name: 'Cartoon Bold', style: {fontWeight: '800' as const, fontSize: 24}, isPro: false},
  {id: 'comic_sans', name: 'Comic', style: {fontWeight: '400' as const, fontSize: 22}, isPro: false},
  {id: 'bubble', name: 'Bubble', style: {fontWeight: '700' as const, fontSize: 26}, isPro: false},
  {id: 'retro', name: 'Retro', style: {fontWeight: '700' as const, fontSize: 20}, isPro: true},
  {id: 'handwritten', name: 'Handwritten', style: {fontWeight: '400' as const, fontSize: 22}, isPro: true},
  {id: 'pixel', name: 'Pixel', style: {fontWeight: '700' as const, fontSize: 18}, isPro: true},
  {id: 'neon_text', name: 'Neon', style: {fontWeight: '700' as const, fontSize: 24}, isPro: true},
  {id: 'minimal', name: 'Minimal', style: {fontWeight: '300' as const, fontSize: 22}, isPro: false},
];

const TEXT_ANIMATIONS = [
  {id: 'none', label: 'None', emoji: '⬜'},
  {id: 'typewriter', label: 'Typewriter', emoji: '⌨️'},
  {id: 'fade_in', label: 'Fade In', emoji: '🌅'},
  {id: 'bounce_in', label: 'Bounce', emoji: '🏀'},
  {id: 'slide_up', label: 'Slide Up', emoji: '⬆️'},
  {id: 'wave', label: 'Wave', emoji: '🌊'},
  {id: 'glitch', label: 'Glitch', emoji: '📺'},
  {id: 'pop', label: 'Pop', emoji: '💥'},
];

const COLOR_PRESETS = [
  '#FFFFFF', '#FFD700', '#FF4081', '#7C4DFF', '#00E5FF',
  '#00E676', '#FF6D00', '#FF1744', '#E040FB', '#40C4FF',
  '#1A1A35', '#000000',
];

export default function TextPanel() {
  const [text, setText] = useState('Add your text here');
  const [selectedFont, setSelectedFont] = useState('cartoon_bold');
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [selectedAnimation, setSelectedAnimation] = useState('none');
  const [fontSize, setFontSize] = useState(24);
  const [isBold, setIsBold] = useState(true);
  const [isItalic, setIsItalic] = useState(false);
  const [hasShadow, setHasShadow] = useState(false);
  const [hasOutline, setHasOutline] = useState(false);
  const {addTextToCurrentScene} = useVideoEditor();
  const {isPro, requirePro} = useSubscription();

  const handleAddText = () => {
    addTextToCurrentScene({
      text,
      style: {
        fontFamily: selectedFont,
        fontSize,
        fontWeight: isBold ? '700' : '400',
        color: selectedColor,
        italic: isItalic,
        strokeColor: hasOutline ? '#000000' : undefined,
        strokeWidth: hasOutline ? 2 : undefined,
        shadowColor: hasShadow ? 'rgba(0,0,0,0.5)' : undefined,
        shadowOffset: hasShadow ? {x: 2, y: 2} : undefined,
        shadowRadius: hasShadow ? 4 : undefined,
      },
      transform: {
        position: {x: 0.1, y: 0.1},
        scale: 1,
        rotation: 0,
        flipX: false,
        flipY: false,
      },
      isVisible: true,
      layer: 10,
      animation: selectedAnimation,
      duration: 3000,
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Text input */}
      <View style={styles.inputSection}>
        <Text style={styles.sectionTitle}>Text Content</Text>
        <TextInput
          style={styles.textInput}
          value={text}
          onChangeText={setText}
          multiline
          numberOfLines={3}
          placeholder="Type your text..."
          placeholderTextColor={Colors.textMuted}
          maxLength={200}
        />
        <Text style={styles.charCount}>{text.length}/200</Text>
      </View>

      {/* Font selector */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Font Style</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.fontsRow}>
          {FONT_PRESETS.map(font => (
            <TouchableOpacity
              key={font.id}
              style={[styles.fontCard, selectedFont === font.id && styles.fontCardActive]}
              onPress={() => {
                if (font.isPro && !isPro) {requirePro('Font: ' + font.name); return;}
                setSelectedFont(font.id);
              }}>
              <Text style={[styles.fontPreview, {fontWeight: font.style.fontWeight, fontSize: 14}]}>
                Aa
              </Text>
              <Text style={styles.fontName}>{font.name}</Text>
              {font.isPro && !isPro && <Badge label="PRO" variant="gold" small />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Size & Style */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Style</Text>
        <View style={styles.styleRow}>
          {/* Font size */}
          <View style={styles.sizeControl}>
            <TouchableOpacity
              style={styles.sizeBtn}
              onPress={() => setFontSize(s => Math.max(10, s - 2))}>
              <Text style={styles.sizeBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.sizeValue}>{fontSize}</Text>
            <TouchableOpacity
              style={styles.sizeBtn}
              onPress={() => setFontSize(s => Math.min(72, s + 2))}>
              <Text style={styles.sizeBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Format buttons */}
          <TouchableOpacity
            style={[styles.formatBtn, isBold && styles.formatBtnActive]}
            onPress={() => setIsBold(!isBold)}>
            <Text style={styles.formatBtnText}>B</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.formatBtn, isItalic && styles.formatBtnActive]}
            onPress={() => setIsItalic(!isItalic)}>
            <Text style={[styles.formatBtnText, {fontStyle: 'italic'}]}>I</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.formatBtn, hasShadow && styles.formatBtnActive]}
            onPress={() => setHasShadow(!hasShadow)}>
            <Text style={styles.formatBtnText}>S</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.formatBtn, hasOutline && styles.formatBtnActive]}
            onPress={() => setHasOutline(!hasOutline)}>
            <Text style={styles.formatBtnText}>O</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Color */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Color</Text>
        <View style={styles.colorsRow}>
          {COLOR_PRESETS.map(color => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorDot,
                {backgroundColor: color},
                selectedColor === color && styles.colorDotSelected,
                color === '#FFFFFF' && styles.colorDotWhite,
              ]}
              onPress={() => setSelectedColor(color)}
            />
          ))}
        </View>
      </View>

      {/* Text Animation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Animation</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.animsRow}>
          {TEXT_ANIMATIONS.map(anim => (
            <TouchableOpacity
              key={anim.id}
              style={[styles.animCard, selectedAnimation === anim.id && styles.animCardActive]}
              onPress={() => setSelectedAnimation(anim.id)}>
              <Text style={styles.animEmoji}>{anim.emoji}</Text>
              <Text style={[styles.animLabel, selectedAnimation === anim.id && styles.animLabelActive]}>
                {anim.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Preview */}
      <View style={styles.preview}>
        <Text style={[
          styles.previewText,
          {
            color: selectedColor,
            fontSize: Math.min(fontSize, 32),
            fontWeight: isBold ? '700' : '400',
            fontStyle: isItalic ? 'italic' : 'normal',
            textShadowColor: hasShadow ? 'rgba(0,0,0,0.5)' : 'transparent',
            textShadowOffset: {width: 2, height: 2},
            textShadowRadius: hasShadow ? 4 : 0,
          },
        ]}>
          {text || 'Preview'}
        </Text>
      </View>

      {/* Add button */}
      <View style={styles.addSection}>
        <Button label="Add Text to Scene" onPress={handleAddText} fullWidth size="lg" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.surface},
  section: {padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.divider},
  inputSection: {padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.divider},
  sectionTitle: {...Typography.h6, color: Colors.textPrimary, marginBottom: Spacing.sm},
  textInput: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    color: Colors.textPrimary,
    ...Typography.body,
    borderWidth: 1,
    borderColor: Colors.border,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  charCount: {...Typography.caption, color: Colors.textMuted, textAlign: 'right', marginTop: Spacing.xs},
  fontsRow: {gap: Spacing.sm, paddingRight: Spacing.md},
  fontCard: {
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 72,
    gap: Spacing.xs,
  },
  fontCardActive: {borderColor: Colors.primary, backgroundColor: Colors.primaryTransparent10},
  fontPreview: {color: Colors.textPrimary},
  fontName: {...Typography.caption, color: Colors.textSecondary, textAlign: 'center'},
  styleRow: {flexDirection: 'row', alignItems: 'center', gap: Spacing.sm},
  sizeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sizeBtn: {
    width: 32,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cardElevated,
  },
  sizeBtnText: {...Typography.h5, color: Colors.textPrimary},
  sizeValue: {
    paddingHorizontal: Spacing.sm,
    ...Typography.body,
    color: Colors.textPrimary,
    minWidth: 32,
    textAlign: 'center',
  },
  formatBtn: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formatBtnActive: {backgroundColor: Colors.primaryTransparent20, borderColor: Colors.primary},
  formatBtnText: {...Typography.body, color: Colors.textPrimary, fontWeight: '700'},
  colorsRow: {flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm},
  colorDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  colorDotSelected: {borderWidth: 3, borderColor: Colors.primary},
  colorDotWhite: {borderColor: Colors.border},
  animsRow: {gap: Spacing.sm, paddingRight: Spacing.md},
  animCard: {
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 72,
    gap: Spacing.xs,
  },
  animCardActive: {borderColor: Colors.accent, backgroundColor: Colors.accentTransparent10},
  animEmoji: {fontSize: 24},
  animLabel: {...Typography.caption, color: Colors.textSecondary, textAlign: 'center'},
  animLabelActive: {color: Colors.accent},
  preview: {
    margin: Spacing.md,
    padding: Spacing.xl,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  previewText: {textAlign: 'center'},
  addSection: {padding: Spacing.md, paddingBottom: Spacing.xl2},
});
