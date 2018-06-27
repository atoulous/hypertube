import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router'
import { withStyles } from '@material-ui/core/styles';
import Alert from 'react-bootstrap/lib/Alert'

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import KeyboardBackspace from '@material-ui/icons/KeyboardBackspace';

import './Fpassword.css';

const styles = {
	title: {
		textAlign: 'center',
		fontSize: 70,
		fontWeight: 800,
		paddingTop: 25,
		fontFamily: 'Noto Sans'
	}, centerV: {
		marginTop: '20vh',
		margin: 0,
	    padding: 0,
	    background: 'linear-gradient(to left, #4b79a1, #283e51)'
	}, username: {
		margin: 32,
		width: 'calc(100% - 64px)',
		marginBottom: 30,
		marginTop: 20
	}, buttonLogin: {
		margin: 32,
		marginTop: 10,
		width: 'calc(100% - 64px)'
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
	}
};

class Fpassword extends Component {
    constructor(props) {
        super(props);
        this.sendpassword = this.sendpassword.bind(this);
    }
    state = {
        active: false,
		merror: ''
    };

    sendpassword(e) {
        e.preventDefault()
        this.callApi(e)
            .then(res => {
                if (res.send) {
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
        const response = await fetch('/fpassword', {
            method: 'POST',
            body: data
        });
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };

  render() {
      if (this.state.active) {
          return (<Redirect to="/ResetPassword"/>);
      }

	  const { classes } = this.props;

      let merror = ''
      if (this.state.merror) {
          merror = <Alert bsStyle='danger'>{this.state.merror}</Alert>
      }


      return (<Grid container  className={classes.centerV}>
			<Grid item xs={4}></Grid>
			<Grid item xs={4}>
				<Paper>
					<Link to='/' className={classes.back}>
						<KeyboardBackspace/>
					</Link>


					<Typography className={classes.title} gutterBottom variant="display4" component="h1">
					  Reset password
					</Typography>

					{ merror }

					<form onSubmit={this.sendpassword} method="post">
						<TextField
							id="name"
							name="name"
							label="Username"
							className={classes.username}
							margin="normal" />

						<Button type='submit' variant="contained" color="primary" className={classes.buttonLogin}>
							Send
						</Button>
					</form>

					<br />
				</Paper>
			</Grid>
		</Grid>
    );
  }
}

export default withStyles(styles)(Fpassword);
