import React, { memo, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@shopgate/engage/styles';
import { getUserData } from '@shopgate/engage/user';
import { usePatchWindowScrollTo } from '../../hooks';
// eslint-disable-next-line import/extensions
import { rewardsPageInstanceId } from '../../config.json';

const useStyles = makeStyles()({
  root: {
    '& *:focus': {
      boxShadow: 'none !important',
    },
    '& .yotpo-widget-campaign-widget-close-button': {
      color: '#fff',
    },
    '& .yotpo-loyalty-popup-overlay .yotpo-close-button svg': {
      color: '#392000 !important',
    },
    '& .yotpo-is-mobile': {
      '&.yotpo-container-action-tile, &.yotpo-message-tile:not(.yotpo-message-already-completed), &.yotpo-overlay-tile': {
        top: 'var(--app-bar-height) !important',
        height: 'calc(100% - var(--app-bar-height) - var(--footer-height)) !important',
      },
    },
    '& .yotpo-loyalty-popup-overlay': {
      top: 'var(--app-bar-height) !important',
      height: 'calc(100% - var(--app-bar-height) - var(--footer-height)) !important',
    },
    '& .yotpo-is-mobile.yotpo-message-tile.yotpo-message-already-completed': {
      bottom: 'calc(var(--footer-height) + 16px) !important',
    },
    '& .yotpo-vip-tier-icon': {
      display: 'initial',
    },
    // Hide tiles that open login/registration since such links will break the app
    '& .yotpo-logged-out-tile': {
      display: 'none !important',
    },
    '& .hidden-element:has(+ .yotpo-logged-out-tile)': {
      visibility: 'visible !important',
    },
  },
});

/**
 * The RewardsWidget component.
 * @returns {JSX.Element}
 */
const RewardsWidget = () => {
  const { classes } = useStyles();
  const containerRef = useRef(null);

  const userData = useSelector(getUserData) || {};

  const {
    id: userId,
    mail: userMail,
    yotpoToken: token,
  } = userData;

  usePatchWindowScrollTo(containerRef);

  useEffect(() => {
    if (window.yotpoWidgetsContainer) {
      window.yotpoWidgetsContainer.initWidgets();
    }
  }, []);

  return (
    <div className={classes.root} ref={containerRef}>
      <div
        id="swell-customer-identification"
        data-authenticated="true"
        data-email={userMail}
        data-id={userId}
        data-token={token}
        style={{ display: 'none' }}
      />
      <div className="yotpo-widget-instance" data-yotpo-instance-id={rewardsPageInstanceId} />
    </div>
  );
};

export default memo(RewardsWidget);
