import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Star from '@material-ui/icons/Star';
import StarHalf from '@material-ui/icons/StarHalf';
import StarEmpty from '@material-ui/icons/StarBorder';



const styles = {

};

class Rating extends Component {
	state = {

	};

	async componentDidMount() {

	}

	render() {
		const { value } = this.props;

		const scaledValue = value / 2

		// lol
		if (scaledValue === 0) {
			return (<div><StarEmpty /><StarEmpty /><StarEmpty /><StarEmpty /><StarEmpty /></div>)
		} else if (scaledValue < 1) {
			return (<div><StarHalf /><StarEmpty /><StarEmpty /><StarEmpty /><StarEmpty /></div>)
		} else if (scaledValue < 1.5) {
			return (<div><Star /><StarEmpty /><StarEmpty /><StarEmpty /><StarEmpty /></div>)
		} else if (scaledValue < 2) {
			return (<div><Star /><StarHalf /><StarEmpty /><StarEmpty /><StarEmpty /></div>)
		} else if (scaledValue < 2.5) {
			return (<div><Star /><Star /><StarEmpty /><StarEmpty /><StarEmpty /></div>)
		} else if (scaledValue < 3) {
			return (<div><Star /><Star /><StarHalf /><StarEmpty /><StarEmpty /></div>)
		} else if (scaledValue < 3.5) {
			return (<div><Star /><Star /><Star /><StarEmpty /><StarEmpty /></div>)
		} else if (scaledValue < 4) {
			return (<div><Star /><Star /><Star /><StarHalf /><StarEmpty /></div>)
		} else if (scaledValue < 4.5) {
			return (<div><Star /><Star /><Star /><Star /><StarEmpty /></div>)
		} else if (scaledValue < 5) {
			return (<div><Star /><Star /><Star /><Star /><StarHalf /></div>)
		} else {
			return (<div><Star /><Star /><Star /><Star /><Star /></div>)
		}
	}
}

Rating.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Rating);
