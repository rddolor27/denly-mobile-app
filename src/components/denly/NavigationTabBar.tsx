import type { BottomTabBarProps } from 'expo-router/js-tabs';

import { isTabKey, TabBar, type TabKey } from './TabBar';

type Props = BottomTabBarProps & { onScanPress: () => void };

/** Connects `TabBar` to the Expo Router tab navigator (`tabBar` prop of `(tabs)/_layout`). */
export function NavigationTabBar({ state, navigation, onScanPress }: Props) {
  const focused = state.routes[state.index]?.name ?? 'index';
  const activeTab: TabKey = isTabKey(focused) ? focused : 'index';

  function onTabPress(tab: TabKey): void {
    const route = state.routes.find((r) => r.name === tab);
    if (!route) return;
    const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
    if (tab !== activeTab && !event.defaultPrevented) navigation.navigate(route.name, route.params);
  }

  return <TabBar activeTab={activeTab} onTabPress={onTabPress} onScanPress={onScanPress} />;
}
