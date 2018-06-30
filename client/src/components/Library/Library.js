import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import uniqBy from 'lodash/uniqBy';
import { Redirect } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import TabsLibrary from './TabsLibrary';
import CardMovie from '../CardMovie';
import AutoComplete from '../AutoComplete';
import DatePickers from '../DatePickers';

import fetchHelper from '../../helpers/fetch';
import Checktoken from '../CheckToken';

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
    redirect: null,
    date: {
      start: 1950,
      end: 2018,
    },
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

  getCrawlerMedias = async ({ tabsValue = 'all', term = null, sortedBy = 'displayName' }) => {
    try {
      const response = await fetchHelper.get(`/api/media/crawler/${tabsValue}/${term}/${sortedBy}`);
      const body = await response.json();

      if (response.status !== 200) throw Error(body.merror);

      return body;
    } catch (err) {
      throw err;
    }
  };

  getLocalMedias = async ({ tabsValue = 'all', skip = 0, term = null, sortedBy = null, date = null }) => {
    try {
      const { start, end } = date || this.state.date;
      const response = await fetchHelper.get(`/api/media/local/${tabsValue}/${skip}/${term}/${sortedBy}/${start}/${end}`);

      const body = await response.json();

      // if (body && body.profile === false) {
      //   this.setState({ redirect: '/profile' });
      // }

      if (response.status !== 200) throw Error(body.merror);

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

  handleChangeDate = async ({ name, value }) => {
    const { date } = this.state;
    date[name] = value;
    const medias = await this.getLocalMedias({ date });
    const hasMore = !!medias.length;

    this.setState({ medias, date, hasMore });
  };

  render() {
    const { classes } = this.props;
    const { medias, tabsValue, hasMore, loading, redirect, date } = this.state;

    const Loader = () => (<div className={classes.loader}><CircularProgress /></div>);

    if (redirect) return (<Redirect to={redirect} />);

    return (
      <div className={classes.root}>
        <Checktoken/>
        <Typography className={classes.title} gutterBottom variant="headline" component="h1">
          Library
        </Typography>
        <AutoComplete handleSearch={this.handleAutoComplete} handleClearSearch={this.handleClearSearch} />

        <DatePickers handleChangeDate={this.handleChangeDate} date={date} />

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
                    id={media._id}
                    title={title}
                    mediaId={media._id}
                    magnet={media.magnet}
                    imagePath={imagePath}
                    overview={overview}
                    seeders={media.seeders}
                    leechers={media.leechers}
                    score={score}
                    starred={media.starred}
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
