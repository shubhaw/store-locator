import React from 'react';
import { connect } from 'react-redux';
import { Typography, Grid, Switch, Button, TextField } from '@material-ui/core';
import { checkFSEinFirestore } from '../../store/actions/actions';
import firebase from "firebase/app";

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
        isLapuNumberValid: false,
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
            console.log('Login for TM is not built yet!');
        } else {
            this.props.isFSEValid(this.state.lapuNumber.value);
            if(this.props.isFseLapuNumberValid) {
                console.log('inside')
            }
        }
    }

    componentDidMount() {
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
        if(this.props.isFseLapuNumberValid && this.state.isFirstUpdate) {
            console.log('inside component did update');
            this.sendOtpToPhone();
        }
    }

    onSignInSubmit = () => {
        console.log('Inside onSignInSubmit');
        console.log('----------------');
    }

    sendOtpToPhone = () => {
        let phoneNumber = '+91' +  this.state.lapuNumber.value;
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

    submitOTPHandler = (event) => {
        event.preventDefault();
        const { confirmationResult } = this.state;
        const otp = this.state.loginForm.otp.value;
        confirmationResult.confirm(otp)
            .then(user => {
                const userDetails = {
                    name: user.user.displayName,
                    phoneNumber: user.user.phoneNumber
                }
                const isNewUser = user.additionalUserInfo.isNewUser;
                console.log('[Login] isNewUser:', isNewUser);

                this.props.updateUser(userDetails, isNewUser);
                if (user && isNewUser) {
                    this.props.history.replace('/create-profile');
                } else {
                    this.props.history.replace('/');
                }
            })
            .catch(error => console.error(error));
    }

    render() {
        const fseOrTmSwitch = (
            <Typography component="div">
                <Grid component="label" container alignItems="center" spacing={1}>
                    <Grid item>FSE</Grid>
                    <Grid item>
                        <Switch
                            checked={this.state.isTM}
                            color="default"
                            onChange={this.fseOrTmSwitchHandler}
                        />
                    </Grid>
                    <Grid item>TM</Grid>
                </Grid>
            </Typography>
        );

        let lapuNumberForm = null;
        let otpForm = null;
        if (this.props.isFseLapuNumberValid) {
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
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    error: state.error,
    isFseLapuNumberValid: state.user ? (state.user.managerId ? true : false) : false
});

const mapDispatchToProps = dispatch => ({
    isFSEValid: lapuNumber => dispatch(checkFSEinFirestore(lapuNumber))
})

export default connect(mapStateToProps, mapDispatchToProps)(Login);