import { appWillInit$, appWillStart$ } from '@shopgate/engage/core/streams';
import { authRoutes } from '@shopgate/engage/core/collections';
import { registerIcons } from '@shopgate/engage/icons';
import { icons } from '../icons';
import { registerNavigationActions } from '../navigationActions';
import subscriptions from './index';

jest.mock('../config.json', () => ({}), { virtual: true });
jest.mock('@shopgate/engage/core/streams', () => ({
  appWillInit$: 'appWillInit$',
  appWillStart$: 'appWillStart$',
}));
jest.mock('@shopgate/engage/core/collections', () => ({ authRoutes: { set: jest.fn() } }));
jest.mock('@shopgate/engage/core/constants', () => ({ LOGIN_PATH: '/login' }));
jest.mock('@shopgate/engage/icons', () => ({ registerIcons: jest.fn() }));
jest.mock('../navigationActions', () => ({ registerNavigationActions: jest.fn() }));

/**
 * Subscribes the extension and runs the callback of the given stream.
 * @param {string} stream The stream.
 */
const runSubscription = (stream) => {
  const subscribe = jest.fn();
  subscriptions(subscribe);
  const [, callback] = subscribe.mock.calls.find(([subscribed]) => subscribed === stream);

  callback();
};

describe('subscriptions', () => {
  it('protects the rewards page with the login', () => {
    runSubscription(appWillInit$);

    expect(authRoutes.set).toHaveBeenCalledWith('/yotpo-rewards', '/login');
  });

  it('registers the icon and the navigation action before the app renders', () => {
    runSubscription(appWillStart$);

    expect(registerIcons).toHaveBeenCalledWith(icons);
    expect(registerNavigationActions).toHaveBeenCalledTimes(1);
  });
});
