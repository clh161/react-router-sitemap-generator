import { Route, Switch } from 'react-router-dom';
import React, { ReactElement } from 'react';

type PageProps = {
  someProps?: string;
  path?: string;
};
function Page({}: PageProps): ReactElement {
  return <div />;
}

export default function Router(): ReactElement {
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
