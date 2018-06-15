import React, { PureComponent } from 'react';
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
import StarIcon from '@material-ui/icons/Star';

const defaultImage = 'http://vollrath.com/ClientCss/images/VollrathImages/No_Image_Available.jpg';

const styles = {
  card: {
    width: 300,
    height: 400,
    '&:hover': {
      boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .30)',
    },
  },
  link: {
    textDecoration: 'none',
  },
  cardContent: {
    height: 150,
    overflow: 'auto',
  },
  media: {
    paddingTop: '56.25%', // 16:9
  },
  rightButton: {
    marginLeft: 'auto',
  },
  leftButton: {
    marginRight: 'auto',
  },
};

class CardMovie extends PureComponent {
  handleStarred = (e) => {
    e.preventDefault();
  };

  render() {
    const { classes, title, imagePath, overview, mediaId } = this.props;

    return (
      <Grid item xs={6} sm={3}>
          <Card className={classes.card}>
			  <Link to={`/movie/${mediaId}`} title="watch" className={classes.link}>
            <CardMedia
              className={classes.media}
              image={imagePath ? `http://image.tmdb.org/t/p/w200${imagePath}` : defaultImage}
              title={title}
            />
            <CardContent className={classes.cardContent}>
              <Typography className={classes.title} gutterBottom variant="headline" component="h2">
                {title}
              </Typography>
              <Typography className={classes.cardContent} component="p">
                {overview || 'No overview available'}
              </Typography>
            </CardContent>
            <CardActions>
              <Button onClick={this.handleStarred} size="small" color="primary" className={classes.leftButton}>
                {'Starred '}
                <StarIcon />
              </Button>
            </CardActions>
          </Link>
          </Card>
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
};

export default withStyles(styles)(CardMovie);
