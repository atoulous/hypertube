import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import TabsLibrary from '../Library/TabsLibrary';
import CardMovie from '../CardMovie';

import fetchHelper from '../../helpers/fetch';

const styles = {
  title: {
    textAlign: 'center',
  },
  root: {
    flexGrow: 1,
  },
  loader: {
    margin: 'auto',
    textAlign: 'center',
  },
};

class Starred extends Component {
  state = {
    skip: 0,
    medias: [],
    tabsValue: this.props.match.params.tabsValue || 'all',
  };

  async componentDidMount() {
    try {
      this.getMediasSeen({});
    } catch (err) {
      console.error('componentDidMount err: ', err);
    }
  }

  getMediasSeen = async ({ tabsValue = 'all', sortedBy = 'lastSeen' }) => {
    let type = 'all';
    switch (tabsValue) {
      case 'movies':
        type = 'movie';
        break;
      case 'shows':
        type = 'show';
        break;
      default:
        type = 'all';
    }
    const response = await fetchHelper.get(`/api/media/starred/${type}/${sortedBy}`);
    const medias = await response.json();

    if (response.status !== 200) throw Error(medias.merror);


    this.setState({ medias, tabsValue });
  };

  handleTabs = async (event, tabsValue) => {
    try {
      if (this.state.tabsValue !== tabsValue) {
        this.getMediasSeen({ tabsValue });
      }
    } catch (err) {
      console.error('handleTabs err: ', err);
    }
  };

  render() {
    const { classes } = this.props;
    const { medias, tabsValue, loading } = this.state;

    const Loader = () => (<div className={classes.loader}><CircularProgress /></div>);

    return (
      <div className={classes.root}>
        <Typography className={classes.title} gutterBottom variant="headline" component="h1">
          Medias starred
        </Typography>

        <TabsLibrary handleTabs={this.handleTabs} tabsValue={tabsValue} />

        { loading && <Loader /> }
        <Grid container spacing={24} style={{ margin: 'auto' }}>
          {
            medias.map((media) => {
              const title = media.metadatas ? media.metadatas.name : media.displayName;
              const overview = media.metadatas ? media.metadatas.overview : null;
              const score = media.metadatas ? media.metadatas.score : null;
              const imagePath = media.metadatas ? media.metadatas.posterPath || media.metadatas.backdropPath : null;

              return (
                <CardMovie
                  key={media._id}
                  id={media._id}
                  title={title}
                  mediaId={media._id}
                  magnet={media.magnet}
                  imagePath={imagePath}
                  overview={overview}
                  seeders={media.seeders}
                  leechers={media.leechers}
                  score={score}
                  starred
                />
              );
            })
          }

        </Grid>
      </div>
    );
  }
}


Starred.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Starred);
