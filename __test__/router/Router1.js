// eslint-disable-next-line import/no-extraneous-dependencies
import { Route, Switch } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react';

export default function Router() {
  return (
    <Switch a={1}>
      <Route path="/" />
      <Route path="/react" />
      <Route path="/router" />
      <Route path="/sitemap" />
      <Route path="/generator" />
      <Route />
    </Switch>
  );
}
