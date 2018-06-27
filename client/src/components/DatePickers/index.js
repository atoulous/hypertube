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
    start: this.props.date.start,
    end: this.props.date.end,
  };

  handleChange = name => (event) => {
    console.log('handleChange name/event', name, event.target);
    const { value } = event.target;

    this.props.handleChangeDate({ name, value });
    this.setState({
      [name]: value,
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <form className={classes.container} noValidate>
        <TextField
          id="start"
          label="Since"
          value={this.state.start}
          type="number"
          InputProps={{ min: 0, max: 9 }}
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}

          margin="normal"
          onChange={this.handleChange('start')}
        />
        <TextField
          id="end"
          label="To"
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
  date: PropTypes.object.isRequired,
};

export default withStyles(styles)(DatePickers);
