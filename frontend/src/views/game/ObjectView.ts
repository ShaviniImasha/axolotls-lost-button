/**
 * Object View
 * Model-View-Controller (MVC) - View Layer
 * Renders hidden objects, target coordinates, and sparkle discovery animations.
 */

import { assetUrl } from '../../assets';
import type { HiddenObjectData } from '../../models/ObjectModel';

export interface ObjectViewProps {
  objects: HiddenObjectData[];
  highlightedId?: string | null;
}

export class ObjectView {
  public static render(props: ObjectViewProps): string {
    return `
      <div class="pond-objects-container">
        ${props.objects
          .map((obj) => {
            const isHighlighted = props.highlightedId === obj.id;
            const visibilityClass = obj.isFound ? 'item-found' : 'item-hidden';
            const highlightClass = isHighlighted ? 'item-hint-sparkle' : '';

            return `
              <div
                class="hidden-object-hotspot ${visibilityClass} ${highlightClass}"
                data-action="click-object"
                data-object-id="${obj.id}"
                style="left: ${obj.x}%; top: ${obj.y}%; width: ${obj.width}px; height: ${obj.height}px;"
                aria-label="${obj.name}"
              >
                <img src="${assetUrl(obj.assetKey)}" class="object-asset" alt="${obj.name}" />
                ${isHighlighted ? `<img src="${assetUrl('sparkles')}" class="sparkle-anim" alt="Shimmer" />` : ''}
              </div>
            `;
          })
          .join('')}
      </div>
    `;
  }
}
