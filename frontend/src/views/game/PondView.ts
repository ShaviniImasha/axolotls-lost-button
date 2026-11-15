/**
 * Pond View
 * Model-View-Controller (MVC) - View Layer
 * Renders the underwater scene backdrop, ambient seaweeds, fish, and swimming creatures.
 */

import { assetUrl } from '../../assets';
import type { RealmDefinition } from '../../game/levelManager';

export interface PondViewProps {
  realm: RealmDefinition;
}

export class PondView {
  public static render(props: PondViewProps): string {
    const { realm } = props;
    return `
      <div class="pond-environment-layer ${realm.accentClass}">
        <div class="pond-deep-water"></div>
        <div class="pond-sunbeams"></div>
        <div class="pond-seaweed-cluster seaweed-left">
          <img src="${assetUrl('seaweed-wave')}" class="seaweed-stem wave-anim" alt="Seaweed">
          <img src="${assetUrl('coral-fan')}" class="coral-fan-deco" alt="Coral">
        </div>
        <div class="pond-seaweed-cluster seaweed-right">
          <img src="${assetUrl('seaweed-leafy')}" class="seaweed-stem leaf-anim" alt="Seaweed">
          <img src="${assetUrl('coral-branch')}" class="coral-branch-deco" alt="Coral">
        </div>
        <div class="pond-bubbles-float"></div>
      </div>
    `;
  }
}
