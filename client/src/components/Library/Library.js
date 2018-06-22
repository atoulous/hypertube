import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import uniqBy from 'lodash/uniqBy';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import TabsLibrary from './TabsLibrary';
import CardMovie from '../CardMovie';
import AutoComplete from '../AutoComplete';

const nbMediasPerPage = 10;

const styles = {
  title: {
    textAlign: 'center',
  },
  root: {
    flexGrow: 1,
  },
  loader: {
    margin: 'auto',
  },
};

class Library extends Component {
  state = {
    tabsValue: this.props.match.params.tabsValue || 'all',
    medias: [],
    skip: 0,
    hasMore: false,
    term: null,
  };

  async componentDidMount() {
    try {
      const { tabsValue } = this.state;
      const medias = await this.getMedias({ tabsValue });
      const hasMore = medias.length === nbMediasPerPage;

      this.setState({ medias, hasMore });
    } catch (err) {
      console.error('componentDidMount err: ', err);
    }
  }

  getMedias = async ({ tabsValue = 'all', skip = 0, term = null }) => {
    try {
      const response = await fetch(`/api/media/${tabsValue}/${skip}/${term}`);
      const body = await response.json();

      if (response.status !== 200) throw Error(body.message);

      return body;
    } catch (err) {
      throw err;
    }
  };

  handleTabs = async (event, value) => {
    try {
      if (this.state.tabsValue !== value) {
        const medias = await this.getMedias({ tabsValue: value });
        await this.setState({ medias, tabsValue: value });
      }
    } catch (err) {
      console.error('handleTabs err: ', err);
    }
  };

  handleLoading = async () => {
    console.log('handleLoading', this.state);
    try {
      const { medias, tabsValue, skip, term } = this.state;
      const newSkip = skip + nbMediasPerPage;
      const newMedias = await this.getMedias({ tabsValue, skip: newSkip, term });
      console.log('handleLoading newMedias== ', newMedias);

      const hasMore = newMedias.length === nbMediasPerPage;

      const mediasToDisplay = uniqBy(medias.concat(newMedias), '_id');

      this.setState({ medias: mediasToDisplay, skip: newSkip, hasMore });
    } catch (err) {
      console.error('handleLoading err: ', err);
    }
  };

  handleAutoComplete = async ({ term }) => {
    console.log('handleAutoComplete');
    try {
      const { tabsValue } = this.state;
      console.log('handleAutoComplete term==', term);

      this.setState({ term });

      const medias = await this.getMedias({ tabsValue, term });
      console.log('handleAutoComplete medias==', medias);
      const hasMore = medias.length === nbMediasPerPage;

      this.setState({ medias, hasMore });
    } catch (err) {
      console.error('handleAutoComplete err: ', err);
    }
  };

  render() {
    const { classes } = this.props;
    const { medias, tabsValue, hasMore } = this.state;

    return (
      <div className={classes.root}>
        <Typography className={classes.title} gutterBottom variant="headline" component="h1">
          Library
        </Typography>
        <AutoComplete handleAutoComplete={this.handleAutoComplete} />
        <TabsLibrary handleTabs={this.handleTabs} tabsValue={tabsValue} />

        <InfiniteScroll
          pageStart={0}
          loadMore={this.handleLoading}
          hasMore={hasMore}
          loader={<div className={classes.loader} key={0}>Loading ...</div>}
          useWindow
        >
          <Grid container spacing={24} style={{ margin: 'auto' }}>
            {
              medias.map((media) => {
                // console.log('media==', media);

                const title = media.metadatas ? media.metadatas.name : media.displayName;
                const overview = media.metadatas ? media.metadatas.overview : null;
                let imagePath = media.metadatas ? media.metadatas.posterPath : null;
                if (!imagePath && media.metadatas) {
                  imagePath = media.metadatas.backdropPath || null;
                }
                return (
                  <CardMovie
                    key={media._id}
                    title={title}
                    mediaId={media._id}
                    magnet={media.magnet}
                    imagePath={imagePath}
                    overview={overview}
                    seeders={media.seeders}
                    leechers={media.leechers}
                  />
                );
              })
            }

          </Grid>
        </InfiniteScroll>
      </div>
    );
  }
}

Library.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Library);
