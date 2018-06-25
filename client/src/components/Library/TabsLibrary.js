import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import VideoLibrary from '@material-ui/icons/VideoLibrary';
import MovieFilterIcon from '@material-ui/icons/MovieFilter';
import LocalMovieIcon from '@material-ui/icons/LocalMovies';

const styles = {
  paper: {
    margin: '2%',
  },
};

const TabsLibrary = ({ classes, tabsValue, handleTabs }) => (
  <Paper className={classes.paper}>
    <Tabs
      value={tabsValue}
      onChange={handleTabs}
      fullWidth
      indicatorColor="primary"
      textColor="primary"
      centered
    >
      <Tab icon={<VideoLibrary />} value="all" label="all" />
      <Tab icon={<LocalMovieIcon />} value="movies" label="movies" />
      <Tab icon={<MovieFilterIcon />} value="shows" label="shows" />
    </Tabs>
  </Paper>
);

TabsLibrary.propTypes = {
  classes: PropTypes.object.isRequired,
  tabsValue: PropTypes.string.isRequired,
  handleTabs: PropTypes.func.isRequired,
};


export default withStyles(styles)(TabsLibrary);
