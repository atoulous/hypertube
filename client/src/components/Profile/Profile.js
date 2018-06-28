import React, { Component } from 'react';
import cookie from 'universal-cookie';
import Alert from 'react-bootstrap/lib/Alert';

import { withStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import fetchHelper from '../../helpers/fetch';

const styles = {
  title: {
    textAlign: 'center',
    fontSize: 70,
    fontWeight: 800,
    paddingTop: 8,
    fontFamily: 'Noto Sans',
  },
  centerV: {
    marginTop: '5vh',
    marginLeft: '5vh',
    margin: 0,
    padding: 0,
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
  input: {
    display: 'none',
  },
  buttonUpload: {
    margin: 32,
    marginTop: 10,
    marginBottom: 0,
    width: 'calc(100% - 64px)',
  },
};

class Profile extends Component {
  constructor(props) {
    super(props);
    this.changeEmail = this.changeEmail.bind(this);
    this.changeFirstname = this.changeFirstname.bind(this);
    this.changeLastname = this.changeLastname.bind(this);
    this.changeLanguage = this.changeLanguage.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  state = {
    success: '',
    auth: '',
	  name: '',
	  picture: '',
	  email: '',
    lastname: '',
    firstname: '',
    active: false,
    merror: '',
    msuccess: '',
    language: '',
  };


  componentDidMount() {
    const cookies = new cookie();
    const token = cookies.get('authtoken');
    if (!token || token === '') { this.props.history.push('/home'); } else {
      this.callApi(token)
        .then((res) => {
          if (res.login) {
            this.setState({ name: res.user.name, firstname: res.user.firstname, lastname: res.user.lastname, picture: res.user.picture, email: res.user.email, auth: res.user.auth, language: res.user.language });
            console.log(this.state);
          } else {
            this.setState({ merror: res.merror });
          }
        })
		  .catch(err => console.log(err));
    }
  }

  callApi = async (token) => {
    const response = await fetchHelper.get('/profile');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  changeEmail(e) {
	  this.setState({ email: e.target.value });
  }
  changeLanguage(e) {
    this.setState({ language: e.target.value });
  }
  changeFirstname(e) {
	  this.setState({ firstname: e.target.value });
  }

  changeLastname(e) {
	  this.setState({ lastname: e.target.value });
  }


  onSubmit(e) {
	  e.preventDefault();
	  this.saveProfil(e)
	    .then((res) => {
	      if (res.change) {
	        this.setState({ firstname: res.user.firsname, lastname: res.user.lastname, picture: res.user.picture, email: res.user.email, auth: res.user.auth,language: res.user.language, msuccess: 'Profile updated' });
	        this.setState({ merror: res.merror });
          this.setState({ success: 'Profle Updated' });
	      } else {
	          this.setState({ merror: res.merror });
          this.setState({ success: '' });
        }
	    })
	    .catch(err => console.log(err));
  }

    saveProfil = async (e) => {
      const data = new FormData(e.target);
      const response = await fetchHelper.post('/profile', data);
      const body = await response.json();

      if (response.status !== 200) throw Error(body.message);

      return body;
    };


    render() {
      let auth;
      if (this.state.auth === 'local') {
        auth = <TextField id="password" name="password" label="Password" type="password" className={styles.username} margin="normal" />;
      }
      let merror = '';
      if (this.state.merror) {
        merror = <Alert bsStyle="danger">{this.state.merror}</Alert>;
      }
      let success = '';
      if (this.state.success) {
        success = <Alert bsStyle="success">{this.state.success}</Alert>;
      }
      const { classes } = this.props;

      return (


        <Grid container className={classes.centerV}>

          <Grid item xs={4}>
            { success }
            { merror }
            <Paper>

              <Typography className={classes.title} gutterBottom variant="display4" component="h1">
                {this.state.name}
              </Typography>

              <form onSubmit={this.onSubmit} encType="multipart/form-data">

                <TextField
                  id="firstname"
                  name="firstname"
                  label="First Name"
                  className={classes.username}
                  margin="normal"
                  value={this.state.firstname}
                  onChange={this.changeFirstname}
                />

                <TextField
                  id="lastname"
                  name="lastname"
                  label="Last Name"
                  className={classes.username}
                  margin="normal"
                  value={this.state.lastname}
                  onChange={this.changeLastname}
                />

                <TextField
                  id="email"
                  name="email"
                  label="Email address"
                  className={classes.username}
                  margin="normal"
                  value={this.state.email}
                  onChange={this.changeEmail}
                />

                {auth}
                <img src={this.state.picture} alt="profil" />
                <input
                  accept="image/*"
                  className={classes.input}
                  id="file"
                  type="file"
                  name="file"
                />

                <label htmlFor="file">
                  <Button variant="outlined" component="span" className={classes.buttonUpload}>
                                    Upload your image
                  </Button>
                </label>
                <Select
                  id="language"
                  name="language"
                  label="Language"
                  value={this.state.language}
                  onChange={this.changeLanguage}
                >
                  <MenuItem value="english">English</MenuItem>
                  <MenuItem value="francais">Francais</MenuItem>
                  <MenuItem value="espanol">Espanol</MenuItem>
                </Select>
                <Button type="submit" variant="contained" color="primary" className={classes.buttonLogin}>
                                Save
                </Button>
              </form>
              <br />
              <br /><br />
            </Paper>
          </Grid>
        </Grid>

      );
    }
}
export default withStyles(styles)(Profile);
