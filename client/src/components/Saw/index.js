import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import TabsLibrary from '../Library/TabsLibrary';
import CardMovie from '../CardMovie';
import AutoComplete from '../AutoComplete';

import fetchHelper from '../../helpers/fetch';

const styles = {
  title: {
    textAlign: 'center',
  },
};

class Saw extends Component {
  state = {
    medias: [],
    hasMore: false,
  };

  async componentDidMount() {
    try {
      // const { tabsValue } = this.state;
      const response = await fetchHelper.get('/api/media/saw');
      const medias = await response.json();

      if (response.status !== 200) throw Error(medias.merror);

      const hasMore = !!medias.length;

      this.setState({ medias, hasMore });
    } catch (err) {
      console.error('componentDidMount err: ', err);
    }
  }

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
                const imagePath = media.metadatas ? media.metadatas.posterPath || media.metadatas.backdropPath : null;

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


Saw.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Saw);
