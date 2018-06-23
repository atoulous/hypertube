import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import debounce from 'lodash/debounce';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';

const debounceTime = 1000;

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

  handleFetch = async (reason) => {
    if (reason === 'input-changed') {
      console.log('handleSuggestionsFetchRequested', reason);

      const inputValue = this.state.value.trim().toLowerCase();
      await this.props.handleSearch({ term: inputValue });
    }
  };

  handleDebounce = debounce(this.handleFetch, debounceTime);

  handleSuggestionsFetchRequested = ({ reason }) => {
    this.handleDebounce(reason)
  };

  handleSuggestionsClearRequested = () => {
    this.props.handleClearSearch();
  };

  handleChange = (event, props) => {
    this.setState({ value: props.newValue || '' });
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
          placeholder: 'Search',
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
