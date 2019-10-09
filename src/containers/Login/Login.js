import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { UPDATE_USER } from '../../store/actions/actionTypes';
import Spinner from '../../components/UI/Spinner/Spinner';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import firebase from "firebase/app";


class Login extends React.Component {

    state = {
        loginForm: {
            lapuNumber: {
                elementType: 'input',
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
                validation: {
                    required: true,
                    length: 10
                },
                isValid: false,
                isTouched: false
            },
            otp: {
                elementType: 'input',
                elementConfig: {
                    type: 'number',
                    placeholder: 'OTP',
                    hidden: true,
                    style: {
                        textAlign: 'center'
                    }
                },
                value: '',
                validation: {
                    required: true,
                    length: 6
                },
                isValid: false,
                isTouched: false,
                isPhoneNumberPresent: false
            }
        },
        isFormValid: false,
        isLoading: false
    }

    checkValidity(value, rules) {
        let isValid = true;

        if (rules.required) {
            isValid = value.trim(' ') !== '' && isValid;
        }

        if (rules.length) {
            isValid = value.trim(' ').length === rules.length && isValid;
        }

        return isValid;
    }

    inputChangeHandler = (event, inputIdentifier) => {

        const updatedForm = {
            ...this.state.loginForm
        };

        const updatedFormElement = {
            ...updatedForm[inputIdentifier]
        };

        updatedFormElement.value = event.target.value;

        if (updatedFormElement.validation) {
            updatedFormElement.isValid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
            updatedFormElement.isTouched = true;
        }
        updatedForm[inputIdentifier] = updatedFormElement;
        // console.log(updatedFormElement);

        let isFormValid = true;
        for (let inputName in updatedForm) {
            isFormValid = updatedForm[inputName].isValid && isFormValid;
        }

        console.log('isFormValid:', isFormValid);


        this.setState({
            loginForm: updatedForm,
            isFormValid: isFormValid
        })

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

    submitPhoneNumberHandler = (event) => {
        event.preventDefault();

        let phoneNumber = this.state.loginForm.phoneNumber.prefixElementConfig.value + this.state.loginForm.phoneNumber.value;
        let appVerifier = window.recaptchaVerifier;
        firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
            .then(confirmationResult => {
                this.setState(prevState => ({
                    loginForm: {
                        ...prevState.loginForm,
                        phoneNumber: {
                            ...prevState.loginForm.phoneNumber,
                            elementConfig: {
                                ...prevState.loginForm.phoneNumber.elementConfig,
                                readOnly: true,
                                style: {
                                    backgroundColor: '#EEE',
                                    color: '#555',
                                }
                            }
                        },
                        otp: {
                            ...prevState.loginForm.otp,
                            elementConfig: {
                                ...prevState.loginForm.otp.elementConfig,
                                hidden: false
                            }
                        }
                    },
                    confirmationResult,
                    isPhoneNumberPresent: true,
                }))
            })
            .catch(error => console.error(error));
    }

    onSignInSubmit = () => {
        console.log('Inside onSignInSubmit');
        console.log('----------------');
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

    render() {

        if (this.props.isAuthenticated) {
            return <Redirect to='/' />
        }

        let formElementsArray = [];
        for (let key in this.state.loginForm) {
            formElementsArray.push({
                id: key,
                config: this.state.loginForm[key]
            });
        }
        let submitFormButton = null;
        if (!this.state.isPhoneNumberPresent) {
            submitFormButton = <Button buttonType="Success" onClick={this.submitPhoneNumberHandler}>Send OTP</Button>;
        } else {
            submitFormButton = <Button buttonType="Success" onClick={this.submitOTPHandler}>Submit OTP</Button>;
        }


        let form = <Spinner />;
        if (!this.state.isLoading) {
            form = (
                <form>
                    <TextField
                        {...this.state.loginForm.lapuNumber.elementConfig}
                        value={this.state.loginForm.lapuNumber.value}
                        onChange={(event) => this.inputChangeHandler(event, this.state.loginForm.lapuNumber)}
                        fullWidth
                        inputProps={this.state.loginForm.lapuNumber.inputProps}
                        variant="outlined"
                        margin="dense"
                    />
                    <Button variant="contained" color="primary" fullWidth type="submit" style={{margin: '15px 0'}}>Request OTP</Button>
                </form>
            )
            //#region old form
            // form = (
            //     <form>
            //         {
            //             formElementsArray.map(formElement => {
            //                 if (!formElement.config.elementConfig.hidden) {
            //                     return (
            //                         <Input
            //                             key={formElement.id}
            //                             elementType={formElement.config.elementType}
            //                             elementConfig={formElement.config.elementConfig}
            //                             prefixElementConfig={formElement.config.prefixElementConfig}
            //                             value={formElement.config.value}
            //                             onChange={(event) => this.inputChangeHandler(event, formElement.id)}
            //                             isValidationRequired={formElement.config.validation}
            //                             valid={formElement.config.isValid}
            //                             touched={formElement.config.isTouched}
            //                         />
            //                     )
            //                 } else {
            //                     return null;
            //                 }
            //             })
            //         }
            //         {submitFormButton}
            //     </form>);
            //#endregion
        }

        return (
            <div>
                <div id='sign-in-button'></div>
                {form}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.isAuthenticated
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateUser: userDetails => dispatch({ type: UPDATE_USER, user: userDetails })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);