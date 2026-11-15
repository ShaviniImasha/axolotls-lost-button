/**
 * Settings View
 * Model-View-Controller (MVC) - View Layer
 * Renders the settings drawer with audio, ocean waves, motion, and timer toggles.
 */

import { renderSettingsModal, type SettingsModalProps } from '../../components/SettingsModal';
import { settingsService } from '../../services/settingsService';

export class SettingsView {
  public static render(props?: Partial<SettingsModalProps>): string {
    return renderSettingsModal({
      settings: props?.settings || settingsService.getSettings(),
    });
  }
}
