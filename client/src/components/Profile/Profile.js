import React, { Component } from 'react';
import cookie from 'react-cookies'
//import { Link } from 'react-router-dom';

import './Profile.css';

class Profile extends Component {
  state = {
    response: '',
  };

  componentDidMount() {
	//const token = sessionStorage.getItem('jwtToken') || cookie.load('authtoken')
	const token = cookie.load('authtoken');
		console.log(token)
	if (!token || token === '')
		this.props.history.push("/login")
	else {
		this.callApi(token)
		.then(res => console.log(res))
		  //this.setState({ response: res.express }))
		  .catch(err => console.log(err));
		}
  }

  callApi = async (token) => {
    const response = await fetch('/profile', {
		headers: {
			Authorization: 'Bearer ' + token
		}
	});
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

	logout = () => {
		sessionStorage.setItem('jwtToken', '')
	}

  render() {
    return (
	<div class="container">
	<p>Yeeeeeeeeeee</p>
	<button onClick={this.logout}>logout</button>
	</div>
    );
  }
}

export default Profile;
