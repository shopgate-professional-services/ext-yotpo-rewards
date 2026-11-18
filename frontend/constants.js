import config from './config.json';

const EXTENSION_NAME = '@shopgate-project/yotpo-rewards';

export const REWARDS_ROUTE_PATTERN = '/yotpo-rewards';

export const YOTPO_REWARDS_ACTION = `${EXTENSION_NAME}/rewards`;
export const YOTPO_REWARDS_ICON = `${EXTENSION_NAME}/rewards`;
export const YOTPO_REWARDS_TEXT = config.tabBarIconLabel?.trim() || '';
