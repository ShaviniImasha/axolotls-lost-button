/**
 * Object Controller
 * Model-View-Controller (MVC) - Controller Layer
 * Coordinates hidden object discovery, clicks, coordinates, and sparkle animations.
 */

import { ObjectModel, type HiddenObjectData } from '../models/ObjectModel';
import { audioService } from '../services/audioService';

export class ObjectController {
  private objectModel: ObjectModel;
  private onObjectFoundCallback?: (object: HiddenObjectData) => void;

  constructor(objectModel?: ObjectModel) {
    this.objectModel = objectModel || new ObjectModel([]);
  }

  public setModel(model: ObjectModel): void {
    this.objectModel = model;
  }

  public getModel(): ObjectModel {
    return this.objectModel;
  }

  public onObjectFound(callback: (object: HiddenObjectData) => void): void {
    this.onObjectFoundCallback = callback;
  }

  /**
   * Handle player clicking on a hidden object
   */
  public handleObjectClick(objectId: string): { success: boolean; object?: HiddenObjectData } {
    const object = this.objectModel.getById(objectId);
    if (!object || object.isFound) {
      return { success: false };
    }

    const newlyFound = this.objectModel.markFound(objectId);
    if (newlyFound) {
      if (object.required) {
        audioService.play('treasure');
      } else {
        audioService.play('found');
      }
      this.onObjectFoundCallback?.(object);
      return { success: true, object };
    }

    return { success: false };
  }

  public getRemainingCount(): number {
    return this.objectModel.getUnfound().length;
  }

  public getRemainingRequiredCount(): number {
    return this.objectModel.getUnfoundRequired().length;
  }

  public areAllRequiredFound(): boolean {
    return this.objectModel.areAllRequiredFound();
  }
}

export const objectController = new ObjectController();
