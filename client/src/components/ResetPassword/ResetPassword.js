import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router'
import cookie from 'universal-cookie'

import './ResetPassword.css';

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.sendpassword = this.sendpassword.bind(this);
    }
    state = {
        active: false,
    };

    sendpassword(e) {
        e.preventDefault()
        this.callApi(e)
            .then(res => {
                const cookies = new cookie()
                cookies.set('authtoken', res.token, {path: '/'});
                if (res.message === 'success') {
                	this.setState({active: true})
                }
            })
            .catch(err => console.log(err));
    }

    callApi = async (e) => {
        const data = new FormData(e.target)
        const response = await fetch('/resetpasswd', {
            method: 'POST',
            body: data
        });
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };

  render() {
      let active
      if (this.state.active) {
          active = <Redirect to="/profile"/>
      }
    return (
		<div class="container">
			{active}
			<div class="col-sm-6 col-sm-offset-3">
				<h1><span class="fa fa-sign-in"></span>Forgot Password :</h1>
				<form onSubmit={this.sendpassword} method="post">
					<div class="form-group">
						<label>Code</label>
						<input type="text" class="form-control" name="code"/>
					</div>
                    <div class="form-group">
                        <label>New Password</label>
                        <input type="password" class="form-control" name="password"/>
                    </div>
					<button type="submit" class="btn btn-warning btn-lg" >Send</button>
				</form>
				<hr/>
				<p>Need an account? <Link to="/signup">Signup</Link></p>
				<p>Or go <Link to="/">home</Link>.</p>
			</div>
		</div>
    );
  }
}

export default ResetPassword;
