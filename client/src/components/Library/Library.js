import React from 'react';

import Grid from '@material-ui/core/Grid';

import CardMovie from '../CardMovie';

const Library = () => (
  <div>
    <h1>Library</h1>
    <Grid container spacing={24}>
      <Grid item xs={6} sm={3}>
        <CardMovie />
      </Grid>
      <Grid item xs={6} sm={3}>
        <CardMovie />
      </Grid>
      <Grid item xs={6} sm={3}>
        <CardMovie />
      </Grid>
    </Grid>
  </div>
);

export default Library;
