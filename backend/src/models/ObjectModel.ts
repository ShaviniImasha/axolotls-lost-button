/**
 * Object Model
 * Model-View-Controller (MVC) - Model Layer
 * Manages hidden objects, pond placements, coordinates, and discovery states.
 */

import type { AssetName } from '../assets';
import type { HiddenObjectType } from '../game/levelManager';

export interface HiddenObjectData {
  id: string;
  name: string;
  assetKey: AssetName;
  type: HiddenObjectType;
  x: number;
  y: number;
  width: number;
  height: number;
  required: boolean;
  isFound: boolean;
  discoveredAt?: number;
}

export class ObjectModel {
  private objects: Map<string, HiddenObjectData> = new Map();

  constructor(initialObjects: HiddenObjectData[] = []) {
    this.setObjects(initialObjects);
  }

  public setObjects(items: HiddenObjectData[]): void {
    this.objects.clear();
    for (const item of items) {
      this.objects.set(item.id, { ...item });
    }
  }

  public getAll(): HiddenObjectData[] {
    return Array.from(this.objects.values());
  }

  public getById(id: string): HiddenObjectData | undefined {
    return this.objects.get(id);
  }

  public getUnfound(): HiddenObjectData[] {
    return this.getAll().filter((item) => !item.isFound);
  }

  public getUnfoundRequired(): HiddenObjectData[] {
    return this.getAll().filter((item) => !item.isFound && item.required);
  }

  public getFound(): HiddenObjectData[] {
    return this.getAll().filter((item) => item.isFound);
  }

  public markFound(id: string): boolean {
    const item = this.objects.get(id);
    if (item && !item.isFound) {
      item.isFound = true;
      item.discoveredAt = Date.now();
      return true;
    }
    return false;
  }

  public areAllRequiredFound(): boolean {
    return this.getUnfoundRequired().length === 0;
  }

  public areAllFound(): boolean {
    return this.getUnfound().length === 0;
  }

  public getFoundCount(): number {
    return this.getFound().length;
  }

  public getTotalCount(): number {
    return this.objects.size;
  }

  public reset(): void {
    for (const item of this.objects.values()) {
      item.isFound = false;
      delete item.discoveredAt;
    }
  }
}
