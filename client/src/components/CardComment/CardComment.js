import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';

import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';

import Moment from 'moment';


const styles = () => ({
  card: {
    width: 300,
    height: 450,
  },
  link: {
    textDecoration: 'none',
  },
  cardContent: {
    height: 200,
    overflow: 'auto',
  },
  image: {
    width: '50%',
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

class CardComment extends PureComponent {

  handleStarred = (e) => {
    e.preventDefault();
  };

  render() {

      Moment.locale('en');
      const { classes, title, imagePath, date, comment} = this.props;
      const stringdate = Moment(date).format('d MMM')

    return (
      <Grid item xs>

          <Card className={classes.card}>
            <img
                className={classes.image}
                src={imagePath}
                alt='profile'
            />
            <p>
                {stringdate}
            </p>
            <p>
                {comment}
            </p>
            <CardContent className={classes.cardContent}>
              <Typography className={classes.title} gutterBottom variant="headline" component="h2">
                <Link to={`/otherprofile/${title}`} title="user" className={classes.link}>
                  {title}
                </Link>
              </Typography>

              <br />

            </CardContent>
          </Card>

      </Grid>
    );
  }
}



export default withStyles(styles)(CardComment);
