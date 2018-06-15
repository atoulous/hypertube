import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Hls from 'hls.js';

import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const styles = {
  title: {
    textAlign: 'center',
  },
  loadingContainer: {
    marginTop: 200,
  },
  loadingText: {
    marginTop: 70,
  },
};

class MoviePlayer extends Component {
state = {
  isLoading: true,
};

async componentDidMount() {
  try {
    await this.startMedia();
    const movieId = this.props.match.params.movieId;

    this.setState({
      isLoading: false,
    });

  const HLS = new hls();
  HLS.loadSource(`/api/media/${movieId}/master.m3u8`)
  HLS.attachMedia(this.refs.video);
  this.refs.video.play();
  } catch (err) {
    console.error('componentDidMount err: ', err);
  }
}

startMedia = async () => {
  try {
    const movieId = this.props.match.params.movieId;
    const response = await fetch(`/api/media/startmedia/${movieId}`);
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);
    return body;
  } catch (err) {
    throw err;
  }
}

renderLoading(classes) {
  return (
    <Grid container spacing={16} className={classes.loadingContainer} alignItems="center" direction="column" justify="center">
      <Grid item>
        <CircularProgress className={classes.progress} size={100} color="primary" />
      </Grid>

      <Grid item>
        <Typography variant="display2" className={classes.loadingText} gutterBottom>
Please wait, your movie is being loaded. This can take up to 40 seconds.
        </Typography>
      </Grid>
    </Grid>
  );
}

renderLoaded() {
  return (
    <video width="100%" ref="video" controls autoPlay />
  );
}

render() {
  const { classes } = this.props;
  const { isLoading } = this.state;

  if (isLoading) {
    return this.renderLoading(classes);
  }
  return this.renderLoaded(classes);
}
}

MoviePlayer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MoviePlayer);
