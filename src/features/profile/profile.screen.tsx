import { router } from 'expo-router';
import { Lock } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { ListGroup, ListRow } from '@/components/denly/ListGroup';
import { Screen } from '@/components/denly/Screen';
import { LargeTitle } from '@/components/denly/ScreenHeader';
import { SectionHeader } from '@/components/denly/SectionHeader';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { NAME_LANGUAGES, TIERS, type NameLanguage } from '@/features/demo/demo-data';
import { useDemo } from '@/features/demo/demo-provider';
import { ingredientName, initials } from '@/features/demo/demo-state';
import { Toast } from '@/features/toast/Toast';
import { useToast } from '@/features/toast/use-toast';
import type { AppearancePreference } from '@/lib/appearance';
import { useAppearance } from '@/lib/use-appearance';

import { DeleteAccountDialog } from './DeleteAccountDialog';
import { DemoControls } from './DemoControls';
import { SettingSegment, type SettingOption } from './SettingSegment';

const APPEARANCE_OPTIONS: readonly SettingOption<AppearancePreference>[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

const LANGUAGE_OPTIONS: readonly SettingOption<NameLanguage>[] = NAME_LANGUAGES.map((l) => ({
  value: l.id,
  label: l.label,
}));

/** "Kangkong, bawang, sibuyas" in the chosen language. */
function exampleNames(language: NameLanguage): string {
  const [first, ...rest] = (['kangkong', 'garlic', 'onion'] as const).map((id) => ingredientName(id, language));
  return [first, ...rest.map((name) => name.toLowerCase())].join(', ');
}

/** Profile (prototype `profile`): account, preferences, privacy, and the demo controls. */
export function ProfileScreen() {
  const demo = useDemo();
  const { preference, setPreference } = useAppearance();
  const toast = useToast();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const user = demo.session?.kind === 'user' ? demo.session : null;

  return (
    <Screen footer={<Toast message={toast.message} />}>
      <LargeTitle>Profile</LargeTitle>

      {user ? (
        <View className="flex-row items-center gap-3.5 rounded-lg bg-card p-4">
          <Avatar alt={user.name}>
            <AvatarFallback>
              <Text className="text-[24px]">{initials(user.name)}</Text>
            </AvatarFallback>
          </Avatar>
          <View className="min-w-0 flex-1 gap-0.5">
            <Text className="text-[19px] font-semibold">{user.name}</Text>
            <Text variant="subhead" numberOfLines={1}>
              {user.email}
            </Text>
          </View>
        </View>
      ) : (
        <View className="gap-3 rounded-lg bg-card p-4">
          <View className="gap-1">
            <Text variant="headline" role="heading">
              You&apos;re using Denly without an account
            </Text>
            <Text variant="subhead">
              Your history stays on this phone. Create an account to keep scans and saved dishes on every device.
            </Text>
          </View>
          <Button onPress={() => router.push('/(auth)/register')}>
            <Text>Create account</Text>
          </Button>
          <Button variant="link" className="self-center" onPress={() => router.push('/(auth)/login')}>
            <Text>Log in</Text>
          </Button>
        </View>
      )}

      <View className="gap-2">
        <SectionHeader title="Preferences" variant="small" />
        <View className="gap-4 rounded-lg bg-card p-4">
          <SettingSegment
            label="Appearance"
            description="System follows your phone's setting."
            options={APPEARANCE_OPTIONS}
            value={preference}
            onChange={setPreference}
          />
          <Separator />
          <View className="gap-2">
            <SettingSegment
              label="Ingredient names"
              description="Shown first on results and in your history."
              options={LANGUAGE_OPTIONS}
              value={demo.nameLanguage}
              onChange={demo.setNameLanguage}
            />
            <Text variant="footnote">{`Example: ${exampleNames(demo.nameLanguage)}`}</Text>
          </View>
        </View>
        <ListGroup>
          <ListRow
            title="Offline data"
            plainTitle
            value={demo.pack === 'none' ? 'Not downloaded' : TIERS[demo.pack].label}
            onPress={() => router.push('/settings/offline-data')}
          />
        </ListGroup>
      </View>

      {user ? (
        <View className="gap-2">
          <SectionHeader title="Account" variant="small" />
          <ListGroup>
            <ListRow
              title="Change password"
              plainTitle
              onPress={() => toast.show(`A password change link was sent to ${user.email}.`)}
            />
            <ListRow
              title="Log out"
              plainTitle
              tone="primary"
              showChevron={false}
              onPress={() => {
                demo.signOut();
                toast.show('Logged out. Scans on this phone stay here.');
              }}
            />
            <ListRow
              title="Delete account"
              plainTitle
              tone="destructive"
              showChevron={false}
              onPress={() => setConfirmDelete(true)}
            />
          </ListGroup>
        </View>
      ) : null}

      <View className="gap-2">
        <SectionHeader title="Privacy" variant="small" />
        <View className="flex-row gap-3 rounded-lg bg-card p-4">
          <Icon as={Lock} size={18} className="mt-0.5 text-muted-foreground" />
          <Text className="flex-1 text-subhead">
            {user
              ? 'Photos never leave your phone. Denly stores the ingredient names from your scans so your history syncs.'
              : 'Photos never leave your phone. Without an account, nothing about your scans is stored by Denly.'}
          </Text>
        </View>
      </View>

      <DemoControls />

      <Text variant="footnote" className="text-center">
        Denly 0.1.0 prototype
      </Text>

      <DeleteAccountDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        onConfirm={() => {
          setConfirmDelete(false);
          demo.deleteAccount();
          router.replace('/(auth)/welcome');
        }}
      />
    </Screen>
  );
}
