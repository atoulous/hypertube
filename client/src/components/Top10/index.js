import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = {
  title: {
    textAlign: 'center',
  },
};

class Top10 extends Component {
  state = {
  };

  componentDidMount() {
  }

  render() {
    const { classes } = this.props;

    return (
      <Typography className={classes.title} gutterBottom variant="headline" component="h1">
        should fetch top10 medias
      </Typography>
    );
  }
}


Top10.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Top10);
