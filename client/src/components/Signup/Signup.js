import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cookie from 'universal-cookie'
import { Redirect } from 'react-router'

import { withStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import KeyboardBackspace from '@material-ui/icons/KeyboardBackspace';

const styles = {
	title: {
		textAlign: 'center',
		fontSize: 70,
		fontWeight: 800,
		paddingTop: 8,
		fontFamily: 'Noto Sans'
	}, centerV: {
		marginTop: '15vh',
		margin: 0,
	    padding: 0,
	    background: 'linear-gradient(to left, #4b79a1, #283e51)'
	}, username: {
		margin: 32,
		width: 'calc(100% - 64px)',
		marginBottom: 10,
		marginTop: 0
	}, password: {
		margin: 32,
		marginTop: 10,
		marginBottom: 50,
		width: 'calc(100% - 64px)'
	}, buttonLogin: {
		margin: 32,
		marginTop: 10,
		marginBottom: 40,
		width: 'calc(100% - 64px)'
	}, bottomLink: {
		marginLeft: 32,
		marginRight: 32,
		marginBottom: 0
	}, link: {
		textDecoration: 'none',
	}, back: {
		position: 'relative',
		color: 'rgb(98, 98, 98)',
		top: 32,
		left: 32
	}, error: {
		marginLeft: 32,
		marginRight: 32,
		marginBottom: 10,
		marginTop: 50,
		color: '#ff0033'
	},input: {
    	display: 'none',
	}, buttonUpload: {
		margin: 32,
		marginTop: 10,
		marginBottom: 0,
		width: 'calc(100% - 64px)'
	}
};

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
        if (this.state.active) {
            return (<Redirect to="/"/>)
        }

		const { classes } = this.props;

		return (
			<Grid container  className={classes.centerV}>
				<Grid item xs={4}></Grid>
				<Grid item xs={4}>
					<Paper>
						<Link to='/' className={classes.back}>
							<KeyboardBackspace/>
						</Link>


						<Typography className={classes.title} gutterBottom variant="display4" component="h1">
				          Sign up
				        </Typography>


						<p className={classes.error}>
							{this.state.merror ? 'Error: ' + this.state.merror : ''}
						</p>

						<form onSubmit={this.onSubmit} encType="multipart/form-data">
							<TextField
								id="name"
								name="name"
								label="Username"
								className={classes.username}
								margin="normal" />

							<TextField
								id="firstname"
								name="firstname"
								label="First Name"
								className={classes.username}
								margin="normal" />

							<TextField
								id="lastname"
								name="lastname"
								label="Last Name"
								className={classes.username}
								margin="normal" />

							<TextField
								id="email"
								name="email"
								label="Email address"
								className={classes.username}
								margin="normal" />

							<TextField
								id="password"
								name="password"
								label="Password"
								type="password"
								className={classes.username}
								margin="normal" />

								<input
									accept="image/*"
									className={classes.input}
									id="file"
									type="file"
									name="file" />

							<label htmlFor="file">
								<Button variant="outlined" component="span" className={classes.buttonUpload}>
									Upload your image
								</Button>
							</label>

							<Button type='submit' variant="contained" color="primary" className={classes.buttonLogin}>
								Sign up
							</Button>
						</form>


						<Link to="/login"  className={classes.link}>
							<Typography  variant="title" className={classes.bottomLink}>
								Already have an account ? Sign in.
							</Typography>
						</Link>

						<br />
						<br /><br />
					</Paper>
				</Grid>
			</Grid>
		)
	};

};

export default withStyles(styles)(Signup);
