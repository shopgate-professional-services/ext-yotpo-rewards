import { appWillInit$ } from '@shopgate/engage/core/streams';
import { authRoutes } from '@shopgate/engage/core/collections';
import { LOGIN_PATH } from '@shopgate/engage/core/constants';
import { REWARDS_ROUTE_PATTERN } from '../constants';

export default (subscribe) => {
  subscribe(appWillInit$, () => {
    authRoutes.set(REWARDS_ROUTE_PATTERN, LOGIN_PATH);
  });
};
