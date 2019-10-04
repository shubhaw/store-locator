import React from 'react';
import Spinner from '../../components/UI/Spinner/Spinner';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import firebase from "firebase/app";
import firebaseApp from '../../config/Firebase/firebase';

class Login extends React.Component {

    state = {
        loginForm: {
            phoneNumber: {
                elementType: 'input-group',
                prefixElementConfig: {
                    type: 'text',
                    value: '+91',
                    readOnly: true,
                    style: {
                        backgroundColor: '#EEE',
                        color: '#555',
                        width: '60px',
                        marginRight: '10px'
                    }
                },
                elementConfig: {
                    type: 'number',
                    placeholder: 'Phone Number',
                    readOnly: false
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
                console.log(user);
                console.log('[isNewUser]:', user.additionalUserInfo.isNewUser);
                if(user && user.additionalUserInfo.isNewUser) {
                    this.props.history.replace('/create-profile'); //replace as we don't want to navigate back to login and neither to '/'
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

        firebaseApp.auth().onAuthStateChanged(user => {
            if (user) {
                console.log('[componentDidMount] user found');
                console.log(user);
                console.log('----------------');
                this.props.history.push('/');
            }
        });
    }
    render() {
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

        // if (!this.state.isFormValid) {
        //     submitFormButton = <Button buttonType="Success" disabled>Submit</Button>;
        // }

        let form = <Spinner />;
        if (!this.state.isLoading) {
            form = (
                <form
                // onSubmit={this.submitOTPHandler}
                >
                    {
                        formElementsArray.map(formElement => {
                            if (!formElement.config.elementConfig.hidden) {
                                return (
                                    <Input
                                        key={formElement.id}
                                        elementType={formElement.config.elementType}
                                        elementConfig={formElement.config.elementConfig}
                                        prefixElementConfig={formElement.config.prefixElementConfig}
                                        value={formElement.config.value}
                                        onChange={(event) => this.inputChangeHandler(event, formElement.id)}
                                        isValidationRequired={formElement.config.validation}
                                        valid={formElement.config.isValid}
                                        touched={formElement.config.isTouched}
                                    />
                                )
                            } else {
                                return null;
                            }
                        })
                    }
                    {submitFormButton}
                </form>);
        }

        return (
            <div>
                <div id='sign-in-button'></div>
                {form}
            </div>
        )
    }
}

export default Login;