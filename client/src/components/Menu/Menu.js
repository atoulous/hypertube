import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MovieFilterIcon from '@material-ui/icons/MovieFilter';
import LocalMovieIcon from '@material-ui/icons/LocalMovies';
import StarIcon from '@material-ui/icons/Star';
import ListNumberedIcon from '@material-ui/icons/FormatListNumbered';

const Menu = () => (
  <div>
    <ListItem button>
      <ListItemIcon>
        <LocalMovieIcon />
      </ListItemIcon>
      <ListItemText primary="Movies" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <MovieFilterIcon />
      </ListItemIcon>
      <ListItemText primary="Series" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <ListNumberedIcon />
      </ListItemIcon>
      <ListItemText primary="Top 10" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <StarIcon />
      </ListItemIcon>
      <ListItemText primary="Starred" />
    </ListItem>
  </div>
);

export default Menu;
