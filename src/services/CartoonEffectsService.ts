import {CartoonStyle, Effect} from '../types';

export interface EffectPreset {
  id: string;
  name: string;
  style: CartoonStyle;
  effects: Array<{type: string; params: Record<string, number | string>}>;
}

const STYLE_PRESETS: Record<CartoonStyle, EffectPreset> = {
  anime: {
    id: 'anime_preset',
    name: 'Anime Style',
    style: 'anime',
    effects: [
      {type: 'outline', params: {width: 2, color: '#000000', smoothing: 0.8}},
      {type: 'color_saturation', params: {saturation: 1.4, brightness: 1.1}},
      {type: 'cel_shade', params: {levels: 4, softness: 0.3}},
    ],
  },
  comic: {
    id: 'comic_preset',
    name: 'Comic Style',
    style: 'comic',
    effects: [
      {type: 'halftone', params: {dotSize: 3, angle: 45}},
      {type: 'outline', params: {width: 3, color: '#000000', smoothing: 0.5}},
      {type: 'color_posterize', params: {levels: 6}},
    ],
  },
  watercolor: {
    id: 'watercolor_preset',
    name: 'Watercolor',
    style: 'watercolor',
    effects: [
      {type: 'watercolor', params: {intensity: 0.8, bleeding: 0.4, texture: 0.6}},
      {type: 'color_saturation', params: {saturation: 0.9, brightness: 1.05}},
      {type: 'soft_blur', params: {radius: 1.5}},
    ],
  },
  sketch: {
    id: 'sketch_preset',
    name: 'Sketch',
    style: 'sketch',
    effects: [
      {type: 'pencil_sketch', params: {lineWeight: 0.7, roughness: 0.4}},
      {type: 'desaturate', params: {amount: 0.8}},
      {type: 'paper_texture', params: {opacity: 0.3}},
    ],
  },
  pixar: {
    id: 'pixar_preset',
    name: 'Pixar 3D',
    style: 'pixar',
    effects: [
      {type: 'subsurface_scatter', params: {intensity: 0.5}},
      {type: 'rim_light', params: {strength: 0.8, color: '#FFE0B2'}},
      {type: 'ambient_occlusion', params: {radius: 2, intensity: 0.6}},
    ],
  },
  flat: {
    id: 'flat_preset',
    name: 'Flat Design',
    style: 'flat',
    effects: [
      {type: 'posterize', params: {levels: 3}},
      {type: 'outline_flat', params: {width: 0}},
      {type: 'color_simplify', params: {clusters: 8}},
    ],
  },
  retro: {
    id: 'retro_preset',
    name: 'Retro',
    style: 'retro',
    effects: [
      {type: 'vhs_effect', params: {intensity: 0.4}},
      {type: 'color_grading', params: {temperature: 0.2, tint: 0.1}},
      {type: 'film_grain', params: {amount: 0.2}},
    ],
  },
  neon: {
    id: 'neon_preset',
    name: 'Neon Glow',
    style: 'neon',
    effects: [
      {type: 'neon_glow', params: {radius: 8, intensity: 1.2}},
      {type: 'dark_background', params: {brightness: -0.3}},
      {type: 'color_vibrance', params: {vibrance: 0.8}},
    ],
  },
  fantasy: {
    id: 'fantasy_preset',
    name: 'Fantasy',
    style: 'fantasy',
    effects: [
      {type: 'magic_particles', params: {density: 0.3}},
      {type: 'ethereal_glow', params: {color: '#E1BEE7', radius: 4}},
      {type: 'color_dreamy', params: {pastel: 0.4}},
    ],
  },
  chibi: {
    id: 'chibi_preset',
    name: 'Chibi',
    style: 'chibi',
    effects: [
      {type: 'outline', params: {width: 2.5, color: '#333333', smoothing: 0.7}},
      {type: 'color_saturate', params: {saturation: 1.6}},
      {type: 'soft_light', params: {intensity: 0.3}},
    ],
  },
  realistic: {
    id: 'realistic_preset',
    name: 'Semi-Real',
    style: 'realistic',
    effects: [
      {type: 'semi_real', params: {intensity: 0.6}},
      {type: 'detail_enhance', params: {sharpness: 0.4}},
    ],
  },
  oil_painting: {
    id: 'oil_preset',
    name: 'Oil Paint',
    style: 'oil_painting',
    effects: [
      {type: 'oil_paint', params: {brushSize: 8, detail: 0.7}},
      {type: 'color_richness', params: {warmth: 0.2}},
    ],
  },
  cel_shading: {
    id: 'cel_preset',
    name: 'Cel Shade',
    style: 'cel_shading',
    effects: [
      {type: 'cel_shade', params: {levels: 3, softness: 0.2}},
      {type: 'hard_outline', params: {width: 2}},
    ],
  },
  minimalist: {
    id: 'minimal_preset',
    name: 'Minimalist',
    style: 'minimalist',
    effects: [
      {type: 'flatten', params: {colors: 4}},
      {type: 'negative_space', params: {threshold: 0.5}},
    ],
  },
  cyberpunk: {
    id: 'cyberpunk_preset',
    name: 'Cyberpunk',
    style: 'cyberpunk',
    effects: [
      {type: 'scanlines', params: {intensity: 0.2, spacing: 4}},
      {type: 'chromatic_aberration', params: {shift: 3}},
      {type: 'neon_glow', params: {color: '#FF4081', radius: 6}},
      {type: 'dark_atmosphere', params: {intensity: 0.5}},
    ],
  },
};

export class CartoonEffectsService {
  private static instance: CartoonEffectsService;

  static getInstance(): CartoonEffectsService {
    if (!CartoonEffectsService.instance) {
      CartoonEffectsService.instance = new CartoonEffectsService();
    }
    return CartoonEffectsService.instance;
  }

  getPresetForStyle(style: CartoonStyle): EffectPreset {
    return STYLE_PRESETS[style] ?? STYLE_PRESETS.anime;
  }

  applyStylePreset(style: CartoonStyle): Effect[] {
    const preset = this.getPresetForStyle(style);
    return preset.effects.map((e, i) => ({
      id: `${style}_effect_${i}`,
      type: e.type,
      params: e.params,
      intensity: 1.0,
    }));
  }

  blendStyles(
    styleA: CartoonStyle,
    styleB: CartoonStyle,
    blend: number,
  ): Effect[] {
    const presetA = this.getPresetForStyle(styleA);
    const presetB = this.getPresetForStyle(styleB);

    return [
      ...presetA.effects.map((e, i) => ({
        id: `blend_a_${i}`,
        type: e.type,
        params: e.params,
        intensity: 1 - blend,
      })),
      ...presetB.effects.map((e, i) => ({
        id: `blend_b_${i}`,
        type: e.type,
        params: e.params,
        intensity: blend,
      })),
    ];
  }

  getAvailableEffects() {
    return Object.values(STYLE_PRESETS).map(p => ({
      id: p.id,
      name: p.name,
      style: p.style,
      effectCount: p.effects.length,
    }));
  }
}

export const cartoonEffectsService = CartoonEffectsService.getInstance();
