/**
 * Example content for the frontend-only app: nothing here comes from the backend or the
 * ingredient data contract. Replace with TanStack Query hooks and the offline pack when those
 * exist; screens read it only through `useDemo()` so the swap stays in one place.
 */

export type NameLanguage = 'tl' | 'en' | 'ceb';

export const NAME_LANGUAGES: readonly { id: NameLanguage; label: string }[] = [
  { id: 'tl', label: 'Filipino' },
  { id: 'en', label: 'English' },
  { id: 'ceb', label: 'Bisaya' },
];

export type IngredientCategory = 'Leafy green' | 'Vegetable' | 'Aromatic' | 'Fish' | 'Citrus';

export type IngredientId =
  | 'kangkong'
  | 'tomato'
  | 'onion'
  | 'garlic'
  | 'chili'
  | 'bangus'
  | 'calamansi'
  | 'ampalaya'
  | 'eggplant'
  | 'sitaw';

export type DemoIngredient = {
  id: IngredientId;
  names: Readonly<Record<NameLanguage, string>>;
  /** Two letters on the produce tile. */
  abbreviation: string;
  /** Produce tile colour: presentation only, white text on it. */
  tileColor: string;
  category: IngredientCategory;
  /** "Cooked in" line on the ingredient detail. */
  cookedIn: string;
  tip: string;
};

export const INGREDIENTS: Readonly<Record<IngredientId, DemoIngredient>> = {
  kangkong: {
    id: 'kangkong',
    names: { tl: 'Kangkong', en: 'Water spinach', ceb: 'Tangkong' },
    abbreviation: 'Ka',
    tileColor: '#3F6B2E',
    category: 'Leafy green',
    cookedIn: 'Sinigang, adobong kangkong, ginisang kangkong',
    tip: 'Cook the stems a minute or two before the leaves. They take longer to soften.',
  },
  tomato: {
    id: 'tomato',
    names: { tl: 'Kamatis', en: 'Tomato', ceb: 'Kamatis' },
    abbreviation: 'Km',
    tileColor: '#B23A2B',
    category: 'Vegetable',
    cookedIn: 'Sinigang, ginisa, ensaladang kamatis',
    tip: 'Ripe tomatoes add body and a gentle sourness to soups.',
  },
  onion: {
    id: 'onion',
    names: { tl: 'Sibuyas', en: 'Onion', ceb: 'Sibuyas' },
    abbreviation: 'Si',
    tileColor: '#8B3F66',
    category: 'Aromatic',
    cookedIn: 'Ginisa base, adobo, sinigang',
    tip: 'Small red sibuyas tagalog is sharper than white onion.',
  },
  garlic: {
    id: 'garlic',
    names: { tl: 'Bawang', en: 'Garlic', ceb: 'Ahos' },
    abbreviation: 'Ba',
    tileColor: '#6F6244',
    category: 'Aromatic',
    cookedIn: 'Sinangag, adobo, ginisa base',
    tip: 'Brown it slowly. Burnt garlic turns bitter.',
  },
  chili: {
    id: 'chili',
    names: { tl: 'Siling haba', en: 'Long chili', ceb: 'Sili espada' },
    abbreviation: 'Sh',
    tileColor: '#4E7A2A',
    category: 'Aromatic',
    cookedIn: 'Sinigang, paksiw, dinuguan',
    tip: 'Much milder than siling labuyo. Usually added whole to soups.',
  },
  bangus: {
    id: 'bangus',
    names: { tl: 'Bangus', en: 'Milkfish', ceb: 'Bangus' },
    abbreviation: 'Bg',
    tileColor: '#4D6A7D',
    category: 'Fish',
    cookedIn: 'Sinigang na bangus, paksiw, daing na bangus',
    tip: 'Ask the vendor to debone it. Bangus has many fine bones.',
  },
  calamansi: {
    id: 'calamansi',
    names: { tl: 'Kalamansi', en: 'Calamansi', ceb: 'Lemonsito' },
    abbreviation: 'Kl',
    tileColor: '#557F28',
    category: 'Citrus',
    cookedIn: 'Sawsawan, pancit, marinades',
    tip: 'Roll it on the counter before squeezing to get more juice.',
  },
  ampalaya: {
    id: 'ampalaya',
    names: { tl: 'Ampalaya', en: 'Bitter gourd', ceb: 'Paliya' },
    abbreviation: 'Am',
    tileColor: '#3A6B3E',
    category: 'Vegetable',
    cookedIn: 'Pinakbet, ginisang ampalaya',
    tip: 'Salt the slices and squeeze them to soften the bitterness.',
  },
  eggplant: {
    id: 'eggplant',
    names: { tl: 'Talong', en: 'Eggplant', ceb: 'Talong' },
    abbreviation: 'Ta',
    tileColor: '#5A3A6D',
    category: 'Vegetable',
    cookedIn: 'Pinakbet, tortang talong, ensaladang talong',
    tip: 'Grill it whole until the skin chars for tortang talong.',
  },
  sitaw: {
    id: 'sitaw',
    names: { tl: 'Sitaw', en: 'String beans', ceb: 'Batong' },
    abbreviation: 'St',
    tileColor: '#56792C',
    category: 'Vegetable',
    cookedIn: 'Pinakbet, ginataang sitaw, adobong sitaw',
    tip: 'Snap off the ends and cut into finger lengths.',
  },
};

