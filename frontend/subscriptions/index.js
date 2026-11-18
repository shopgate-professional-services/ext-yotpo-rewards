import { appWillInit$, appWillStart$ } from '@shopgate/engage/core/streams';
import { authRoutes } from '@shopgate/engage/core/collections';
import { LOGIN_PATH } from '@shopgate/engage/core/constants';
import { registerIcons } from '@shopgate/engage/icons';
import { REWARDS_ROUTE_PATTERN } from '../constants';
import { icons } from '../icons';
import { registerNavigationActions } from '../navigationActions';

export default (subscribe) => {
  subscribe(appWillInit$, () => {
    authRoutes.set(REWARDS_ROUTE_PATTERN, LOGIN_PATH);
  });

  subscribe(appWillStart$, () => {
    registerIcons(icons);
    registerNavigationActions();
  });
};
