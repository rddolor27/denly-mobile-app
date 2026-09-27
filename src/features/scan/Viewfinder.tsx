import { useEffect, useState } from 'react';
import { Animated, View, type ViewStyle } from 'react-native';

import { Text } from '@/components/ui/text';
import type { IngredientId, NameLanguage } from '@/features/demo/demo-data';
import { ingredientName } from '@/features/demo/demo-state';
import { cn } from '@/lib/utils';

/**
 * SIMULATED viewfinder (frontend-only demo). The real preview is react-native-vision-camera with
 * an overlay drawn from normalised boxes (ADR 0004); this stands in until the detector exists.
 * Produce colours are presentation-only hex, fixed in both modes like the camera surface.
 */
const SHAPES: readonly ViewStyle[] = [
  { left: '16%', top: '25%', width: '38%', height: '5.2%', backgroundColor: '#3F5A2E', transform: [{ rotate: '-14deg' }] },
  { left: '19%', top: '29%', width: '36%', height: '4.8%', backgroundColor: '#4A6A35', transform: [{ rotate: '8deg' }] },
  { left: '15%', top: '33%', width: '33%', height: '4%', backgroundColor: '#3A5329', transform: [{ rotate: '-4deg' }] },
  { left: '67%', top: '31%', width: '18%', height: '8.3%', backgroundColor: '#8A3A2C' },
  { left: '22%', top: '49%', width: '18.5%', height: '9%', backgroundColor: '#A58D63' },
  {
    left: '53%',
    top: '53.5%',
    width: '31%',
    height: '1.9%',
    borderRadius: 10,
    backgroundColor: '#5E7A33',
    transform: [{ rotate: '-9deg' }],
  },
];

type Detection = {
  ingredientId: IngredientId;
  box: ViewStyle;
  label: ViewStyle;
  uncertain?: boolean;
};

export const LIVE_DETECTIONS: readonly Detection[] = [
  {
    ingredientId: 'kangkong',
    box: { left: '12.8%', top: '23.2%', width: '46%', height: '15.6%' },
    label: { left: '12.8%', top: '19.4%' },
  },
  {
    ingredientId: 'tomato',
    box: { left: '64.6%', top: '29.9%', width: '23%', height: '10.7%' },
    label: { left: '64.6%', top: '26.1%' },
  },
  {
    ingredientId: 'onion',
    box: { left: '19%', top: '47.6%', width: '24.6%', height: '11.4%' },
    label: { left: '19%', top: '60%' },
  },
  {
    ingredientId: 'chili',
    box: { left: '50.2%', top: '50.2%', width: '37%', height: '7.3%' },
    label: { left: '50.2%', top: '58.5%' },
    uncertain: true,
  },
];

const CORNERS: readonly { style: ViewStyle; className: string }[] = [
  { style: { left: '7%', top: '15.6%' }, className: 'border-r-0 border-b-0 rounded-tl-lg' },
  { style: { right: '7%', top: '15.6%' }, className: 'border-l-0 border-b-0 rounded-tr-lg' },
  { style: { left: '7%', top: '68.5%' }, className: 'border-r-0 border-t-0 rounded-bl-lg' },
  { style: { right: '7%', top: '68.5%' }, className: 'border-l-0 border-t-0 rounded-br-lg' },
];

type Props = {
  language: NameLanguage;
  showDetections: boolean;
  reduceMotion: boolean;
  torch: boolean;
};

/** Decorative for screen readers: the "N items in view" pill speaks instead. */
export function Viewfinder({ language, showDetections, reduceMotion, torch }: Props) {
  const [opacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!showDetections) {
      opacity.setValue(0);
      return;
    }
    if (reduceMotion) {
      opacity.setValue(1);
      return;
    }
    const animation = Animated.timing(opacity, { toValue: 1, duration: 350, useNativeDriver: true });
    animation.start();
    return () => animation.stop();
  }, [showDetections, reduceMotion, opacity]);

  return (
    <View
      className="absolute inset-0"
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {/* Counter surface in the lower part of the frame. */}
      <View className="absolute bottom-0 left-0 right-0 top-[62%] bg-camera-foreground/5" />
      {SHAPES.map((shape, index) => (
        <View key={index} className="absolute rounded-full" style={shape} />
      ))}
      {torch ? (
        <View className="absolute left-[-20%] top-[10%] aspect-square w-[140%] rounded-full bg-camera-foreground/10" />
      ) : null}
      {CORNERS.map((corner, index) => (
        <View
          key={index}
          className={cn('absolute size-7 border-[3px] border-camera-foreground/90', corner.className)}
          style={corner.style}
        />
      ))}
      {showDetections ? (
        <Animated.View className="absolute inset-0" style={{ opacity }} testID="live-detections">
          {LIVE_DETECTIONS.map((detection) => (
            <View key={detection.ingredientId} className="absolute inset-0">
              <View
                className={cn(
                  'absolute rounded-lg border-2',
                  detection.uncertain ? 'border-dashed border-camera-foreground/75' : 'border-camera-foreground',
                )}
                style={detection.box}
              />
              <View className="absolute rounded-sm bg-camera/80 px-2.5 py-[5px]" style={detection.label}>
                <Text
                  className={cn(
                    'text-subhead font-semibold',
                    detection.uncertain ? 'text-camera-foreground/90' : 'text-camera-foreground',
                  )}
                  numberOfLines={1}
                >
                  {ingredientName(detection.ingredientId, language)}
                  {detection.uncertain ? '?' : ''}
                </Text>
              </View>
            </View>
          ))}
        </Animated.View>
      ) : null}
    </View>
  );
}
