import { Route, Switch } from 'react-router-dom';
import React from 'react';

function Page() {}

export default function Router() {
  return (
    <Switch a={1}>
      <Route path="/" />
      <Route path="/react">
        <Page />
      </Route>
      <Route path="/router">
        <Page someProps={'props'} />
      </Route>
      <Route path="/sitemap" />
      <Route path="/generator" />
      <Route />
    </Switch>
  );
}
