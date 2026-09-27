import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { EmptyState } from '@/components/denly/EmptyState';
import { HeroCounterCard } from '@/components/denly/HeroCounterCard';
import { ListGroup } from '@/components/denly/ListGroup';
import { Screen } from '@/components/denly/Screen';
import { SectionHeader } from '@/components/denly/SectionHeader';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useDemo } from '@/features/demo/demo-provider';
import { greeting, initials } from '@/features/demo/demo-state';
import { HistoryScanRow } from '@/features/history/HistoryScanRow';
import { SavedDishRow } from '@/features/saved/SavedDishRow';
import { Toast } from '@/features/toast/Toast';
import { useToast } from '@/features/toast/use-toast';

import { HomeOfflineStatus } from './HomeOfflineStatus';

/** Home (prototype `home`): greeting, the counter card, offline status, recent scans, saved dishes. */
export function HomeScreen() {
  const { session, history, savedDishIds } = useDemo();
  const toast = useToast();
  const user = session?.kind === 'user' ? session : null;
  const recent = history.slice(0, 2);
  const savedDishes = savedDishIds.slice(0, 2);

  return (
    <Screen footer={<Toast message={toast.message} />}>
      <View className="min-h-11 flex-row items-center justify-between gap-3 pt-2">
        <View className="min-w-0 flex-1 gap-0.5">
          <Text variant="subhead">{`${greeting(new Date())}${user ? ',' : ''}`}</Text>
          <Text variant="title1" numberOfLines={1}>
            {user ? (user.name.split(/\s+/)[0] ?? user.name) : 'Welcome to Denly'}
          </Text>
        </View>
        {user ? (
          <Pressable
            className="size-11 items-center justify-center rounded-full active:opacity-70"
            onPress={() => router.navigate('/profile')}
            accessibilityRole="button"
            accessibilityLabel="Profile"
          >
            <Avatar alt={user.name} className="size-10">
              <AvatarFallback>
                <Text className="text-[15px]">{initials(user.name)}</Text>
              </AvatarFallback>
            </Avatar>
          </Pressable>
        ) : (
          <Button variant="secondary" size="sm" onPress={() => router.push('/(auth)/login')}>
            <Text>Log in</Text>
          </Button>
        )}
      </View>

      <HeroCounterCard onScan={() => router.push('/scan/camera')} />

      <HomeOfflineStatus />

      <View className="gap-2">
        <SectionHeader title="Recent scans" actionLabel="See all" onAction={() => router.navigate('/history')} />
        {recent.length > 0 ? (
          <ListGroup accessibilityLabel="Recent scans">
            {recent.map((scan) => (
              <HistoryScanRow key={scan.id} scan={scan} from="home" />
            ))}
          </ListGroup>
        ) : (
          <EmptyState title="No scans yet." body="Scan what's on your counter to start your history." />
        )}
      </View>

      <View className="gap-2">
        <SectionHeader
          title="Saved dishes"
          actionLabel="See all"
          onAction={() => router.navigate({ pathname: '/saved', params: { tab: 'dishes' } })}
        />
        {savedDishes.length > 0 ? (
          <ListGroup accessibilityLabel="Saved dishes">
            {savedDishes.map((dishId) => (
              <SavedDishRow key={dishId} dishId={dishId} onMessage={toast.show} />
            ))}
          </ListGroup>
        ) : (
          <View className="rounded-lg border border-dashed border-border p-4">
            <Text variant="subhead">Dishes you save from a scan show up here.</Text>
          </View>
        )}
      </View>

      {user ? null : (
        <View className="gap-3 rounded-lg bg-card p-4">
          <View className="gap-1">
            <Text variant="headline" role="heading">
              Keep your scans on every device
            </Text>
            <Text variant="subhead">Right now your history stays on this phone.</Text>
          </View>
          <Button onPress={() => router.push('/(auth)/register')}>
            <Text>Create account</Text>
          </Button>
        </View>
      )}
    </Screen>
  );
}
