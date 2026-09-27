import { contrastRatio } from './color';
import { THEME, type ColorScheme, type ThemeColors } from './theme';

type Key = keyof ThemeColors;
type Pair = readonly [text: Key, surface: Key];

const BODY = 4.5;
const LARGE_OR_NON_TEXT = 3;

/** Every text/surface pair the UI uses for body-size text. */
const TEXT_PAIRS: readonly Pair[] = [
  ['foreground', 'background'],
  ['foreground', 'card'],
  ['foreground', 'muted'],
  ['foreground', 'accent'],
  ['cardForeground', 'card'],
  ['popoverForeground', 'popover'],
  ['mutedForeground', 'background'],
  ['mutedForeground', 'card'],
  ['mutedForeground', 'muted'],
  ['mutedForeground', 'accent'],
  ['primaryForeground', 'primary'],
  ['secondaryForeground', 'secondary'],
  ['accentForeground', 'accent'],
  ['destructiveForeground', 'destructive'],
  // Links, "Log out" and "Delete account" rows are coloured text on the page or a card.
  ['primary', 'background'],
  ['primary', 'card'],
  ['destructive', 'background'],
  ['destructive', 'card'],
  ['heroForeground', 'hero'],
  ['cameraForeground', 'camera'],
  // Confidence words.
  ['detected', 'background'],
  ['detected', 'card'],
  ['detected', 'detectedSoft'],
  ['likely', 'background'],
  ['likely', 'card'],
  ['likely', 'muted'],
  // Offline banner and category badges.
  ['info', 'infoSoft'],
  ['dish', 'dishSoft'],
  ['leafy', 'leafySoft'],
  ['fish', 'fishSoft'],
];

/** Non-text elements and large text: icons, the Scan button, focus ring, selected tab icon. */
// Not listed on purpose: the pink Scan button on the black hero card (light 2.4:1). The button is
// identified by its label (primaryForeground on primary, above), which WCAG 1.4.11 accepts.
const NON_TEXT_PAIRS: readonly Pair[] = [
  ['primary', 'background'],
  ['ring', 'background'],
  ['ring', 'card'],
  ['mutedForeground', 'background'],
  ['dish', 'dishSoft'],
];

const SCHEMES: readonly ColorScheme[] = ['light', 'dark'];

describe.each(SCHEMES)('%s theme contrast', (scheme) => {
  const colors = THEME[scheme];

  it.each(TEXT_PAIRS)(`%s on %s is at least ${BODY}:1`, (text, surface) => {
    expect(contrastRatio(colors[text], colors[surface])).toBeGreaterThanOrEqual(BODY);
  });

  it.each(NON_TEXT_PAIRS)(`%s against %s is at least ${LARGE_OR_NON_TEXT}:1`, (fg, bg) => {
    expect(contrastRatio(colors[fg], colors[bg])).toBeGreaterThanOrEqual(LARGE_OR_NON_TEXT);
  });
});
