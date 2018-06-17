import React, { Component } from 'react';
import cookie from 'universal-cookie'
//import { Link } from 'react-router-dom';

import './Profile.css';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.changeEmail = this.changeEmail.bind(this);
        this.changeFirstname = this.changeFirstname.bind(this);
        this.changeLastname = this.changeLastname.bind(this);
        this.changePicture = this.changePicture.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
  state = {
    response: '',
	  login: '',
	  picture: '',
	  email: '',
  };

  componentDidMount() {
      const cookies = new cookie()
      const token = cookies.get('authtoken');
	if (!token || token === '')
		this.props.history.push("/home")
	else {
		this.callApi(token)
		.then(res => {
			if (res.message === 'success') {
                this.setState({login: res.user.login, picture: res.user.picture, email: res.user.email})
            }
		})
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
		const cookies = new cookie()
		cookies.remove('authtoken')
	}

	changeEmail(e) {
        this.setState({email: e.target.value});
	}

    changeFirstname(e) {
        this.setState({firsname: e.target.value});
    }

    changeLastname(e) {
        this.setState({lasttname: e.target.value});
    }

    changePicture(e) {
        this.setState({picture: e.target.value});
    }


    onSubmit(e) {
        e.preventDefault()
        this.saveProfil(e)
            .then(res => this.setState({ picture: res.user.picture }))
            .catch(err => console.log(err));
    }

    saveProfil = async (e) => {
        const cookies = new cookie()
        const token = cookies.get('authtoken')
        const data = new FormData(e.target)
        const response = await fetch('/profile', {
            headers: {
                Authorization: 'Bearer ' + token
            },
            method: 'POST',
            body: data
        });
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };


    render() {
    return (
	<div class="container">
		  <form onSubmit={this.onSubmit}>
		   <p>{this.state.login}</p>


          <div class="form-group" >
            <label>Firstname</label>
            <input type="text" class="form-control" name="firstname" value={this.state.firstname} onChange={this.changeFirstname}/>
          </div>
          <div class="form-group">
            <label>Lastname</label>
            <input type="text" class="form-control" name="lastname" value={this.state.lastname} onChange={this.changeLastname}/>
          </div>
          <div class="form-group">
             <label>Email</label>
             <input type="text" class="form-control" name="email" value={this.state.email} onChange={this.changeEmail}/>
          </div>
          <div class="form-group">
             <label>Password</label>
             <input type="password" class="form-control" name="password"/>
          </div>
          <div>
             <img src={this.state.picture} alt='profil'/>
             <input type='file' id='file' name='file' onChange={this.changePicture}/>
          </div>

          <button type="submit" class="btn btn-warning btn-lg">Save</button>
		  </form>
	<button onClick={this.logout}>logout</button>
	</div>
    );
  }
}

export default Profile;
