import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cookie from 'universal-cookie'

class Login extends Component{
	constructor(props) {
		super(props);
		this.tryLogin = this.tryLogin.bind(this);
	}
	state = {
    response: '',
  };

	tryLogin(e) {
	e.preventDefault()
    this.callApi(e)
      .then(res => {
			this.setState({ response: res.message })
			if (res.message === 'success') {
                const cookies = new cookie()
                cookies.set('authtoken', res.token, {path: '/'});
				this.props.history.push("/Profile")
			}
	  })
      .catch(err => console.log(err));
  }

  callApi = async (e) => {
	const data = new FormData(e.target)
    const response = await fetch('/login', {
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
			<div class="col-sm-6 col-sm-offset-3">
				<p>{this.state.response}</p>
				<h1><span class="fa fa-sign-in"></span>Login</h1>
				<form onSubmit={this.tryLogin} method="post">
					<div class="form-group">
						<label>Login</label>
						<input type="text" class="form-control" name="name"/>
					</div>
					<div class="form-group">
						<label>Password</label>
						<input type="password" class="form-control" name="password"/>
					</div>

					<button type="submit" class="btn btn-warning btn-lg" >Login</button>
				</form>
				<hr/>
				<p>Need an account? <Link to="/signup">Signup</Link></p>
				<p>Forgot your password ? <Link to="/fpassword">Send</Link></p>
				<p>Or go <Link to="/">home</Link>.</p>
			</div>
		</div>
		)
	}
};

export default Login;
