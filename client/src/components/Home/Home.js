import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
