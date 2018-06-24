import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cookie from 'universal-cookie'

class Signup extends Component{
	constructor(props) {
		super(props);
		this.onSubmit = this.onSubmit.bind(this);
	}
	state = {
    response: '',
  };

	onSubmit(e) {
		e.preventDefault()
		this.callApi(e)
		  .then(res => {
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
    const response = await fetch('/Signup', {
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
					<h1><span class="fa fa-sign-in"></span> Signup</h1>
					<form onSubmit={this.onSubmit} encType="multipart/form-data">
						<div class="form-group">
							<label>Login</label>
							<input type="text" class="form-control" name="login"/>
						</div>
						<div class="form-group">
							<label>Firstname</label>
							<input type="text" class="form-control" name="firstname"/>
						</div>
						<div class="form-group">
							<label>Lastname</label>
							<input type="text" class="form-control" name="lastname"/>
						</div>
						<div class="form-group">
							<label>Email</label>
							<input type="text" class="form-control" name="email"/>
						</div>
						<div class="form-group">
							<label>Password</label>
							<input type="password" class="form-control" name="password"/>
						</div>
						<div>
							<input type='file' id='file' name='file' />
						</div>

						<button type="submit" class="btn btn-warning btn-lg">Signup</button>
					</form>

					<hr/>

					<p>Already have an account? <Link to="/login">Login</Link></p>
					<p>Or go <Link to="/">home</Link>.</p>

				</div>

			</div>
		)
	};

};

export default Signup;
