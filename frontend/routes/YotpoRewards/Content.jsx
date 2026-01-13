import React, {
  memo, useState, useCallback, useRef,
} from 'react';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import { getUserData } from '@shopgate/engage/user';
import { makeStyles } from '@shopgate/engage/styles';
import { useThemeComponents } from '@shopgate/engage/core/hooks';
import { View, LoadingIndicator } from '@shopgate/engage/components';
// eslint-disable-next-line import/extensions
import { guid, rewardsPageTitle } from '../../config.json';
import { RewardsWidget } from '../../components';

const useStyles = makeStyles()({
  loadingContainer: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const YOTPO_SCRIPT_ID = 'yotpo-rewards-script';

/**
 * The RewardsRouteContent component.
 * @returns {JSX.Element}
 */
const RewardsRouteContent = () => {
  const { classes } = useStyles();
  const { AppBar } = useThemeComponents();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const pollingRef = useRef(null);
  const userData = useSelector(getUserData) || {};

  /**
   * Callback when the Yotpo script has been loaded.
   */
  const onScriptLoad = useCallback(() => {
    /**
     * Checks if the Yotpo script has been loaded and initialization is possible.
     */
    const checkScript = () => {
      if (window?.yotpoWidgetsContainer?.initWidgets) {
        clearInterval(pollingRef.current);
        setScriptLoaded(true);
      }
    };

    pollingRef.current = setInterval(() => {
      checkScript();
    }, 200);

    checkScript();
  }, []);

  /**
   * Callback to register a load event listener on the Yotpo script tag.
   */
  const onChangeClientState = useCallback(() => {
    const scriptElement = document.getElementById(YOTPO_SCRIPT_ID);
    if (scriptElement && !scriptLoaded) {
      scriptElement.addEventListener('load', onScriptLoad);
    }
  }, [onScriptLoad, scriptLoaded]);

  return (
    <View>
      <AppBar title={rewardsPageTitle} />
      <Helmet onChangeClientState={onChangeClientState}>
        <script
          async
          src={`https://cdn-widgetsrepository.yotpo.com/v1/loader/${guid}`}
          id={YOTPO_SCRIPT_ID}
        />
      </Helmet>
      {scriptLoaded && userData?.yotpoToken ? (
        <RewardsWidget />
      ) : (
        <div className={classes.loadingContainer}>
          <LoadingIndicator />
        </div>
      ) }
    </View>
  );
};

export default memo(RewardsRouteContent);
