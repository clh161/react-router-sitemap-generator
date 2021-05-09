//@flow strict

import { Route, Switch } from 'react-router-dom';
import React from 'react';
import type { Node } from 'react';
function Page(): Node {
  return <div />;
}

export default function Router(): Node {
  return (
    <Switch>
      <Route path="/" />
      <Route path="/react">
        <Page />
      </Route>
      <Route path="/router">
        <Page someProps={'props'} />
      </Route>
      <Route path="/sitemap" />
      <Route path="/generator" />
      <Route
        path="/nested"
        component={({ match }) => (
          <Switch>
            <Route path={match.url + '/nested-child'}>
              <Page />
              <Page path={'/path-should-not-included'} />
            </Route>
          </Switch>
        )}
      />
      <Route />
    </Switch>
  );
}
