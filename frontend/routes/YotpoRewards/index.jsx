import React from 'react';
import { Route } from '@shopgate/engage/components';
import { REWARDS_ROUTE_PATTERN } from '../../constants';
import Content from './Content';

export default () => (
  <Route
    pattern={REWARDS_ROUTE_PATTERN}
    component={Content}
  />
);
