import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
});

class DatePickers extends Component {
  state = {
    start: 1950,
    end: 2018,
  };

  handleChange = name => (event) => {
    console.log('name/event', name, event);

    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <form className={classes.container} noValidate>
        <TextField
          id="start"
          label="start"
          value={this.state.start}
          type="number"
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
          onChange={this.handleChange('start')}
        />
        <TextField
          id="end"
          label="end"
          value={this.state.end}
          type="number"
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
          onChange={this.handleChange('end')}
        />
      </form>
    );
  }
}
DatePickers.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DatePickers);
