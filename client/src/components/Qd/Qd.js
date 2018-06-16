import React, { Component } from 'react';

import './Qd.css';

class Qd extends Component {
  state = {
    response: '',
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/auth/qd',
	);
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  render() {
    return (
	<div class="container">
		Qd
	</div>
    );
  }
}

export default Qd;
