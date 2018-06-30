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
import Refresh from '@material-ui/icons/Refresh';
import Divider from '@material-ui/core/Divider';

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
    <Divider />

    {/* todo: theses two following items need auth*/}
    <Link to="/starred" className={classes.link}>
      <ListItem button>
        <ListItemIcon>
          <StarIcon />
        </ListItemIcon>
        <ListItemText primary="Starred" />
      </ListItem>
    </Link>
    <Divider />

    <Link to="/saw" className={classes.link}>
      <ListItem button>
        <ListItemIcon>
          <Refresh />
        </ListItemIcon>
        <ListItemText primary="Saw" />
      </ListItem>
    </Link>

  </div>
);

Menu.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Menu);
