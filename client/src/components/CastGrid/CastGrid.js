import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const styles = {
	imgCast: {
		width: '10'
	}
};

class CastGrid extends Component {
	state = {

	};

	async componentDidMount() {

	}

	render() {
		const { cast } = this.props;

		return (
			<Grid container spacing={24}>
				{
					cast.map((castElement) => {
						return (
							<Grid key={castElement._id} item xs={2}>
								<img style={{width:'100%'}} alt={castElement.character} src={
									castElement.profile_path ?
									`http://image.tmdb.org/t/p/original${castElement.profile_path}`
									:
									'http://via.placeholder.com/350x540?text=No%20image'
								}/>
								<br/>
								<Typography align='center' variant="body2" gutterBottom>
									<strong>{castElement.name}</strong>
									<br/>
									{castElement.character}
								</Typography>
							</Grid>
						)
					})
				}
			</Grid>
		)
	}
}

CastGrid.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CastGrid);
