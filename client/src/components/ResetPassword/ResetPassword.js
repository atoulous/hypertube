import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import cookie from 'universal-cookie';

import { withStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import KeyboardBackspace from '@material-ui/icons/KeyboardBackspace';
import Alert from 'react-bootstrap/lib/Alert';

const styles = {
  title: {
    textAlign: 'center',
    fontSize: 70,
    fontWeight: 800,
    paddingTop: 8,
    fontFamily: 'Noto Sans',
  },
  centerV: {
    marginTop: '20vh',
    margin: 0,
    padding: 0,
    background: 'linear-gradient(to left, #4b79a1, #283e51)',
  },
  username: {
    margin: 32,
    width: 'calc(100% - 64px)',
    marginBottom: 10,
    marginTop: 0,
  },
  password: {
    margin: 32,
    marginTop: 10,
    marginBottom: 50,
    width: 'calc(100% - 64px)',
  },
  buttonLogin: {
    margin: 32,
    marginTop: 10,
    marginBottom: 40,
    width: 'calc(100% - 64px)',
  },
  bottomLink: {
    marginLeft: 32,
    marginRight: 32,
    marginBottom: 0,
  },
  link: {
    textDecoration: 'none',
  },
  back: {
    position: 'relative',
    color: 'rgb(98, 98, 98)',
    top: 32,
    left: 32,
  },
  error: {
    marginLeft: 32,
    marginRight: 32,
    marginBottom: 10,
    marginTop: 50,
    color: '#ff0033',
  },
};


class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.sendpassword = this.sendpassword.bind(this);
  }
    state = {
      active: false,
      merror: '',
    };

    sendpassword(e) {
      e.preventDefault();
      this.callApi(e)
        .then((res) => {
          if (res.change) {
            const cookies = new cookie();
            cookies.set('authtoken', res.token, { path: '/' });
                	this.setState({ active: true });
          } else {
            this.setState({ merror: res.merror });
          }
        })
        .catch(err => console.log(err));
    }

    callApi = async (e) => {
      const data = new FormData(e.target);
      const response = await fetch('/resetpasswd', {
        method: 'POST',
        body: data,
      });
      const body = await response.json();

      if (response.status !== 200) throw Error(body.message);

      return body;
    };

    render() {
      let active;
      if (this.state.active) {
        active = <Redirect to="/" />;
      }

      let merror = '';
      if (this.state.merror) {
        merror = <Alert bsStyle="danger">{this.state.merror}</Alert>;
      }

      const { classes } = this.props;

      return (

        <Grid container className={classes.centerV}>
          {active}
          <Grid item xs={4} />
          <Grid item xs={4}>
            <Paper>
              <Link to="/" className={classes.back}>
                <KeyboardBackspace />
              </Link>


              <Typography className={classes.title} gutterBottom variant="display4" component="h1">
                          Reset password
              </Typography>
              { merror }


              <form onSubmit={this.sendpassword} method="post">
                <TextField
                  id="code"
                  name="code"
                  label="Code"
                  className={classes.username}
                  margin="normal"
                />

                <TextField
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  className={classes.password}
                  margin="normal"
                />


                <Button type="submit" variant="contained" color="primary" className={classes.buttonLogin}>
                              Sign in
                </Button>
              </form>


              <Link to="/signup" className={classes.link}>
                <Typography variant="title" className={classes.bottomLink}>
                              Need an account ? Sign up.
                </Typography>
              </Link>

              <br />

              <Link to="/Fpassword" className={classes.link}>
                <Typography variant="title" className={classes.bottomLink}>
                              Forgot your password ? Reset it
                </Typography>
              </Link>

              <br />
              <br /><br />
            </Paper>
          </Grid>
        </Grid>
      );
    }
}

export default withStyles(styles)(ResetPassword);
