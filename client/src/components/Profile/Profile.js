import React, { Component } from 'react';
import cookie from 'universal-cookie';
// import { Link } from 'react-router-dom';
import Logout from './../Logout';

import './Profile.css';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.changeEmail = this.changeEmail.bind(this);
    this.changeFirstname = this.changeFirstname.bind(this);
    this.changeLastname = this.changeLastname.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  state = {
    auth: '',
	  login: '',
	  picture: '',
	  email: '',
    lastname: '',
    firstname: '',
  };

  componentDidMount() {
    const cookies = new cookie();
    const token = cookies.get('authtoken');
    if (!token || token === '') { this.props.history.push('/home'); }
    else {
      this.callApi(token)
        .then((res) => {
          if (res.message === 'success') {
            this.setState({ login: res.user.login, firstname: res.user.firstname, lastname: res.user.lastname, picture: res.user.picture, email: res.user.email, auth: res.user.auth });
          }
        })
		  .catch(err => console.log(err));
    }
  }

  callApi = async (token) => {
    const response = await fetch('/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

	changeEmail(e) {
	  this.setState({ email: e.target.value });
	}

	changeFirstname(e) {
	  this.setState({ firsname: e.target.value });
	}

	changeLastname(e) {
	  this.setState({ lastname: e.target.value });
	}


	onSubmit(e) {
	  e.preventDefault();
	  this.saveProfil(e)
	    .then((res) => {
	      if (res.message === 'success') {
	        this.setState({ login: res.user.login, firstname: res.user.firsname, lastname: res.user.lastname, picture: res.user.picture, email: res.user.email, auth: res.user.auth });
	      } else { console.log(res.message); }
	    })
	    .catch(err => console.log(err));
	}

    saveProfil = async (e) => {
      const cookies = new cookie();
      const token = cookies.get('authtoken');
      const data = new FormData(e.target);
      const response = await fetch('/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: 'POST',
        body: data,
      });
      const body = await response.json();

      if (response.status !== 200) throw Error(body.message);

      return body;
    };


    render() {
      let auth;
      if (this.state.auth === 'local') {
        auth = <div className="form-group"><label>Password</label><input type="password" className="form-control" name="password" /></div>;
      }
      return (
        <div className="container">
          <form onSubmit={this.onSubmit}>
            <p>{this.state.login}</p>

            <div className="form-group" >
              <label>Firstname</label>
              <input type="text" className="form-control" name="firstname" value={this.state.firstname} onChange={this.changeFirstname} />
            </div>
            <div className="form-group">
              <label>Lastname</label>
              <input type="text" className="form-control" name="lastname" value={this.state.lastname} onChange={this.changeLastname} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="text" className="form-control" name="email" value={this.state.email} onChange={this.changeEmail} />
            </div>
            {auth}
            <div>
              <img src={this.state.picture} alt="profil" />
              <input type="file" id="file" name="file" />
            </div>

            <button type="submit" className="btn btn-warning btn-lg">Save</button>
          </form>
          <Logout />
        </div>
      );
    }
}

export default Profile;
