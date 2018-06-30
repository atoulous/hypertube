import React, { Component } from 'react';
import { Redirect } from 'react-router';
import fetchHelper from '../../helpers/fetch';
import cookies from 'universal-cookie';


class CheckToken extends Component {
  state = {
  	redirect: null,
  }

    componentDidMount() {
        this.checkToken()
            .then((res) => {
                if (res.status === 403) {
                    const cookie = new cookies()
                    cookie.remove('authtoken', { path: '/' });
                    this.setState({ redirect: '/'});
                }
            })
            .catch(err => console.log(err));
    }

    checkToken = async () => {
        const response = await fetchHelper.get('/checktoken');
        return response;
    }

  render() {
    const { redirect } = this.state
    if (redirect) return <Redirect to="/" />;
      return <span></span>
  }
}

export default CheckToken;
