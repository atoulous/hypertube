import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import TabsLibrary from './TabsLibrary';
import CardMovie from '../CardMovie';

const styles = {
  title: {
    textAlign: 'center',
  },
};

class Library extends Component {
  state = {
    tabsValue: this.props.match.params.tabsValue || 'all',
    medias: [],
  };

  async componentDidMount() {
    try {
      const medias = await this.getMedias();
      this.setState({ medias });
    } catch (err) {
      console.error('componentDidMount err: ', err);
    }
  }

  getMedias = async (type = 'all') => {
    try {
      const response = await fetch(`/api/media/${type}`);
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
        const medias = await this.getMedias(value);
        await this.setState({ medias, tabsValue: value });
      }
    } catch (err) {
      console.error('handleTabs err: ', err);
    }
  };

  render() {
    const { classes } = this.props;
    const { medias, tabsValue } = this.state;

    return (
      <div>
        <Typography className={classes.title} gutterBottom variant="headline" component="h1">
          Library
        </Typography>
        <TabsLibrary handleTabs={this.handleTabs} tabsValue={tabsValue} />
        <Grid container spacing={24}>
          {
              medias.map((media) => {
                // console.log('media==', media);

                const title = media.metadatas ? media.metadatas.name : media.displayName;
                const resume = media.metadatas ? media.metadatas.overview : null;
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
                    resume={resume}
                  />
                );
              })
            }
        </Grid>
      </div>
    );
  }
}

Library.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Library);
