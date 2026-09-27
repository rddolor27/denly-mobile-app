/**
 * The vision contract (architecture rules, computer-vision skill § Detection contract). A
 * `DetectionRun` is the only vision data that ever leaves the phone; the backend declares the same
 * shape as its submission DTO and validates it against the model registry. Nothing in this file
 * knows which model produced the detections.
 */

/** Normalised 0..1, top-left origin, relative to the upright original image; x1 < x2, y1 < y2. */
export type BoundingBox = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type DetectionResult = {
  /** Stable id from the model's taxonomy (append-only, never renumbered). */
  classId: number;
  /** Taxonomy label, lowercase snake_case (e.g. `garlic`) — not a canonical ingredient id. */
  className: string;
  bbox: BoundingBox;
  /** 0..1, after NMS. */
  confidence: number;
  modelVersion: string;
};

export type ImageSize = {
  /** Upright image width in pixels. */
  w: number;
  /** Upright image height in pixels. */
  h: number;
};

export type DetectionRun = {
  /** An empty array is a valid result (nothing found), not an error. */
  detections: DetectionResult[];
  imageSize: ImageSize;
  latencyMs: number;
  modelVersion: string;
};
