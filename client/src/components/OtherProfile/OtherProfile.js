import React, { Component } from 'react';
import Checktoken from '../CheckToken'

import { withStyles } from '@material-ui/core/styles';

import FetchHelper from '../../helpers/fetch'

const styles = {
    img: {
        width: 'calc(100% - 90%)',
    },
}

class OtherProfile extends Component {
    state = {
        user: {}
    };

    componentDidMount() {
            this.callApi()
                .then((res) => {
                    this.setState({ user: res });
                })
                .catch(err => console.log(err));
    }

    callApi = async () => {
        const { userName } = this.props.match.params;
        const response = await FetchHelper.get(`/api/profile/otherprofile/${userName}`);
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };


  render() {

      const {name, firstname, lastname, picture} = this.state.user
      const {classes} = this.props
      return (
          <div>
            <Checktoken/>
            <p>
                Name : { name }
            </p>
            <p>
                Firstname : { firstname }
            </p>
            <p>
                lastname : { lastname }
            </p>
            <img
                  src={ picture }
                  className={classes.img}
                  alt='profile'
            />
       </div>
      )

  }
}

export default withStyles(styles)(OtherProfile);
