import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import StarIcon from '@material-ui/icons/Star';
import ListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import VideoLibrary from '@material-ui/icons/VideoLibrary';

const styles = {
  link: {
    textDecoration: 'none',
  },
};

const Menu = ({ classes }) => (
  <div>
    <Link to="/library" className={classes.link}>
      <ListItem button>
        <ListItemIcon>
          <VideoLibrary />
        </ListItemIcon>
        <ListItemText primary="Library" />
      </ListItem>
    </Link>

    <Link to="/library" className={classes.link}>
      <ListItem button>
        <ListItemIcon>
          <ListNumberedIcon />
        </ListItemIcon>
        <ListItemText primary="Top 10" />
      </ListItem>
    </Link>

    <Link to="/library" className={classes.link}>
      <ListItem button>
        <ListItemIcon>
          <StarIcon />
        </ListItemIcon>
        <ListItemText primary="Starred" />
      </ListItem>
    </Link>

  </div>
);

Menu.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Menu);