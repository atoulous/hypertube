import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import cookie from 'universal-cookie';
import Alert from 'react-bootstrap/lib/Alert'

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import Typography from '@material-ui/core/Typography';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faGoogle} from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'


import './Home.scss';

const styles = {
	title: {
		textAlign: 'center',
		color: 'white',
		fontSize: 120,
		fontWeight: 800,
		fontFamily: 'Noto Sans'
	}, button: {
		borderColor: 'white',
		color: 'white',
		width: 300,
		margin: 10,
		fontSize: 15,
		padding: 10
	}, iconButton: {
		fontSize: 19,
		marginLeft: 4
	}, link: {
		textDecoration: 'none'
	}, centerV: {
		marginTop: '20vh',
		margin: 0,
	    padding: 0,
	    background: 'linear-gradient(to left, #4b79a1, #283e51)'
	}
};

class Home extends Component {
  state = {
	  merror: '',
  };

  componentDidMount() {
      const cookies = new cookie();
      const loginerror = cookies.get('error')
      if (loginerror) {
      	this.setState({merror: loginerror})
		  cookies.remove('error')
	  }
  }

  render() {
    const { classes } = this.props;

	const SignUpLink = props => <Link to='/signup' {...props}/>
	const LoginLink = props => <Link to='/login' {...props}/>
      let merror = ''
      if (this.state.merror) {
          merror = <Alert bsStyle='danger'>{this.state.merror}</Alert>
      }


      return (
      <div className="App">
		<Grid container className={classes.centerV}>
			<Grid item xs={12}>
				<Typography className={classes.title} gutterBottom variant="display4" component="h1">
		          Hypertube
		        </Typography>

				<br />
				<br />
				{ merror }
			</Grid>


			<Grid item xs={12}>
				<Button variant="outlined" className={classes.button} component={LoginLink}>
					<Grid container>
						<Grid item xs={1}>
							<FontAwesomeIcon className={classes.iconButton} icon={faEnvelope} />
						</Grid>
						<Grid item xs={11}>
							Sign in with your email
						</Grid>
					</Grid>
				</Button>
			</Grid>

			<Grid item xs={12}>
				<Button variant="outlined" className={classes.button}>
					<Grid container>
						<Grid item xs={1}>
							<FontAwesomeIcon className={classes.iconButton} icon={faGoogle} />
						</Grid>
						<Grid item xs={11}>
							Sign in with Google
						</Grid>
					</Grid>
				</Button>
			</Grid>

			<Grid item xs={12}>
				<a className={classes.link} href='http://localhost:5000/auth/github'>
					<Button variant="outlined" className={classes.button}>
						<Grid container>
							<Grid item xs={1}>
								<FontAwesomeIcon className={classes.iconButton} icon={faGithub} />
							</Grid>
							<Grid item xs={11}>
								Sign in with GitHub
							</Grid>
						</Grid>
					</Button>
				</a>
			</Grid>

			<Grid item xs={12}>
				<Button variant="outlined" className={classes.button}>
					<Grid container>
						<Grid item xs={1}>
							<img src={'https://signin.intra.42.fr/assets/42_logo-7dfc9110a5319a308863b96bda33cea995046d1731cebb735e41b16255106c12.svg'} />
						</Grid>
						<Grid item xs={11}>
							Sign in with 42
						</Grid>
					</Grid>
				</Button>
			</Grid>

			<br />
			<br />
			<br />
			<br />
			<br />

			<Grid item xs={12}>
				<Button variant="outlined" className={classes.button} component={SignUpLink}>
					<Grid container>
						<Grid item xs={1}>
							<FontAwesomeIcon className={classes.iconButton} icon={faEnvelope} />
						</Grid>
						<Grid item xs={11}>
							Sign up with your email
						</Grid>
					</Grid>
				</Button>
			</Grid>
		</Grid>

        <Typography className={classes.title}>
          {this.state.response}
        </Typography>
      </div>
    );
  }
}


Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);
