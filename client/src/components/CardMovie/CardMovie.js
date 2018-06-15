import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import PlayArrow from '@material-ui/icons/PlayArrow';
import StarBorder from '@material-ui/icons/StarBorder';

const defaultImage = 'http://vollrath.com/ClientCss/images/VollrathImages/No_Image_Available.jpg';

const styles = {
  card: {
    width: '15rem',
    height: '20rem',
  },
  cardContent: {
    height: '6rem',
    overflowY: 'auto',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  title: {
    height: '15%',
  },
};

class CardMovie extends Component {
  state = {
    learnMore: false,
  };

  handleLearnMore = () => {
    this.setState({ learnMore: !this.state.learnMore });
  };

  render() {
    const { classes, title, magnet, imagePath, overview , mediaId} = this.props;
    const { learnMore } = this.state;

    const DisplayContent = () => {
      if (learnMore) {
        return (
          <Typography className={classes.cardContent} component="p">
            {overview || 'No overview available'}
          </Typography>
        );
      }

      return (
        <Typography className={classes.title} gutterBottom variant="headline" component="h2">
          {title}
        </Typography>
      );
    };

    return (
      <Grid item xs={6} sm={3}>
        <Card className={classes.card}>
          <Link to={`/movie/${mediaId}`} title="Home" className={classes.startMovie}>
            <CardMedia
              className={classes.media}
              image={imagePath ? `http://image.tmdb.org/t/p/w200${imagePath}` : defaultImage}
              title={title}
            />
          </Link>
          <CardContent className={classes.cardContent}>
            <DisplayContent />
          </CardContent>
          <CardActions>
            <Button size="small" color="primary">
              Starred
              <StarBorder />

            </Button>
            <Button onClick={this.handleLearnMore} size="small" color="primary">
              {
                !learnMore ? 'Learn More' : 'back'
              }
              <Link to={`/movie/${mediaId}`} title="Home" className={classes.startMovie}>
                <PlayArrow />
              </Link>
              </Button>
          </CardActions>
        </Card>
      </Grid>
  );
  }
};

CardMovie.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  magnet: PropTypes.string.isRequired,
  imagePath: PropTypes.string,
  overview: PropTypes.string,
};

export default withStyles(styles)(CardMovie);
