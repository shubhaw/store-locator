import React from 'react'

import { connect } from 'react-redux';
import Snackbar from '../../components/UI/Snackbar/Snackbar';
import Button from '@material-ui/core/Button';
import { MAKE_SNACKBAR_INVISIBLE, MAKE_SNACKBAR_VISIBLE } from '../../store/actions/actionTypes';

class TestContainer extends React.Component {

    render() {
        console.log('isSnackbarVisible:', this.props.isSnackbarVisible)
        return (
            <React.Fragment>
                <Button variant="outlined" color="secondary" fullWidth onClick={this.props.snackbarOpenHandler}>
                    Open Snackbar
                </Button>
                <Snackbar
                    show={this.props.isSnackbarVisible}
                    message='Response submitted successfully!'
                    autoHideDuration={2000}
                    onSnackbarClose={this.props.snackbarCloseHandler}
                />
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    isSnackbarVisible: state.isSnackbarVisible
});

const mapDispatchToProps = dispatch => ({
    snackbarOpenHandler: () => dispatch({ type: MAKE_SNACKBAR_VISIBLE }),
    snackbarCloseHandler: () => dispatch({ type: MAKE_SNACKBAR_INVISIBLE })
})

export default connect(mapStateToProps, mapDispatchToProps)(TestContainer);