import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';

import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';

import Moment from 'moment';


const styles = () => ({
  card: {
    width: 600,
    height: 300,
  },
  link: {
    textDecoration: 'none',
      textAlign: 'center',
  },
  comment: {
    height: 200,
    overflow: 'auto',
  },
  image: {
    width: '20%',
    float: 'right',
    borderRadius :'50%',
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
            <p>
              <Link to={`/otherprofile/${title}`} title="user" className={classes.link}>
                  {title}
              </Link>
                <br/>
              <span>
                  {stringdate}
              </span>

              <img
                  className={classes.image}
                  src={imagePath}
                  alt='profile'
              />
            </p>
            <Divider />
            <CardContent className={classes.comment}>
                {comment}
            </CardContent>

          </Card>

      </Grid>
    );
  }
}



export default withStyles(styles)(CardComment);
