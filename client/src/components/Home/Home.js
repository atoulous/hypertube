import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './Home.scss';

class Home extends Component {
  state = {
    response: '',
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }


  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  render() {
    return (
      <div className="App">
        <h1>{this.state.response}</h1>
        <Link to="/library">Go to library</Link>
      </div>
    );
  }
}

export default Home;
