import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => (
		<div class="container">
			<div class="col-sm-6 col-sm-offset-3">
				<h1><span class="fa fa-sign-in"></span>Login</h1>
				<form action="/login" method="post">
					<div class="form-group">
						<label>Email</label>
						<input type="text" class="form-control" name="email"/>
					</div>
					<div class="form-group">
						<label>Password</label>
						<input type="password" class="form-control" name="password"/>
					</div>

					<button type="submit" class="btn btn-warning btn-lg">Login</button>
				</form>
				<hr/>
				<p>Need an account? <Link to="/signup">Signup</Link></p>
				<p>Forgot your password ? <Link to="/fpassword">Send</Link></p>
				<p>Or go <Link to="/">home</Link>.</p>
			</div>
		</div>
);

export default Login;
