import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import MediaDetails from '../MediaDetails'
import VideoPlayer from '../VideoPlayer'

import Divider from '@material-ui/core/Divider';


const styles = {

};

class MoviePlayer extends Component {
	state = {
		isLoading: true,
		media: {}
	};

	async componentDidMount() {
		try {
			const media = await this.getMedia();
			this.setState({
				isLoading: false,
				media: media
			})
		} catch (err) {
			console.error('componentDidMount err: ', err);
		}
	}

	getMedia = async () => {
		const movieId = this.props.match.params.movieId;
		const response = await fetch(`/api/media/media/${movieId}`);
		const body = await response.json();

		return body
	}

	renderLoading(classes) {
		return (
			<p>loading</p>
		);
	}

	renderLoaded(classes) {
		return (
			<Grid container spacing={24}>
				<Grid item xs={12}>
					<VideoPlayer mediaId={this.state.media._id} />
				</Grid>

				<Grid item xs={12}>
					<Divider />
				</Grid>

				<Grid item xs={12}>
					<MediaDetails media={this.state.media} />
				</Grid>
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
