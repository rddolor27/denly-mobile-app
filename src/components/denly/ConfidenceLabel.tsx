import { Ban, CircleCheck, CircleQuestionMark, Contrast, type LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

/** Confidence bands from the ui-ux skill, plus "couldn't identify" for unknown items. */
export type ConfidenceBand = 'detected' | 'likely' | 'uncertain' | 'unknown';

type BandStyle = { word: string; icon: LucideIcon; text: string; pill: string };

/** Word + icon for every band; colour only reinforces (never the only signal). */
export const CONFIDENCE_BANDS: Readonly<Record<ConfidenceBand, BandStyle>> = {
  detected: { word: 'Detected', icon: CircleCheck, text: 'text-detected', pill: 'bg-detected-soft' },
  likely: { word: 'Likely', icon: Contrast, text: 'text-likely', pill: 'bg-muted' },
  uncertain: { word: 'Uncertain', icon: CircleQuestionMark, text: 'text-muted-foreground', pill: 'bg-muted' },
  unknown: { word: "Couldn't identify", icon: Ban, text: 'text-muted-foreground', pill: 'bg-muted' },
};

export type ConfidenceLabelProps = {
  band: ConfidenceBand;
  /**
   * `inline`: icon + word (rows). `pill`: rounded chip ("Detected in this scan" on the
   * ingredient detail). `header`: group heading over a results list, with an optional count.
   */
  variant?: 'inline' | 'pill' | 'header';
  /** Text after the word, e.g. "in this scan". */
  suffix?: string;
  /** Item count shown on the right of a `header`. */
  count?: number;
  className?: string;
};

/** The band icon (hidden from screen readers: the word is read). */
function BandIcon({ band }: { band: ConfidenceBand }) {
  const style = CONFIDENCE_BANDS[band];
  return (
    <View
      testID={`confidence-icon-${band}`}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Icon as={style.icon} size={18} className={style.text} />
    </View>
  );
}

/** The confidence word with its icon, in the band colour. */
export function ConfidenceLabel({ band, variant = 'inline', suffix, count, className }: ConfidenceLabelProps) {
  const style = CONFIDENCE_BANDS[band];
  const label = suffix ? `${style.word} ${suffix}` : style.word;

  if (variant === 'header') {
    return (
      <View
        className={cn('flex-row items-center gap-2 px-1', className)}
        accessible
        role="heading"
        accessibilityLabel={count === undefined ? label : `${label}, ${count}`}
      >
        <BandIcon band={band} />
        <Text className={cn('flex-1 text-subhead font-semibold', style.text)}>{label}</Text>
        {count === undefined ? null : <Text className="text-subhead text-muted-foreground">{count}</Text>}
      </View>
    );
  }

  return (
    <View
      className={cn(
        'flex-row items-center gap-1.5 self-start',
        variant === 'pill' && cn('rounded-full px-2.5 py-[5px]', style.pill),
        className,
      )}
      accessible
      accessibilityLabel={label}
    >
      <BandIcon band={band} />
      <Text className={cn('text-subhead font-semibold', style.text)}>{label}</Text>
    </View>
  );
}
