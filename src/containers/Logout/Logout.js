import React from 'react';
import {connect} from 'react-redux';
import {logoutFromFirestore} from '../../store/actions/actions';
import {Redirect} from 'react-router-dom';

class Logout extends React.Component {

    render() {

        // let redirect = <Redirect to="/" />;
        // if(this.props.user) {
        //     redirect = (
        //         <React.Fragment>
        //             {this.props.logoutFromDb()}
        //             <Redirect to='/login' />
        //         </React.Fragment>
        //     )
        // }

        return (
            <React.Fragment>
                {this.props.logoutFromDb()}
                <Redirect to='/login' />
            </React.Fragment>
        )
    }
}

// const mapStateToProps = state => ({
//     user: state.user
// });

const mapDispatchToProps = dispatch => ({
    logoutFromDb: () => dispatch(logoutFromFirestore())
});

export default connect(null, mapDispatchToProps)(Logout);