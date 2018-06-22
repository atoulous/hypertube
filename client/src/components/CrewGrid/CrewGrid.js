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

class CrewGrid extends Component {
	state = {

	};

	async componentDidMount() {

	}

	render() {
		const { crew } = this.props;

		return (
			<Grid container spacing={24}>
				{
					crew.map((crewElement) => {
						return (
							<Grid  key={crewElement._id} item xs={2}>
								<img alt={crewElement.name} style={{width:'100%'}} src={
									crewElement.profile_path ?
									`http://image.tmdb.org/t/p/original${crewElement.profile_path}`
									:
									'http://via.placeholder.com/350x540?text=No%20image'
								}/>
								<br/>
								<Typography align='center' variant="body2" gutterBottom>
									<strong>{crewElement.name}</strong>
									<br/>
									{crewElement.department}, {crewElement.job}
								</Typography>
							</Grid>
						)
					})
				}
			</Grid>
		)
	}
}

CrewGrid.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CrewGrid);
