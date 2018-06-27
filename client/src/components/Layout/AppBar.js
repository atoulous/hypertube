import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    background: 'linear-gradient(to left, #4b79a1, #283e51)',
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  homeButton: {
    color: 'white',
    textDecoration: 'none',
  },
  menuUser: {
    marginLeft: 'auto',
  },
  link: {
    color: 'black',
    textDecoration: 'none',
  },
});

class Bar extends Component {
  state = {
    auth: true,
    anchorEl: null,
    redirect: null,
  };

  handleMenu = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleLogOut = () => {
    const cookies = new Cookies();
    cookies.remove('authtoken');
    this.setState({ redirect: '/' });
  };

  render() {
    const { classes, handleDrawerToggle } = this.props;
    const { auth, anchorEl, redirect } = this.state;
    const open = Boolean(anchorEl);

    if (redirect) return (<Redirect to={redirect} />);

    return (
      <AppBar position="absolute" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            className={classes.navIconHide}
          >
            <MenuIcon />
          </IconButton>
          <Link to="/" title="Home" className={classes.homeButton}>
            <Typography
              variant="title"
              color="inherit"
            >
              Hypertube
            </Typography>
          </Link>

          {auth && (
            <div className={classes.menuUser}>
              <IconButton
                aria-owns={open ? 'menu-appbar' : null}
                aria-haspopup="true"
                onClick={this.handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={this.handleClose}
              >
                <MenuItem onClick={this.handleClose}><Link className={classes.link} to="/profile">My account</Link></MenuItem>
                <MenuItem onClick={this.handleLogOut}>Log out</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Bar);
