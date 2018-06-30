import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import moment from 'moment';
import Button from '@material-ui/core/Button';

import Rating from '../Rating'
import CastGrid from '../CastGrid'
import CrewGrid from '../CrewGrid'

import fetchHelper from '../../helpers/fetch';

const styles = {
	mediaTitle: {
		display: 'inline'
	}, mediaSubtitle: {
		display: 'inline',
		marginLeft: 30
	}, inputNewComment: {
		width: '100%',
		height: 36,
	}
};

class MediaDetails extends Component {
	state = {
		comments: []
	};

	constructor(props) {
		super(props);
		this.onSubmit = this.onSubmit.bind(this);
	}

	addComment = async (e) => {
      const data = new FormData(e.target);
      const movieId = this.props.media._id;
      const response = await fetchHelper.post(`/api/profile/comment/${movieId}`, data);
      const body = await response.json();
      if (response.status === 403) {
          this.setState({ redirect: '/' });
      }
      else if (response.status !== 200) throw Error(body.message);

      return body;
    };

	onSubmit(e) {
      e.preventDefault();
      this.addComment(e)
        .then((res) => {
          if (res.change) {
              this.setState({
                  comments: [res.newComment, ...this.state.comments]
              })
          }
          this.setState({ comment: '' });
        })
        .catch(err => console.log(err));
    }

	getComments = async () => {
      const movieId = this.props.media._id;
      const response = await fetchHelper.get(`/api/profile/comment/${movieId}`);
      const body = await response.json();
      return body;
    }

	async componentDidMount() {
		const comments = await this.getComments();
		this.setState({comments: comments})
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
						Release date: { media.metadatas && media.metadatas.productionDate ? moment(media.metadatas.productionDate).format("MMM Do YYYY") : 'Unknown' } <br />
						Runtime: { media.metadatas && media.metadatas.duration ? media.metadatas.duration + 'm': 'Unknown' } <br />
						Seeders: { media.seeders} <br />
						Leecher: { media.leechers} <br />
						<br />
					</Typography>

					{(() => {

						if (media.metadatas && media.metadatas.cast && media.metadatas.cast.length !== 0) {
							return (
								<ExpansionPanel>
									<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
										<Typography className={classes.heading}>Cast detail</Typography>
									</ExpansionPanelSummary>
									<ExpansionPanelDetails>
										<CastGrid cast={media.metadatas.cast} />
									</ExpansionPanelDetails>
								</ExpansionPanel>
							)
						}
					})()}
					{(() => {

						if (media.metadatas && media.metadatas.crew && media.metadatas.crew.length !== 0) {
							return (
								<ExpansionPanel>
									<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
										<Typography className={classes.heading}>Crew details</Typography>
									</ExpansionPanelSummary>
									<ExpansionPanelDetails>
										<CrewGrid crew={media.metadatas.crew} />
									</ExpansionPanelDetails>
								</ExpansionPanel>
							)
						}
					})()}
					{(() => {

						if (media.metadatas && media.metadatas.episodeGuestStars && media.metadatas.episodeGuestStars.length !== 0) {
							return (
								<ExpansionPanel>
									<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
										<Typography className={classes.heading}>Guests stars</Typography>
									</ExpansionPanelSummary>
									<ExpansionPanelDetails>
										<CastGrid cast={media.metadatas.episodeGuestStars} />
									</ExpansionPanelDetails>
								</ExpansionPanel>
							)
						}
					})()}

					<ExpansionPanel>
						<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
							<Typography className={classes.heading}>Comments ({this.state.comments.length})</Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails>

							<form onSubmit={this.onSubmit} style={{width: '100%'}}>
								<Grid container>
									<Grid item xs={9}>
										<textarea name="comment" className={classes.inputNewComment} />
									</Grid>
									<Grid item xs={1}/>
									<Grid item xs={2}>
										<Button type="submit" variant="contained" color="primary" className={classes.buttonLogin} style={{width: '100%'}}>
										  Send
										</Button>
									</Grid>
								</Grid>

								<br />

								<Grid container direction='column'>
									{
										this.state.comments.map((comment) => {
											return (
												<Grid item xs={12} key={comment._id}>
													{comment.user.name} ({moment(comment.date).format('MMMM Do YYYY, h:mm:ss a')}):
													<br/>
													{comment.comment}

													<br/><br/>
												</Grid>
											)
										})
									}
								</Grid>
							</form>

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
