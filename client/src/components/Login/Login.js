import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cookie from 'universal-cookie'
import { Redirect } from 'react-router'

class Login extends Component{
	constructor(props) {
		super(props);
		this.tryLogin = this.tryLogin.bind(this);
	}
    state = {
        active: false,
		merror: ''
    };

	tryLogin(e) {
	e.preventDefault()
    this.callApi(e)
      .then(res => {
			if (res.login) {
                const cookies = new cookie()
                cookies.set('authtoken', res.token, {path: '/'});
                this.setState({active: true})
			}
			else {
                this.setState({merror: res.merror})
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

    return body;
  };

	render() {
        let active
        if (this.state.active) {
            active = <Redirect to="/profile"/>
        }
		return (
		<div>
			{active}
			<div >
				<p>{this.state.merror}</p>
				<h1>Login</h1>
				<form onSubmit={this.tryLogin} method="post">
					<div>
						<label>Login</label>
						<input type="text" name="name"/>
					</div>
					<div>
						<label>Password</label>
						<input type="password" name="password"/>
					</div>

					<button type="submit">Login</button>
				</form>
				<hr/>
				<p>Need an account? <Link to="/signup">Signup</Link></p>
				<p>Forgot your password ? <Link to="/Fpassword">Send</Link></p>
				<p>Or go <Link to="/">home</Link>.</p>
			</div>
		</div>
		)
	}
};

export default Login;
