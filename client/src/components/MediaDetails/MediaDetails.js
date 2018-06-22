import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


import Rating from '../Rating'
import CastGrid from '../CastGrid'
import CrewGrid from '../CrewGrid'

const styles = {
	mediaTitle: {
		display: 'inline'
	}, mediaSubtitle: {
		display: 'inline',
		marginLeft: 30
	}
};

class MediaDetails extends Component {
	state = {

	};

	async componentDidMount() {

	}

	render() {
		const { classes, media } = this.props;

		return (
			<Grid container spacing={24}>
				<Grid item xs={10}>
					<Typography variant="display3" className={classes.mediaTitle} gutterBottom>
						{ media.metadatas ? media.metadatas.name : media.displayName }
					</Typography>
					<Typography variant="display1" className={classes.mediaSubtitle} gutterBottom>
						{ media.metadatas && media.metadatas.tagline ? media.metadatas.tagline : '' }
					</Typography>
				</Grid>
				<Grid item xs={2}>
					<Typography variant="display3" gutterBottom align='right'>
						<Rating value={media.metadatas ? media.metadatas.score : 0 } />
					</Typography>
				</Grid>

				<Grid item xs={12} sm={12} md={4} lg={4} xl={2}>
					<img width='100%' src={media.metadatas ? `http://image.tmdb.org/t/p/original${media.metadatas.posterPath}` : 'http://via.placeholder.com/350x525?text=No+image+available'} alt={ media.metadatas ? media.metadatas.name : media.displayName }/>
				</Grid>

				<Grid item xs={12} sm={12} md={8} lg={8} xl={10}>
					<Typography variant="headline" className={classes.loadingText} gutterBottom align='justify'>
						{ media.metadatas ? media.metadatas.overview : 'No overview available for this media. :(' }
					</Typography>

					<Typography variant="body2" className={classes.loadingText} gutterBottom align='justify'>
						<br />
						Release date: { media.metadatas && media.metadatas.productionDate ? media.metadatas.productionDate : 'Unknown' } <br />
						Runtime: { media.metadatas && media.metadatas.duration ? media.metadatas.duration + 'm': 'Unknown' } <br />
						Seeders: { media.seeders} <br />
						Leecher: { media.leechers} <br />
						<br />
					</Typography>

					<ExpansionPanel>
						<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
							<Typography className={classes.heading}>Cast detail</Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails>
							<CastGrid cast={media.metadatas ? media.metadatas.cast : []} />
						</ExpansionPanelDetails>
					</ExpansionPanel>
					<ExpansionPanel>
						<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
							<Typography className={classes.heading}>Crew details</Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails>
							<CrewGrid crew={media.metadatas ? media.metadatas.crew : []} />
						</ExpansionPanelDetails>
					</ExpansionPanel>


				</Grid>
			</Grid>
		)
	}
}

MediaDetails.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MediaDetails);
