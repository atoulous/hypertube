import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import StarIcon from '@material-ui/icons/Star';
import PlayIcon from '@material-ui/icons/PlayCircleFilled';
import Chip from '@material-ui/core/Chip';

import fetchHelper from '../../helpers/fetch';

const defaultImage = 'http://vollrath.com/ClientCss/images/VollrathImages/No_Image_Available.jpg';

const styles = () => ({
  card: {
    width: 300,
    height: 450,
    '&:hover': {
      boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .30)',
      '&>img': {
        '-webkit-transition': 'margin-top 0.5s, -webkit-transform 0.5s',
        transition: 'margin-top 0.5s, -webkit-transform 0.5s',
        marginTop: '-95%',
      },
    },
  },
  link: {
    textDecoration: 'none',
  },
  cardContent: {
    height: 235,
    overflow: 'auto',
  },
  image: {
    '-webkit-transition': 'margin-top 0.5s, -webkit-transform 0.5s',
    transition: 'margin-top 0.5s, -webkit-transform 0.5s',
    width: '100%',
  },
  mediaFull: {
  },
  rightButton: {
    marginLeft: 'auto',
  },
  leftButton: {
    marginRight: 'auto',
  },
  row: {
    display: 'flex',
  },
  chips: {
    textAlign: 'center',
  },
  chipScore: {
    background: '#fedb00',
  },
});

class CardMovie extends PureComponent {
  state = {
    starred: this.props.starred || false,
  };

  handleStarred = async (e) => {
    e.preventDefault();
    try {
      const { id } = this.props;
      const { starred } = this.state;
      const mode = starred ? 'unstarred' : 'starred';
      const response = await fetchHelper.get(`/api/profile/${mode}/${id}`);
      if (response.status !== 200) throw Error('response.status !== 200', response);

      this.setState({ starred: !this.state.starred });
    } catch (err) {
      console.error('handleStarred err', err);
    }
  };

  render() {
    const { classes, title, imagePath, overview, mediaId, seeders, leechers, score } = this.props;
    const { starred } = this.state;

    return (
      <Grid item xs>
        <Link to={`/movie/${mediaId}`} title="watch" className={classes.link}>
          <Card className={classes.card}>
            <img
              className={classes.image}
              src={imagePath ? `http://image.tmdb.org/t/p/w300${imagePath}` : defaultImage}
              title={title}
              alt={title}
            />
            <CardContent className={classes.cardContent}>
              <Typography className={classes.title} gutterBottom variant="headline" component="h2">
                {title}
              </Typography>

              <Grid container spacing={8} className={classes.chips}>
                <Grid item xs={6}>
                  <Chip label={`seeders: ${seeders}`} />
                </Grid>
                <Grid item xs={6}>
                  <Chip label={`leechers: ${leechers}`} />
                </Grid>
                <Grid item xs={12}>
                  <Chip label={`score: ${score}`} className={classes.chipScore} />
                </Grid>
              </Grid>
              <br />
              <Typography component="p">
                {overview || 'No overview available'}
              </Typography>
            </CardContent>
            <CardActions>
              <Button onClick={this.handleStarred} variant={starred ? 'contained' : 'text'} size="small" color="primary" className={classes.leftButton}>
                {starred ? 'Unstar ' : 'Star '}
                <StarIcon />
              </Button>
              <Button size="small" color="primary" className={classes.rightButton}>
                {'Watch now '}
                <PlayIcon />
              </Button>
            </CardActions>
          </Card>
        </Link>
      </Grid>
    );
  }
}

CardMovie.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  mediaId: PropTypes.string.isRequired,
  imagePath: PropTypes.string,
  overview: PropTypes.string,
  seeders: PropTypes.number,
  leechers: PropTypes.number,
  score: PropTypes.string,
};

export default withStyles(styles)(CardMovie);
