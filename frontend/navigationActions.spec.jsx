import React from 'react';
import { render } from '@testing-library/react';

const ACTION = '@shopgate-project/yotpo-rewards/rewards';

let mockConfig;
const mockPush = jest.fn();
const mockRegisterNavigationAction = jest.fn();
const mockGetCurrentRoute = jest.fn();

jest.mock('./config.json', () => mockConfig, { virtual: true });
jest.mock('@shopgate/engage/navigation', () => ({
  registerNavigationAction: mockRegisterNavigationAction,
}));
jest.mock('@shopgate/engage/core/selectors', () => ({
  getCurrentRoute: mockGetCurrentRoute,
}));
jest.mock('@shopgate/engage/core/hooks', () => ({
  useAppSelector: selector => selector({}),
  useNavigation: () => ({ push: mockPush }),
}));

/**
 * Loads the extension with the given config and registers its navigation actions.
 * @param {Object} config The extension config.
 * @returns {Promise<Object>} The registration, and the hook rendered by `resolve`.
 */
const register = async (config) => {
  jest.resetModules();
  jest.doMock('react', () => React);
  mockRegisterNavigationAction.mockClear();
  mockConfig = config;

  const { icons } = await import('./icons');
  const { registerNavigationActions } = await import('./navigationActions');
  registerNavigationActions();
  const [[action, useAction, meta]] = mockRegisterNavigationAction.mock.calls;

  /**
   * Renders the hook of the registered action and returns what it resolved.
   * @param {Object|null} [route] The current route.
   * @returns {Object} The resolved action.
   */
  const resolve = (route = { pattern: '/' }) => {
    mockGetCurrentRoute.mockReturnValue(route);
    let result;

    /**
     * Calls the hook of the action.
     * @returns {null}
     */
    const Consumer = () => {
      result = useAction({
        action: ACTION,
        icon: '',
        link: '',
      });
      return null;
    };

    render(<Consumer />);

    return result;
  };

  return {
    action,
    icons,
    meta,
    resolve,
  };
};

describe('navigation actions', () => {
  describe('with a merchant text', () => {
    let registration;

    beforeAll(async () => {
      registration = await register({ tabBarIconLabel: ' Meine Prämien ' });
    });

    it('registers the rewards action with the trimmed merchant text as tab label and admin labels', () => {
      expect(registration.action).toBe(ACTION);
      expect(registration.meta).toEqual({
        tabBar: {
          label: 'Meine Prämien',
          icon: ACTION,
          adminLabel: {
            'en-us': 'Rewards',
            'de-de': 'Prämien',
          },
        },
      });
    });

    it('uses the registered rewards icon for the tab', () => {
      expect(registration.icons[registration.meta.tabBar.icon]).toMatch(/^<svg [^>]*viewBox="0 0 24 24"/);
    });

    it('resolves an available action with the merchant text and the tab icon', () => {
      expect(registration.resolve()).toMatchObject({
        available: true,
        icon: ACTION,
        label: 'Meine Prämien',
      });
    });

    it('opens the rewards page', () => {
      registration.resolve().onClick();

      expect(mockPush).toHaveBeenCalledWith({ pathname: '/yotpo-rewards' });
    });

    it('is active only on the rewards page', () => {
      expect(registration.resolve({ pattern: '/yotpo-rewards' }).isActive).toBe(true);
      expect(registration.resolve({ pattern: '/cart' }).isActive).toBe(false);
      expect(registration.resolve(null).isActive).toBe(false);
    });
  });

  describe.each([undefined, null, '', '   '])('without a merchant text (%p)', (tabBarIconLabel) => {
    let registration;

    beforeAll(async () => {
      registration = await register({ tabBarIconLabel });
    });

    it('registers an empty tab label, so that the app falls back to the admin labels', () => {
      expect(registration.meta.tabBar.label).toBe('');
    });

    it('resolves an empty label, so that the header button falls back to the admin labels', () => {
      expect(registration.resolve().label).toBe('');
    });
  });
});
