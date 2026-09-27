import * as AlertDialogPrimitive from '@rn-primitives/alert-dialog';
import * as React from 'react';
import { Platform, Pressable, View, type ViewProps } from 'react-native';
import Animated, { FadeIn, FadeOut, ReduceMotion, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { FullWindowOverlay as RNFullWindowOverlay } from 'react-native-screens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { buttonTextVariants, buttonVariants, type ButtonVariantProps } from '@/components/ui/button';
import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';

/**
 * React Native Reusables `AlertDialog`, restyled as Denly's confirmation sheet (Delete account):
 * anchored to the bottom, 16pt top corners, grabber, stacked full-width buttons (the action
 * first, Cancel under it). Motion is a short fade/slide that Reduce Motion turns off. Content
 * renders in the root `PortalHost`.
 */
const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
const AlertDialogPortal = AlertDialogPrimitive.Portal;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const FullWindowOverlay = Platform.OS === 'ios' ? RNFullWindowOverlay : React.Fragment;

function AlertDialogOverlay({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof AlertDialogPrimitive.Overlay>, 'asChild'> & {
  children?: React.ReactNode;
}) {
  return (
    <FullWindowOverlay>
      <AlertDialogPrimitive.Overlay
        className={cn('absolute bottom-0 left-0 right-0 top-0 z-50 justify-end bg-black/45', className)}
        {...props}
        asChild
      >
        <AnimatedPressable
          entering={FadeIn.duration(200).reduceMotion(ReduceMotion.System)}
          exiting={FadeOut.duration(150).reduceMotion(ReduceMotion.System)}
        >
          {children}
        </AnimatedPressable>
      </AlertDialogPrimitive.Overlay>
    </FullWindowOverlay>
  );
}

function AlertDialogContent({
  className,
  portalHost,
  children,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content> & {
  portalHost?: string;
}) {
  const insets = useSafeAreaInsets();
  return (
    <AlertDialogPortal {...(portalHost ? { hostName: portalHost } : {})}>
      <AlertDialogOverlay>
        <Animated.View
          entering={SlideInDown.duration(250).reduceMotion(ReduceMotion.System)}
          exiting={SlideOutDown.duration(200).reduceMotion(ReduceMotion.System)}
        >
          <AlertDialogPrimitive.Content
            className={cn('w-full gap-3.5 rounded-t-sheet bg-background px-4 pt-2.5', className)}
            style={{ paddingBottom: Math.max(insets.bottom, 16) + 16 }}
            {...props}
          >
            <View
              className="h-[5px] w-9 self-center rounded-full bg-border"
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            />
            {children}
          </AlertDialogPrimitive.Content>
        </Animated.View>
      </AlertDialogOverlay>
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({ className, ...props }: ViewProps) {
  return <View className={cn('gap-2', className)} {...props} />;
}

function AlertDialogFooter({ className, ...props }: ViewProps) {
  return <View className={cn('gap-2.5 pt-1', className)} {...props} />;
}

function AlertDialogTitle({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      className={cn('font-display text-title-2 text-foreground', className)}
      {...props}
    />
  );
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      className={cn('text-subhead text-muted-foreground', className)}
      {...props}
    />
  );
}

type ActionProps = React.ComponentProps<typeof AlertDialogPrimitive.Action> & {
  variant?: ButtonVariantProps['variant'];
};

function AlertDialogAction({ className, variant = 'default', ...props }: ActionProps) {
  return (
    <TextClassContext.Provider value={buttonTextVariants({ variant })}>
      <AlertDialogPrimitive.Action className={cn(buttonVariants({ variant }), className)} {...props} />
    </TextClassContext.Provider>
  );
}

function AlertDialogCancel({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  return (
    <TextClassContext.Provider value={buttonTextVariants({ variant: 'outline' })}>
      <AlertDialogPrimitive.Cancel
        className={cn(buttonVariants({ variant: 'outline' }), className)}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};
