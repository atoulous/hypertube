import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'


import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import './Home.scss';

const styles = {
  title: {
    textAlign: 'center',
  },
};

class Home extends Component {
  state = {
    response: '',
	  merror: '',
  };

  componentDidMount() {
    
  }

  render() {
    const { classes } = this.props;

    return (
      <div className="App">
        <Typography className={classes.title} gutterBottom variant="headline" component="h1">
          Home
        </Typography>
        <Link to='/login'>Login</Link>
          <Link to='/signup'>Signup</Link>
        <a href='http://localhost:5000/auth/github'>GitHub</a>

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
