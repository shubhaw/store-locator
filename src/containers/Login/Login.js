import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Typography, Grid, Switch, Button, TextField } from '@material-ui/core';
import { checkFSEinFirestore, checkTMinFirestore } from '../../store/actions/actions';
import firebase from "firebase/app";
import { UPDATE_USER } from '../../store/actions/actionTypes';
import Error from '../../components/UI/Error/Error';

class Login extends React.Component {

    state = {
        lapuNumber: {
            elementConfig: {
                type: 'number',
                label: 'LAPU Number',
                placeholder: 'LAPU Number',
                required: true
            },
            inputProps: {
                readOnly: false,
                min: 1000000000,
                max: 9999999999
            },
            value: '',
        },
        otp: {
            elementConfig: {
                type: 'number',
                label: 'OTP',
                placeholder: 'OTP',
                required: true
            },
            inputProps: {
                readOnly: false,
                min: 100000,
                max: 999999
            },
            value: '',
        },
        isTM: false,
        isFirstUpdate: true
    }

    inputChangeHandler = (event, inputIdentifier) => {
        const value = event.target.value;
        this.setState(prevState => ({
            [inputIdentifier]: {
                ...prevState[inputIdentifier],
                value
            }
        }));
    }


    fseOrTmSwitchHandler = (event) => {
        const isTM = event.target.checked;
        this.setState({
            isTM
        })
    }

    onLapuNumberSubmit = (event) => {
        event.preventDefault();

        if (this.state.isTM) {
            this.props.isTMValid(this.state.lapuNumber.value);
        } else {
            this.props.isFSEValid(this.state.lapuNumber.value);
        }
    }

    componentDidMount() {
        console.log('Loaded!!!!')
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
            'size': 'invisible',
            'callback': (response) => {
                console.log('reCAPTCHA solved!');
                console.log(response);
                console.log('----------------');
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                this.onSignInSubmit();
            }
        });
    }

    componentDidUpdate() {
        if ((this.props.isFseLapuNumberValid || this.props.isTmLapuNumberValid) && this.state.isFirstUpdate) {
            console.log('inside component did update');
            this.sendOtpToPhone();
        }
    }


    componentWillUnmount() {
        console.log(this.props)
        console.log('componentWillUnmount')
    }

    
    onSignInSubmit = () => {
        console.log('Inside onSignInSubmit');
        console.log('----------------');
    }

    sendOtpToPhone = () => {
        let phoneNumber = '+91' + this.state.lapuNumber.value;
        let appVerifier = window.recaptchaVerifier;
        firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
            .then(confirmationResult => {
                this.setState({
                    confirmationResult,
                    isFirstUpdate: false
                })
            })
            .catch(err => console.error(err));
    }

    submitOTPHandler = event => {
        event.preventDefault();
        const { confirmationResult } = this.state;
        const otp = this.state.otp.value;
        confirmationResult.confirm(otp)
            .then(user => {
                const userDetails = {
                    lapuNumber: (user.user.phoneNumber).substr(3)
                }

                this.props.updateUser(userDetails);
                this.props.history.replace('/');

                //#region newUserCheck
                // const isNewUser = user.additionalUserInfo.isNewUser;
                // console.log('[Login] isNewUser:', isNewUser);
                // if (user && isNewUser) {
                //     this.props.history.replace('/create-profile');
                // } else {
                //     this.props.history.replace('/');
                // }
                //#endregion
            })
            .catch(error => console.error(error));
    }

    render() {
        if (this.props.user && this.props.user.lapuNumber) {
            console.log('redirecting from inside if condition')
            return (
                <React.Fragment>
                    <div id='sign-in-button'></div>
                    <Redirect to="/" />
                </React.Fragment>
            )
        }

        const fseOrTmSwitch = (
            <Typography component="div">
                <Grid component="label" container alignItems="center" spacing={1}>
                    <Grid item>FSE</Grid>
                    <Grid item>
                        <Switch
                            checked={this.state.isTM}
                            color="default"
                            disabled={this.props.isFseLapuNumberValid || this.props.isTmLapuNumberValid}
                            onChange={this.fseOrTmSwitchHandler}
                        />
                    </Grid>
                    <Grid item>TM</Grid>
                </Grid>
            </Typography>
        );

        let lapuNumberForm = null;
        let otpForm = null;
        if (this.props.isFseLapuNumberValid || this.props.isTmLapuNumberValid) {
            lapuNumberForm = (
                <form onSubmit={this.onLapuNumberSubmit}>
                    <TextField
                        disabled
                        {...this.state.lapuNumber.elementConfig}
                        inputProps={this.state.lapuNumber.inputProps}
                        value={this.state.lapuNumber.value}
                        onChange={(event) => this.inputChangeHandler(event, 'lapuNumber')}
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        style={{ margin: '10px 0' }}
                    />
                </form>
            )

            otpForm = (
                <form onSubmit={this.submitOTPHandler}>
                    <TextField
                        {...this.state.otp.elementConfig}
                        inputProps={this.state.otp.inputProps}
                        value={this.state.otp.value}
                        onChange={(event) => this.inputChangeHandler(event, 'otp')}
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        style={{ margin: '10px 0' }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        type="submit"
                    >
                        Submit OTP
                    </Button>
                </form>
            )
        } else {
            lapuNumberForm = (
                <form onSubmit={this.onLapuNumberSubmit}>
                    <TextField
                        {...this.state.lapuNumber.elementConfig}
                        inputProps={this.state.lapuNumber.inputProps}
                        value={this.state.lapuNumber.value}
                        onChange={(event) => this.inputChangeHandler(event, 'lapuNumber')}
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        style={{ margin: '10px 0' }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        type="submit"
                    >
                        Get OTP
                    </Button>
                </form>
            )
        }

        return (
            <React.Fragment>
                <div id='sign-in-button'></div>
                {fseOrTmSwitch}
                {lapuNumberForm}
                {otpForm}
                <Error text={this.props.error} />
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user.user,
    error: state.user.error,
    isFseLapuNumberValid: state.user.user ? (state.user.user.managerLapuNumber ? true : false) : false,
    isTmLapuNumberValid: state.user.isTmLapuNumberValid
});

const mapDispatchToProps = dispatch => ({
    isFSEValid: lapuNumber => dispatch(checkFSEinFirestore(lapuNumber)),
    isTMValid: lapuNumber => dispatch(checkTMinFirestore(lapuNumber)),
    updateUser: userDetails => dispatch({ type: UPDATE_USER, user: userDetails })
})

export default connect(mapStateToProps, mapDispatchToProps)(Login);