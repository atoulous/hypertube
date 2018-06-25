import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './Home';
import Library from './Library';
import Layout from './Layout';
import MoviePlayer from './MoviePlayer';
import Starred from './Starred';
import Top10 from './Top10';
import Saw from './Saw';
import Signup from './Signup';
import Login from './Login';
import Profile from './Profile';
import Fpassword from './Fpassword';
import ResetPassword from './ResetPassword';

const App = () => (
  <BrowserRouter>
    <Layout>
      <Switch>
        <Route exact path="/" component={Home} />
        
        <Route exact path="/Signup" component={Signup} />
        <Route exact path="/Login" component={Login} />
        <Route exact path="/Profile" component={Profile} />
        <Route exact path="/Fpassword" component={Fpassword} />
        <Route exact path="/ResetPassword" component={ResetPassword} />
        
        <Route exact path="/library" component={Library} />
        <Route exact path="/library/:tabsValue" component={Library} />
        <Route exact path="/movie/:movieId" component={MoviePlayer} />
        <Route exact path="/starred" component={Starred} />
        <Route exact path="/top10" component={Top10} />
        <Route exact path="/saw" component={Saw} />
      </Switch>
    </Layout>
  </BrowserRouter>
);

export default App;
