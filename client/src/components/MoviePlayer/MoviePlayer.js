import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import MediaDetails from '../MediaDetails';
import VideoPlayer from '../VideoPlayer';

import fetchHelper from '../../helpers/fetch';
import Checktoken from '../CheckToken';

const styles = {
  title: {
    textAlign: 'center',
  },
  loadingContainer: {
    marginTop: 230,
    marginBottom: 230,
  },
  loadingText: {
    marginTop: 10,
  },
};

class MoviePlayer extends Component {
  state = {
    isLoading: true,
    media: {},
    comments: [],
    redirect: null,
    comment: ''
  };

  async componentDidMount() {
    try {
      const media = await this.getMedia();
      this.setState({
        isLoading: false,
        media: media
      });
    } catch (err) {
      console.error('componentDidMount err: ', err);
    }
  }

  getMedia = async () => {
    const { movieId } = this.props.match.params;
    const response = await fetchHelper.get(`/api/media/media/${movieId}`);
    const body = await response.json();
    return body;
  }

  renderLoading(classes) {
    return (
      <Grid container spacing={16} className={classes.loadingContainer} alignItems="center" direction="column" justify="center">
        <Checktoken/>
        <Grid item>
          <CircularProgress className={classes.progress} size={200} color="primary" />
        </Grid>

        <Grid item>
          <Typography align="center" variant="display2" className={classes.loadingText} gutterBottom>
						Please wait, your movie is being loaded. This can take up to 40 seconds.
          </Typography>
        </Grid>
      </Grid>
    );
  }

  renderLoaded(classes) {
    return (
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <VideoPlayer media={this.state.media} mediaId={this.state.media._id} />
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        <Grid item xs={12}>
          <MediaDetails media={this.state.media} comments={this.state.comments}/>
        </Grid>

      </Grid>
    );
  }

  render() {
    const { classes } = this.props;
    const { isLoading, redirect } = this.state;

    if (redirect) return (<Redirect to={redirect} />);

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
