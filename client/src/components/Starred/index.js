import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import uniqBy from 'lodash/uniqBy';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import TabsLibrary from '../Library/TabsLibrary';
import CardMovie from '../CardMovie';

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

class Starred extends Component {
  state = {
    tabsValue: this.props.match.params.tabsValue || 'all',
    medias: [],
    skip: 0,
    hasMore: false,
    loading: false,
  };

  async componentDidMount() {
    try {
      const { tabsValue } = this.state;
      const medias = await this.getStarred({ tabsValue });
      const hasMore = !!medias.length;

      this.setState({ medias, hasMore });
    } catch (err) {
      console.error('componentDidMount err: ', err);
    }
  }

  getStarred = async ({ tabsValue = 'all', skip = 0 }) => {
    try {
      // TODO: change route to fetch the starred medias
      const response = await fetch(`/api/media/local/${tabsValue}/${skip}/${null}`);
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
        const medias = await this.getStarred({ tabsValue: value });
        await this.setState({ medias, tabsValue: value });
      }
    } catch (err) {
      console.error('handleTabs err: ', err);
    }
  };

  handleLoading = async () => {
    try {
      const { medias, tabsValue, skip } = this.state;
      const newSkip = skip + nbMediasPerPage;
      const newMedias = await this.getStarred({ tabsValue, skip: newSkip });

      const hasMore = !!newMedias.length;

      const mediasToDisplay = uniqBy(medias.concat(newMedias), '_id');

      this.setState({ medias: mediasToDisplay, skip: newSkip, hasMore });
    } catch (err) {
      console.error('handleLoading err: ', err);
    }
  };

  render() {
    const { classes } = this.props;
    const { medias, tabsValue, hasMore, loading } = this.state;

    const Loader = () => (<div className={classes.loader}><CircularProgress /></div>);

    return (
      <div className={classes.root}>
        <Typography className={classes.title} gutterBottom variant="headline" component="h1">
          Starred by you
        </Typography>
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

Starred.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Starred);
