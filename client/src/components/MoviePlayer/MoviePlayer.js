import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cookie from 'universal-cookie';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import Paper from '@material-ui/core/Paper';

import MediaDetails from '../MediaDetails';
import VideoPlayer from '../VideoPlayer';
import CardComment from '../CardComment';


const cookies = new cookie();
const token = cookies.get('authtoken');

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
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }
  state = {
    isLoading: true,
    media: {},
    comments: [],
  };

  async componentDidMount() {
    try {
      const media = await this.getMedia();
      this.setState({
        isLoading: false,
        media,
      });
      const comments = await this.getComments();
      this.setState({
        comments: comments.comments,
      });
      console.log(this.state.comments);
    } catch (err) {
      console.error('componentDidMount err: ', err);
    }
  }

  getComments = async () => {
    const movieId = this.props.match.params.movieId;
    const response = await fetch(`/api/profile/comment/${movieId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const body = await response.json();
    return body;
  }

  getMedia = async () => {
    const movieId = this.props.match.params.movieId;
    const response = await fetch(`/api/media/media/${movieId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const body = await response.json();

    return body;
  }

  onSubmit(e) {
    e.preventDefault();
    this.addComment(e)
      .then((res) => {
        if (res.change) { console.log('ok'); }
      })
      .catch(err => console.log(err));
  }

  addComment = async (e) => {
    const data = new FormData(e.target);
    const movieId = this.props.match.params.movieId;
    const response = await fetch(`/api/profile/comment/${movieId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'POST',
      body: data,
    });
    const body = await response.json();
    console.log(body);
    if (response.status !== 200) throw Error(body.message);

    return body;
  };


  renderLoading(classes) {
    return (
      <Grid container spacing={16} className={classes.loadingContainer} alignItems="center" direction="column" justify="center">
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
    const { comments } = this.state;

    return (
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <VideoPlayer media={this.state.media} mediaId={this.state.media._id} />
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        <Grid item xs={12}>
          <MediaDetails media={this.state.media} />
        </Grid>


        <Paper>

          <Typography className={classes.title} gutterBottom variant="display4" component="h1">
						Comments
          </Typography>

          <form onSubmit={this.onSubmit}>

            <TextField
              id="comment"
              name="comment"
              label="Commenting publicly"
              margin="normal"
              hintText="MultiLine with rows: 2 and rowsMax: 4"
              multiLine
              rows={3}
              rowsMax={5}
            />
            <Button type="submit" variant="contained" color="primary" className={classes.buttonLogin}>
							Save
            </Button>

          </form>

          <Grid container spacing={24} style={{ margin: 'auto' }}>
            {
              comments.map(comment => (
                <CardComment
                  key={comment.user.id}
                  title={comment.user.name}
                  imagePath={comment.user.picture}
                  comment={comment.comment}
                  date={comment.date.toLocaleDateString}
                />
                ))
            }
          </Grid>
        </Paper>
      </Grid>
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
