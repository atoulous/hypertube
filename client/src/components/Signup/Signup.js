import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cookie from 'universal-cookie'
import { Redirect } from 'react-router'

class Signup extends Component{
	constructor(props) {
		super(props);
		this.onSubmit = this.onSubmit.bind(this);
	}
	state = {
    merror: '',
	active: false
  };

	onSubmit(e) {
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
    const response = await fetch('/Signup', {
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
			<div>
				<div >
			{ active }
				<p>{this.state.merror}</p>
				<h1>Signup</h1>
				<form onSubmit={this.onSubmit} encType="multipart/form-data">
						<div>
							<label>Login</label>
							<input type="text" name="name"/>
						</div>
						<div >
							<label>Firstname</label>
							<input type="text"  name="firstname"/>
						</div>
						<div >
							<label>Lastname</label>
							<input type="text" name="lastname"/>
						</div>
						<div>
							<label>Email</label>
							<input type="text" name="email"/>
						</div>
						<div>
							<label>Password</label>
							<input type="password" name="password"/>
						</div>
						<div>
							<input type='file' id='file' name='file' />
						</div>

						<button type="submit">Signup</button>
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
