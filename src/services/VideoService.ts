import {Platform} from 'react-native';
import {ExportConfig, Project} from '../types';
import {getAspectRatioDimensions, formatDuration} from '../utils/helpers';

export interface ExportProgress {
  stage: 'compositing' | 'rendering' | 'encoding' | 'finalizing';
  progress: number;
  message: string;
}

export type ExportProgressCallback = (progress: ExportProgress) => void;

export class VideoService {
  private static instance: VideoService;

  static getInstance(): VideoService {
    if (!VideoService.instance) {
      VideoService.instance = new VideoService();
    }
    return VideoService.instance;
  }

  async exportVideo(
    project: Project,
    config: ExportConfig,
    onProgress: ExportProgressCallback,
  ): Promise<string> {
    // Simulate export stages (real implementation uses FFmpeg / native video processing)
    const stages: ExportProgress[] = [
      {stage: 'compositing', progress: 0, message: 'Compositing scenes...'},
      {stage: 'compositing', progress: 0.25, message: 'Applying cartoon effects...'},
      {stage: 'rendering', progress: 0.4, message: 'Rendering frames...'},
      {stage: 'rendering', progress: 0.6, message: 'Processing audio tracks...'},
      {stage: 'encoding', progress: 0.75, message: `Encoding ${config.quality} video...`},
      {stage: 'encoding', progress: 0.9, message: 'Optimizing file size...'},
      {stage: 'finalizing', progress: 0.95, message: 'Finalizing export...'},
      {stage: 'finalizing', progress: 1.0, message: 'Export complete!'},
    ];

    for (const stage of stages) {
      onProgress(stage);
      await sleep(800);
    }

    // Return simulated file path
    const filename = `${sanitizeFilename(project.name)}_${Date.now()}.${config.format}`;
    return Platform.OS === 'ios'
      ? `${getDocumentsDir()}/${filename}`
      : `${getExternalDir()}/${filename}`;
  }

  async generateThumbnail(project: Project): Promise<string> {
    // In production: capture first frame of first scene
    return '';
  }

  getEstimatedFileSize(project: Project, config: ExportConfig): string {
    const durationSecs = project.duration / 1000;
    const bitrateMap: Record<string, number> = {
      '4K': 35_000,
      '1080p': 8_000,
      '720p': 5_000,
      '480p': 2_500,
    };
    const kbps = bitrateMap[config.quality] ?? 8_000;
    const bytes = (kbps * 1000 * durationSecs) / 8;
    if (bytes < 1_048_576) {return `${(bytes / 1024).toFixed(1)} KB`;}
    return `${(bytes / 1_048_576).toFixed(1)} MB`;
  }

  getEstimatedExportTime(project: Project): string {
    const durationSecs = project.duration / 1000;
    const scenesCount = project.scenes.length;
    const estimatedSeconds = durationSecs * 0.5 + scenesCount * 2;
    return formatDuration(estimatedSeconds * 1000);
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9_\-]/g, '_').toLowerCase();
}

function getDocumentsDir(): string {
  return '/Documents/ToonCraftPro';
}

function getExternalDir(): string {
  return '/storage/emulated/0/ToonCraftPro';
}

export const videoService = VideoService.getInstance();
