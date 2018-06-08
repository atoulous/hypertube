import React from 'react';
import { Link } from 'react-router-dom';

const Signup = () => (
	<div class="container">
		<div class="col-sm-6 col-sm-offset-3">
			<h1><span class="fa fa-sign-in"></span> Signup</h1>
			<form action="/signup" method="post" enctype="multipart/form-data">
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
					<img src="uploads/noprofil.png" class="img-thumbnail" alt="Photo profil"/>
					<input type='file' id='file' name='file'/>
				</div>

				<button type="submit" class="btn btn-warning btn-lg">Signup</button>
			</form>

			<hr/>

			<p>Already have an account? <Link to="/login">Login</Link></p>
			<p>Or go <Link to="/">home</Link>.</p>

		</div>

	</div>

);

export default Signup;
