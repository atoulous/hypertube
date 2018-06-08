import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import logo from '../../logo.svg';
import './Home.css';

class Home extends Component {
 /* state = {
    response: '',
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };
*/
  render() {
    return (
	<div class="container">
		<div class="jumbotron text-center">
			<h1><span class="fa fa-lock"></span> Node Authentication</h1>
			<p>Login or Register with:</p>
			<Link to="/login" class="btn btn-default"><span class="fa fa-user"></span> Local Login</Link>
			<Link to="/signup" class="btn btn-default"><span class="fa fa-user"></span> Local Signup</Link>
			<Link to="/auth/google" class="btn btn-danger"><span class="fa fa-google-plus"></span> Google</Link>
			<Link to="/auth/qd" class="btn btn-dark"><span class="fa fa-user"></span> Born 2 Code</Link>
		</div>
	</div>
    );
  }
}

export default Home;