export type DishId =
  | 'adobo_kangkong'
  | 'sinigang_baboy'
  | 'paksiw_bangus'
  | 'daing_bangus'
  | 'pinakbet'
  | 'ginisang_ampalaya';

export type DemoDish = {
  id: DishId;
  name: string;
  /** What the user still needs to add. */
  need: string;
};

export const DISHES: Readonly<Record<DishId, DemoDish>> = {
  adobo_kangkong: { id: 'adobo_kangkong', name: 'Adobong kangkong', need: 'Add soy sauce and vinegar' },
  sinigang_baboy: {
    id: 'sinigang_baboy',
    name: 'Sinigang na baboy',
    need: 'Add pork and a souring agent like tamarind',
  },
  paksiw_bangus: { id: 'paksiw_bangus', name: 'Paksiw na bangus', need: 'Add vinegar and ginger' },
  daing_bangus: { id: 'daing_bangus', name: 'Daing na bangus', need: 'Add vinegar, garlic and pepper' },
  pinakbet: { id: 'pinakbet', name: 'Pinakbet', need: 'Add squash, okra and bagoong' },
  ginisang_ampalaya: { id: 'ginisang_ampalaya', name: 'Ginisang ampalaya', need: 'Add egg and garlic' },
};

/** Confidence band words from the ui-ux skill; the UI always shows word + icon. */
export type ConfidenceBand = 'detected' | 'likely' | 'uncertain';

export type ScanItem = {
  ingredientId: IngredientId;
  band: ConfidenceBand;
};

export type DemoScan = {
  id: string;
  /** Display time, e.g. "Today, 7:42 AM" or "Just now". */
  when: string;
  /** History group heading. */
  day: string;
  /** Result computed on the phone from offline data (no AI summary). */
  offline: boolean;
  items: readonly ScanItem[];
  /** "Couldn't identify N items". */
  unknownCount: number;
  /** AI summary, or null when there is none. */
  summary: string | null;
  /** True when the AI step failed online ("Summary unavailable right now"). */
  summaryFailed: boolean;
  dishIds: readonly DishId[];
};

export const KITCHEN_SUMMARY =
  'This looks like the start of adobong kangkong or sinigang. Kangkong cooks in a few minutes. Tomato and onion add sweetness and body, and garlic is the usual base for the sauté.';

/** Standard demo scan: kangkong, tomato, onion, garlic, chili + one unknown. */
export function kitchenScan(id: string, when: string, offline: boolean): DemoScan {
  return {
    id,
    when,
    day: 'Today',
    offline,
    items: [
      { ingredientId: 'kangkong', band: 'detected' },
      { ingredientId: 'tomato', band: 'detected' },
      { ingredientId: 'onion', band: 'detected' },
      { ingredientId: 'garlic', band: 'likely' },
      { ingredientId: 'chili', band: 'uncertain' },
    ],
    unknownCount: 1,
    summary: KITCHEN_SUMMARY,
    summaryFailed: false,
    dishIds: ['adobo_kangkong', 'sinigang_baboy'],
  };
}

export const INITIAL_HISTORY: readonly DemoScan[] = [
  kitchenScan('s1', 'Today, 7:42 AM', false),
  {
    id: 's2',
    when: 'Yesterday, 6:10 PM',
    day: 'Yesterday',
    offline: true,
    items: [
      { ingredientId: 'bangus', band: 'detected' },
      { ingredientId: 'calamansi', band: 'detected' },
      { ingredientId: 'onion', band: 'detected' },
      { ingredientId: 'tomato', band: 'likely' },
    ],
    unknownCount: 0,
    summary: null,
    summaryFailed: false,
    dishIds: ['paksiw_bangus', 'daing_bangus'],
  },
  {
    id: 's3',
    when: 'Monday, 5:25 PM',
    day: 'Earlier this week',
    offline: false,
    items: [
      { ingredientId: 'ampalaya', band: 'detected' },
      { ingredientId: 'eggplant', band: 'detected' },
      { ingredientId: 'sitaw', band: 'detected' },
      { ingredientId: 'tomato', band: 'detected' },
    ],
    unknownCount: 0,
    summary:
      'These are the classic pinakbet vegetables. Add squash, okra and bagoong to complete it. Ampalaya brings the bitterness the dish is known for.',
    summaryFailed: false,
    dishIds: ['pinakbet', 'ginisang_ampalaya'],
  },
];

export type PackTier = 'small' | 'medium' | 'large';
export type OfflinePack = PackTier | 'none';

export type DemoTier = { id: PackTier; label: string; description: string };

export const TIERS: Readonly<Record<PackTier, DemoTier>> = {
  small: {
    id: 'small',
    label: 'Small',
    description: 'The essentials: every ingredient Denly can detect, with names and categories.',
  },
  medium: { id: 'medium', label: 'Medium', description: 'More detail and more dishes each ingredient is used in.' },
  large: { id: 'large', label: 'Large', description: 'Everything we have, the same data the online app uses.' },
};

export const PACK_TIERS: readonly PackTier[] = ['small', 'medium', 'large'];

/** Data release date shown on offline results and the ingredient detail footer. */
export const DATA_RELEASE_LABEL = '23 Sep 2026';

export const DEMO_USER = { name: 'Rica Dela Cruz', email: 'rica.delacruz@example.com' } as const;
