import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hls from 'hls.js';

import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import ErrorOutline from '@material-ui/icons/ErrorOutline'

const styles = {
	title: {
		textAlign: 'center',
	},
	loadingContainer: {
		marginTop: 230,
		marginBottom: 230
	},
	loadingText: {
		marginTop: 10,
	}
};

class VideoPlayer extends Component {
	state = {
		isLoading: true,
		media: {},
		error: false
	};

	async componentDidMount() {
		try {
			const media = await this.startMedia();
			if (media.error) {
				this.setState({
					error: true,
					isLoading: false,
					message: media.msg
				})
				return
			}

			const movieId = this.props.mediaId;

			this.setState({
				error: false,
				isLoading: false,
				media: media.media
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
		const movieId = this.props.mediaId;
		const response = await fetch(`/api/media/startmedia/${movieId}`);
		const body = await response.json();

		if (response.status >= 400 && response.status <= 499) {
			return {
				error: true,
				msg: body.error
			}
		} else if (response.status !== 200) {
			throw Error(body.message)
		} else {
			return {
				error: false,
				media: body
			}
		}
	}

	renderLoading(classes) {
		return (
			<Grid container spacing={16} className={classes.loadingContainer} alignItems="center" direction="column" justify="center">
				<Grid item>
					<CircularProgress className={classes.progress} size={200} color="primary" />
				</Grid>

				<Grid item>
					<Typography align='center' variant="display2" className={classes.loadingText} gutterBottom>
						Please wait, your movie is being loaded. This can take up to 40 seconds.
					</Typography>
				</Grid>
			</Grid>
		);
	}

	renderLoaded(classes) {
		return (
			<video width="100%" ref="video" className={classes.videoPlayer} controls autoPlay />
		);
	}

	renderError(classes) {
		return (
			<Grid container spacing={16} className={classes.loadingContainer} alignItems="center" direction="column" justify="center">
				<Grid item>
					<ErrorOutline color="error" style={{ fontSize: 200 }} />
				</Grid>

				<Grid item>
					<Typography align='center' variant="display2" className={classes.loadingText} gutterBottom>
						{this.state.message}
					</Typography>
				</Grid>
			</Grid>
		)
	}

	render() {
		const { classes } = this.props;
		const { isLoading } = this.state;

		if (isLoading) {
			return this.renderLoading(classes);
		} else if (this.state.error) {
			return this.renderError(classes);
		}
		return this.renderLoaded(classes);
	}
}

VideoPlayer.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(VideoPlayer);
