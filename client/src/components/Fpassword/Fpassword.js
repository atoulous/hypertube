import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router'

import './Fpassword.css';

class Fpassword extends Component {
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
                this.setState({ response: res.message })
                if (res.message === 'success') {
                	this.setState({active: true})
                }
            })
            .catch(err => console.log(err));
    }

    callApi = async (e) => {
        const data = new FormData(e.target)
        const response = await fetch('/fpassword', {
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
          active = <Redirect to="/ResetPassword"/>
      }
    return (
		<div class="container">
			{active}
			<div class="col-sm-6 col-sm-offset-3">
				<h1><span class="fa fa-sign-in"></span>Forgot Password :</h1>
				<form onSubmit={this.sendpassword} method="post">
					<div class="form-group">
						<label>Login</label>
						<input type="text" class="form-control" name="name"/>
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

export default Fpassword;
