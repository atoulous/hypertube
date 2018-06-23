import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';

const renderInput = (inputProps) => {
  const { classes, ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: ref,
        classes: {
          input: classes.input,
        },
        ...other,
      }}
    />
  );
};

const styles = theme => ({
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  margin: {
    margin: theme.spacing.unit,
  },
});

class IntegrationAutosuggest extends Component {
  state = {
    value: '',
  };

  handleSuggestionsFetchRequested = async ({ value }) => {
    const inputValue = value.trim().toLowerCase();
    this.props.handleSearch({ term: inputValue });
  };

  handleSuggestionsClearRequested = () => {
    this.props.handleClearSearch();
  };

  handleChange = (event, { newValue }) => {
    this.setState({ value: newValue || '' });
  };

  render() {
    const { classes } = this.props;

    return (
      <Autosuggest
        theme={{
          container: classes.container,
        }}
        renderInputComponent={renderInput}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        getSuggestionValue={() => {}}
        renderSuggestion={() => {}}
        suggestions={[]}
        inputProps={{
          classes,
          placeholder: 'Search in library',
          value: this.state.value,
          onChange: this.handleChange,
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    );
  }
}

IntegrationAutosuggest.propTypes = {
  classes: PropTypes.object.isRequired,
  handleSearch: PropTypes.func.isRequired,
  handleClearSearch: PropTypes.func.isRequired,
};

export default withStyles(styles)(IntegrationAutosuggest);
