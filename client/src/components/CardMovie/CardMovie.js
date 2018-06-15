import React from 'react';
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

const defaultImage = 'http://vollrath.com/ClientCss/images/VollrathImages/No_Image_Available.jpg';

const styles = {
  card: {
    maxWidth: 345,
  },
  cardContent: {
    height: 100,
    overflowY: 'auto',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  title: {
    height: 80,
  },
};

const CardMovie = (props) => {
  const { classes, title, magnet, imagePath, resume, mediaId } = props;

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
        <CardContent>
          <Typography className={classes.title} gutterBottom variant="headline" component="h2">
            {title}
          </Typography>
          <Typography className={classes.cardContent} component="p">
            {resume || 'No resume available'}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" color="primary">
            Starred
          </Button>
          <Button size="small" color="primary">
            Learn More
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

CardMovie.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  magnet: PropTypes.string.isRequired,
  imagePath: PropTypes.string,
  resume: PropTypes.string,
};

export default withStyles(styles)(CardMovie);
