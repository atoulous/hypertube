import React, { Component } from 'react';
import { Redirect } from 'react-router'
import Cookie from 'universal-cookie';


import './Logout.css';

class Logout extends Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }
  state = {
  	active: false
}

  logout() {
    const cookies = new Cookie();
    cookies.remove('authtoken', { path: '/' });
      this.setState({ active: true });
  }

  render() {
      let active
      if (this.state.active) {
      active = <Redirect to="/"/>
  }
    return (
      <div>
        <button onClick={this.logout}>Log out</button>
		  {active}
      </div>
    );
  }
}

export default Logout;
