import AsyncStorage from '@react-native-async-storage/async-storage';
import {Project} from '../types';
import {STORAGE_KEYS} from '../utils/constants';

export class StorageService {
  private static instance: StorageService;

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  async getProjects(): Promise<Project[]> {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEYS.PROJECTS);
      return json ? JSON.parse(json) : [];
    } catch {
      return [];
    }
  }

  async saveProjects(projects: Project[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }

  async getProject(id: string): Promise<Project | null> {
    const projects = await this.getProjects();
    return projects.find(p => p.id === id) ?? null;
  }

  async saveProject(project: Project): Promise<void> {
    const projects = await this.getProjects();
    const idx = projects.findIndex(p => p.id === project.id);
    if (idx >= 0) {
      projects[idx] = project;
    } else {
      projects.unshift(project);
    }
    await this.saveProjects(projects);
  }

  async deleteProject(id: string): Promise<void> {
    const projects = await this.getProjects();
    await this.saveProjects(projects.filter(p => p.id !== id));
  }

  async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  }

  async getStorageSize(): Promise<number> {
    const keys = await AsyncStorage.getAllKeys();
    let totalBytes = 0;
    for (const key of keys) {
      const value = await AsyncStorage.getItem(key);
      if (value) {totalBytes += value.length * 2;}
    }
    return totalBytes;
  }

  async exportBackup(): Promise<string> {
    const allKeys = await AsyncStorage.getAllKeys();
    const pairs = await AsyncStorage.multiGet(allKeys);
    const backup: Record<string, string> = {};
    pairs.forEach(([k, v]) => {if (v) {backup[k] = v;}});
    return JSON.stringify({
      version: '1.0',
      exportedAt: new Date().toISOString(),
      data: backup,
    });
  }

  async importBackup(backupJson: string): Promise<void> {
    const backup = JSON.parse(backupJson);
    const pairs: [string, string][] = Object.entries(backup.data);
    await AsyncStorage.multiSet(pairs);
  }
}

export const storageService = StorageService.getInstance();
