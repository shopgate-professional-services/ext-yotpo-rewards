import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getCurrentRoute } from '@shopgate/engage/core/selectors';
import { makeStyles } from '@shopgate/engage/styles';
import { TabBarIcon } from '../../components';
import { REWARDS_ROUTE_PATTERN } from '../../constants';
// eslint-disable-next-line import/extensions
import { hideTabBarIcon, tabBarIconLabel } from '../../config.json';

const useStyles = makeStyles()({
  icon: {
    height: 24,
    width: 24,
  },
});

/**
 * @returns {JSX.Element}
 */
const TabBarItem = ({
  TabBarAction,
  tabIndex,
  historyPush,
  'aria-hidden': ariaHidden,
}) => {
  const { classes } = useStyles();

  const { pattern } = useSelector(getCurrentRoute) || {};

  const handleClick = useCallback((e) => {
    e.preventDefault();
    historyPush({ pathname: REWARDS_ROUTE_PATTERN });
  }, [historyPush]);

  if (hideTabBarIcon) {
    return null;
  }

  return (
    <TabBarAction
      icon={<TabBarIcon className={classes.icon} />}
      label={tabBarIconLabel}
      onClick={handleClick}
      aria-hidden={ariaHidden}
      tabIndex={tabIndex}
      isHighlighted={pattern === REWARDS_ROUTE_PATTERN}
    />
  );
};

TabBarItem.propTypes = {
  historyPush: PropTypes.func.isRequired,
  TabBarAction: PropTypes.func.isRequired,
  'aria-hidden': PropTypes.bool,
  tabIndex: PropTypes.number,
};
TabBarItem.defaultProps = {
  'aria-hidden': null,
  tabIndex: null,
};

export default memo(TabBarItem);
