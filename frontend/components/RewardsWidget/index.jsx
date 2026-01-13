import React, { memo, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@shopgate/engage/styles';
import { getUserData } from '@shopgate/engage/user';
// eslint-disable-next-line import/extensions
import { rewardsPageInstanceId } from '../../config.json';

const useStyles = makeStyles()({
  root: {
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
    '& .yotpo-rewards-history *': {
      outline: 'none',
    },
  },
});

/**
 * Yotpo widgets might try to scroll to specific positions on the page. It uses window.scrollTo
 * for that. However, in PWA the scrollable container is not window, but a div scroll container.
 * This hook patches window.scrollTo to scroll the correct container.
 * @param {React.RefObject<HTMLElement>} containerRef Ref to the element that contains the
 * Yotpo widgets.
 */
function usePatchWindowScrollTo(containerRef) {
  useEffect(() => {
    if (!containerRef.current) return undefined;

    // Select the scrollable container
    const container = containerRef.current.closest('.engage__view__content');

    if (!container) return undefined;

    const original = window.scrollTo.bind(window);

    // Above the scroll container there might be other fixed elements (like app bar).
    // We need to take their height into account.
    const offsetTop = container.getBoundingClientRect().top;

    window.scrollTo = ((arg1, arg2) => {
      // Support both signatures: scrollTo(x, y) and scrollTo({top,left,...})
      let top = 0;
      let left = 0;

      if (typeof arg1 === 'object' && arg1) {
        top = arg1.top ?? 0;
        left = arg1.left ?? 0;
      } else {
        left = Number(arg1) || 0;
        top = Number(arg2) || 0;
      }

      container.scrollTo({
        top: top + (offsetTop / 2),
        left,
        behavior: 'smooth',
      });
    });

    return () => {
      window.scrollTo = original;
    };
  }, [containerRef]);
}

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
