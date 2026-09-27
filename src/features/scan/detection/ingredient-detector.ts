import type { DetectionRun } from './detection-run';

/** A captured or imported photo that stays on the device. */
export type DetectorImage = {
  /** Local `file://` URI in the app sandbox — never a remote URL. */
  uri: string;
};

/**
 * The detector port. The rest of the app depends on this interface only; the on-device adapter
 * behind it (native module + TypeScript wrapper, added with the first detection spike) is the only
 * code that knows YOLO or Core ML exist. Swapping the model changes the adapter, not this port.
 */
export interface IngredientDetector {
  detect(image: DetectorImage): Promise<DetectionRun>;
}
