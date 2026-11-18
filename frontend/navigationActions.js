import { useCallback } from 'react';
import { useAppSelector, useNavigation } from '@shopgate/engage/core/hooks';
import { getCurrentRoute } from '@shopgate/engage/core/selectors';
import { registerNavigationAction } from '@shopgate/engage/navigation';
import {
  REWARDS_ROUTE_PATTERN,
  YOTPO_REWARDS_ACTION,
  YOTPO_REWARDS_ICON,
  YOTPO_REWARDS_TEXT,
} from './constants';

/**
 * Resolves the Yotpo rewards action: opens the rewards page and is active there.
 * @returns {Object} The resolved action.
 */
const useYotpoRewardsAction = () => {
  const { push } = useNavigation();

  return {
    available: true,
    icon: YOTPO_REWARDS_ICON,
    label: YOTPO_REWARDS_TEXT,
    onClick: useCallback(() => push({ pathname: REWARDS_ROUTE_PATTERN }), [push]),
    isActive: useAppSelector(state => getCurrentRoute(state)?.pattern === REWARDS_ROUTE_PATTERN),
  };
};

/**
 * Registers the Yotpo rewards action, which merchants can add to the tab bar.
 */
export const registerNavigationActions = () => {
  registerNavigationAction(YOTPO_REWARDS_ACTION, useYotpoRewardsAction, {
    tabBar: {
      label: YOTPO_REWARDS_TEXT,
      icon: YOTPO_REWARDS_ICON,
      adminLabel: {
        'en-us': 'Rewards',
        'de-de': 'Prämien',
      },
    },
  });
};
