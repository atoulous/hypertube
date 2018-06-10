import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './Home';
import Library from './Library';
import Layout from './Layout';

const App = () => (
  <BrowserRouter>
    <Layout>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/library" component={Library} />
        <Route component={Home} />
      </Switch>
    </Layout>
  </BrowserRouter>
);

export default App;
