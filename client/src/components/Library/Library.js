import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import uniqBy from 'lodash/uniqBy';
import cookie from 'universal-cookie';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

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
    textAlign: 'center',
  },
};

class Library extends Component {
  state = {
    tabsValue: this.props.match.params.tabsValue || 'all',
    medias: [],
    skip: 0,
    hasMore: false,
    term: null,
    loading: false,
  };

  async componentDidMount() {
    try {
      const { tabsValue } = this.state;
      const medias = await this.getLocalMedias({ tabsValue });
      const hasMore = !!medias.length;

      this.setState({ medias, hasMore });
    } catch (err) {
      console.error('componentDidMount err: ', err);
    }
  }

  getCrawlerMedias = async ({ tabsValue = 'all', term = null }) => {
    try {
      const response = await fetch(`/api/media/crawler/${tabsValue}/${term}`);
      const body = await response.json();
      if (response.status === 401) console.log('401')
      else if (response.status !== 200) throw Error(body.message);

      return body;
    } catch (err) {
      throw err;
    }
  };

  getLocalMedias = async ({ tabsValue = 'all', skip = 0, term = null }) => {
    try {
      const cookies = new cookie();
      const token = cookies.get('authtoken');
      const response = await fetch(`/api/media/local/${tabsValue}/${skip}/${term}`,{
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
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
        const { term } = this.state;
        let medias = [];
        if (term && term !== '') {
          medias = await this.getCrawlerMedias({ tabsValue: value, term });
        } else {
          medias = await this.getLocalMedias({ tabsValue: value });
        }
        await this.setState({ medias, tabsValue: value });
      }
    } catch (err) {
      console.error('handleTabs err: ', err);
    }
  };

  handleLoading = async () => {
    try {
      const { medias, tabsValue, skip, term } = this.state;
      const newSkip = skip + nbMediasPerPage;
      const newMedias = await this.getLocalMedias({ tabsValue, skip: newSkip, term });

      const hasMore = !!newMedias.length;

      const mediasToDisplay = uniqBy(medias.concat(newMedias), '_id');

      this.setState({ medias: mediasToDisplay, skip: newSkip, hasMore });
    } catch (err) {
      console.error('handleLoading err: ', err);
    }
  };

  handleAutoComplete = async ({ term }) => {
    try {
      if (term) {
        const { tabsValue } = this.state;

        this.setState({ loading: true });

        const medias = await this.getCrawlerMedias({ tabsValue, term });
        const hasMore = !!medias.length;

        this.setState({ medias, hasMore, term, loading: false });
      }
    } catch (err) {
      console.error('handleAutoComplete err: ', err);
    }
  };

  handleClearSearch = async () => {
    try {
      const { tabsValue } = this.state;
      const medias = await this.getLocalMedias({ tabsValue });
      const hasMore = !!medias.length;

      this.setState({ medias, hasMore });
    } catch (err) {
      console.error('handleClearSearch err: ', err);
    }
  };

    render() {
    const { classes } = this.props;
    const { medias, tabsValue, hasMore, loading } = this.state;

    const Loader = () => (<div className={classes.loader}><CircularProgress /></div>);

    return (
      <div className={classes.root}>
        <Typography className={classes.title} gutterBottom variant="headline" component="h1">
          Library
        </Typography>
        <AutoComplete handleSearch={this.handleAutoComplete} handleClearSearch={this.handleClearSearch} />

        <TabsLibrary handleTabs={this.handleTabs} tabsValue={tabsValue} />

        { loading && <Loader /> }

        <InfiniteScroll
          pageStart={0}
          loadMore={this.handleLoading}
          hasMore={hasMore}
          loader={<Loader key={0} />}
          useWindow
        >
          <Grid container spacing={24} style={{ margin: 'auto' }}>
            {
              medias.map((media) => {
                const title = media.metadatas ? media.metadatas.name : media.displayName;
                const overview = media.metadatas ? media.metadatas.overview : null;
                const score = media.metadatas ? media.metadatas.score : null;
                let imagePath = media.metadatas ? media.metadatas.posterPath || media.metadatas.backdropPath : null;

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
                    score={score}
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
