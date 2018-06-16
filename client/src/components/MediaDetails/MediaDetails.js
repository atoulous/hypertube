import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const styles = {

};

class MediaDetails extends Component {
	state = {

	};

	async componentDidMount() {

	}

	render() {
		const { classes, media } = this.props;

		console.log(media)

		return (
			<Grid container spacing={24}>
				<Grid item xs={12}>
					<Typography variant="display2" className={classes.loadingText} gutterBottom>
						{ media.metadatas ? media.metadatas.name : media.displayName }
					</Typography>
				</Grid>

				<Grid item xs={12} sm={12} md={4} lg={4} xl={2}>
					<img width='100%' src={media.metadatas ? `http://image.tmdb.org/t/p/original${media.metadatas.posterPath}` : 'http://via.placeholder.com/350x525?text=No+image+available'} />
				</Grid>

				<Grid item xs={12} sm={12} md={8} lg={8} xl={10}>
					<Typography variant="headline" className={classes.loadingText} gutterBottom align='justify'>
						{ media.metadatas ? media.metadatas.overview : 'No overview available for this media. :(' }
					</Typography>
				</Grid>
			</Grid>
		)
	}
}

MediaDetails.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MediaDetails);
