import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';

import { addUserInFirestore } from '../../store/actions/actions';


class CreateProfile extends React.Component {
    state = {
        profileForm: {
            employeeId: {
                elementType: 'input',
                elementConfig: {
                    type: 'number',
                    placeholder: 'Employee Id'
                },
                value: '',
                validation: {
                    required: true
                },
                isValid: false,
                isTouched: false
            },
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Name'
                },
                value: '',
                validation: {
                    required: true
                },
                isValid: false,
                isTouched: false
            },
            phoneNumber: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Phone Number',
                    readOnly: true
                },
                value: '',
                validation: {
                    required: true
                },
                isValid: true,
                isTouched: false
            },
            reportsTo: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Reports To'
                },
                value: '',
                validation: {
                    required: true
                },
                isValid: false,
                isTouched: false
            },
        },
        isFormValid: false,
        isLoading: false
    }

    checkValidity(value, rules) {
        let isValid = true;

        if (rules.required) {
            isValid = value.trim(' ') !== '' && isValid;
        }

        if (rules.minLength) {
            isValid = value.trim(' ').length >= rules.minLength && isValid;
        }

        if (rules.maxLength) {
            isValid = value.trim(' ').length <= rules.maxLength && isValid;
        }

        if (rules.min) {
            isValid = parseInt(value.trim(' ')) >= rules.min && isValid;
        }

        if (rules.max) {
            isValid = parseInt(value.trim(' ')) <= rules.max && isValid;
        }

        return isValid;
    }

    inputChangeHandler = (event, inputIdentifier) => {

        const updatedForm = {
            ...this.state.profileForm
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
            profileForm: updatedForm,
            isFormValid: isFormValid
        })

    }

    createProfileHandler = (event) => {
        event.preventDefault();

        this.setState({
            isLoading: true
        });

        let profileDetails = {};
        for (let formElementName in this.state.profileForm) {
            profileDetails[formElementName] = this.state.profileForm[formElementName].value;
        }

        this.props.createProfileHandler(profileDetails);
    }

    componentDidMount() {
        this.setState(prevState => ({
            profileForm: {
                ...prevState.profileForm,
                phoneNumber: {
                    ...prevState.profileForm.phoneNumber,
                    value: this.props.user.lapuNumber
                }
            }
        }));
    }

    render() {
        console.log(this.props);
        if (!this.props.isNewUser) {
            return <Redirect to="/" />
        }

        let formElementsArray = [];
        for (let key in this.state.profileForm) {
            formElementsArray.push({
                id: key,
                config: this.state.profileForm[key]
            });
        }

        let submitFormButton = <Button buttonType="Success" onClick={this.createProfileHandler}>Create</Button>;
        if (!this.state.isFormValid) {
            submitFormButton = <Button buttonType="Success" disabled>Create</Button>;
        }

        let form = <Spinner />;
        if (!this.state.isLoading) {
            form = (
                <form>
                    {
                        formElementsArray.map(formElement => (
                            <Input
                                key={formElement.id}
                                elementType={formElement.config.elementType}
                                elementConfig={formElement.config.elementConfig}
                                value={formElement.config.value}
                                onChange={(event) => this.inputChangeHandler(event, formElement.id)}
                                isValidationRequired={formElement.config.validation}
                                valid={formElement.config.isValid}
                                touched={formElement.config.isTouched}
                            />
                        ))
                    }
                    {submitFormButton}
                </form>);
        }

        return (
            <div>
                {form}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
        isNewUser: state.user.isNewUser
    }
}

const mapDispatchToProps = dispatch => {
    return {
        createProfileHandler: (userDetails) => dispatch(addUserInFirestore(userDetails))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateProfile);