import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';

import Menu from '../Menu';

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: 'black',
  },
  drawerPaper: {
    position: 'relative',
    width: 240,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0, // So the Typography noWrap works
  },
  toolbar: theme.mixins.toolbar,
  homeButton: {
    color: 'white',
    textDecoration: 'none',
  },
});

const Layout = ({ classes, children }) => (
  <div className={classes.root}>
    <AppBar position="absolute" className={classes.appBar}>
      <Toolbar>
        <Link to="/" title="Home" className={classes.homeButton}>
          <Typography variant="title" color="inherit" noWrap>Hypertube</Typography>
        </Link>
      </Toolbar>
    </AppBar>
    <Drawer variant="permanent" classes={{ paper: classes.drawerPaper }}>
      <div className={classes.toolbar} />
      <List>
        <Menu />
      </List>
    </Drawer>
    <main className={classes.content}>
      <div className={classes.toolbar} />
      {children}
    </main>
  </div>
);

Layout.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

export default withStyles(styles)(Layout);
