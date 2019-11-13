import React from 'react';
import { connect } from 'react-redux';
import { addStoreToFirestore } from '../../../store/actions/actions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import styleClasses from './AddStore.module.css';
import Spinner from '../../../components/UI/Spinner/Spinner';
import { MAKE_SNACKBAR_INVISIBLE, RESET_STATE } from '../../../store/actions/actionTypes';
import Snackbar from '../../../components/UI/Snackbar/Snackbar';
import Error from '../../../components/UI/Error/Error';
import { Typography } from '@material-ui/core';

class AddStore extends React.Component {
    state = {
        storeForm: {
            retailerLAPUNumber: {
                elementType: 'input',
                elementConfig: {
                    type: 'number',
                    label: 'Retailer LAPU Number',
                    placeholder: 'Retailer LAPU Number',
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
                    min: 1000000000,
                    max: 9999999999
                },
                isValid: false,
                isTouched: false
            },
            whatsapp: {
                elementType: 'input',
                elementConfig: {
                    type: 'number',
                    label: 'Retailer Whatsapp Number',
                    placeholder: 'Retailer Whatsapp Number',
                    required: false
                },
                inputProps: {
                    readOnly: false,
                    min: 1000000000,
                    max: 9999999999
                },
                value: '',
                validation: {
                    required: false,
                    min: 1000000000,
                    max: 9999999999
                },
                isValid: false,
                isTouched: false
            },
            FOSBeat: {
                elementType: 'input',
                elementConfig: {
                    type: 'number',
                    label: 'FOS Beat',
                    placeholder: 'FOS Beat',
                    required: true
                },
                inputProps: {
                    readOnly: true
                },
                value: '',
                isValid: true
            },
            jioTertiary: {
                elementType: 'input',
                elementConfig: {
                    type: 'number',
                    label: 'Jio Tertiary',
                    placeholder: 'Jio Tertiary',
                    required: true
                },
                inputProps: {
                    readOnly: false
                },
                value: '',
                validation: {
                    required: true
                },
                isValid: false,
                isTouched: false
            },
            jioGross: {
                elementType: 'input',
                elementConfig: {
                    type: 'number',
                    label: 'Jio Gross',
                    placeholder: 'Jio Gross',
                    required: true
                },
                inputProps: {
                    readOnly: false
                },
                value: '',
                validation: {
                    required: true
                },
                isValid: false,
                isTouched: false
            },
            vodafoneTertiary: {
                elementType: 'input',
                elementConfig: {
                    type: 'number',
                    label: 'Vodafone Tertiary',
                    placeholder: 'Vodafone Tertiary',
                    required: true
                },
                inputProps: {
                    readOnly: false
                },
                value: '',
                validation: {
                    required: true
                },
                isValid: false,
                isTouched: false
            },
            vodafoneGross: {
                elementType: 'input',
                elementConfig: {
                    type: 'number',
                    label: 'Vodafone Gross',
                    placeholder: 'Vodafone Gross',
                    required: true
                },
                inputProps: {
                    readOnly: false
                },
                value: '',
                validation: {
                    required: true
                },
                isValid: false,
                isTouched: false
            },
            ideaTertiary: {
                elementType: 'input',
                elementConfig: {
                    type: 'number',
                    label: 'Idea Tertiary',
                    placeholder: 'Idea Tertiary',
                    required: true
                },
                inputProps: {
                    readOnly: false
                },
                value: '',
                validation: {
                    required: true
                },
                isValid: false,
                isTouched: false
            },
            ideaGross: {
                elementType: 'input',
                elementConfig: {
                    type: 'number',
                    label: 'Idea Gross',
                    placeholder: 'Idea Gross',
                    required: true
                },
                inputProps: {
                    readOnly: false
                },
                value: '',
                validation: {
                    required: true
                },
                isValid: false,
                isTouched: false
            }
        },
        location: null,
        isMapVisible: false,
        isFormValid: false
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

    addStoreHandler = (event) => {
        event.preventDefault();

        let storeDetails = {};
        for (let formElementName in this.state.storeForm) {
            storeDetails[formElementName] = Number(this.state.storeForm[formElementName].value);
        }

        
        if(this.state.location) {
            storeDetails.location = this.state.location;
        } else {
            this.fetchCurrentLocation();
            return;
        }
        storeDetails.addedAt = new Date();
        storeDetails.managerLapuNumber = Number(localStorage.getItem('managerLapuNumber'));

        this.props.addStoreInDb(storeDetails, this.props.userId);
    }

    inputChangeHandler = (event, inputIdentifier) => {

        const updatedForm = {
            ...this.state.storeForm
        };

        const updatedFormElement = {
            ...updatedForm[inputIdentifier]
        };

        updatedFormElement.value = event.target.value;
        updatedFormElement.isTouched = true;
        if (updatedFormElement.validation) {
            updatedFormElement.isValid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        }
        updatedForm[inputIdentifier] = updatedFormElement;
        // console.log(updatedFormElement);

        let isFormValid = true;
        for (let inputName in updatedForm) {
            isFormValid = updatedForm[inputName].isValid && isFormValid;
        }


        this.setState({
            storeForm: updatedForm,
            isFormValid: isFormValid
        })

    }

    fetchCurrentLocation = () => {
        if (navigator.geolocation) {
            let options = {};
            navigator.geolocation.getCurrentPosition(this.setLocation, this.locationErrorHandler, options);
        } else {
            alert('Location feature is not available on this browser!!!\nPlease use a different browser.');
        }
    }

    locationErrorHandler = err => {
        if (err.code === 1) {
            alert("Error: Access is denied!\nPlease allow the browser to access the location by clicking on small lock symbol on the top address bar and then turning on the GPS of your device.");
        } else if (err.code === 2) {
            alert("Error: Location is unavailable!");
        }
    }

    setLocation = position => {
        console.log('Latitude: ', position.coords.latitude, 'Longitude:', position.coords.longitude);
        this.setState({
            location: {
                lat: Number((position.coords.latitude).toFixed(6)),
                lng: Number((position.coords.longitude).toFixed(6))
            }
        });
    }

    componentDidMount() {
        localStorage.setItem('lastLocation', '/');
        const FOSBeatValue = this.props.userId ? this.props.userId : null;
        this.setState(prevState => ({
            ...prevState,
            storeForm: {
                ...prevState.storeForm,
                FOSBeat: {
                    ...prevState.storeForm.FOSBeat,
                    value: Number(FOSBeatValue)
                }
            }
        }));

        this.fetchCurrentLocation();
    }

    componentDidUpdate() {
        console.log('[AddStore.js] componentDidMount(). location', this.props.location)
        // to reset the form
        if (this.props.isSuccessful) {
            console.log('Coming inside')
            let form = this.state.storeForm;
            for (let formElement in form) {
                if (formElement !== 'FOSBeat') {
                    form[formElement].value = '';
                }
            }

            this.props.resetStateVariables();

            this.setState(prevState => ({
                ...prevState,
                storeForm: {
                    ...form
                }
            }));
        }
    }

    render() {
        let formElementsArray = [];
        for (let key in this.state.storeForm) {
            formElementsArray.push({
                id: key,
                config: this.state.storeForm[key]
            });
        }

        let form = <Spinner />;

        if (!this.props.isLoading) {
            form = (
                <form onSubmit={this.addStoreHandler}>
                    {
                        formElementsArray.map((formElement, index) => {

                            const isError = formElement.config.isTouched ? !formElement.config.isValid : false;
                            return (
                                <TextField
                                    error={isError}
                                    key={index}
                                    {...formElement.config.elementConfig}
                                    variant="outlined"
                                    margin="dense"
                                    style={{ margin: '10px 0' }}
                                    fullWidth
                                    inputProps={formElement.config.inputProps}
                                    value={formElement.config.value}
                                    onChange={(event) => this.inputChangeHandler(event, formElement.id)}
                                />
                            )
                        })
                    }
                    <Button variant="contained" color="primary" fullWidth type="submit" style={{ margin: '10px 0' }}>
                        Add
                    </Button>
                </form>
            )
        }

        return (
            <div className={styleClasses.AddStore}>
                <Typography variant="h5">
                    Add Retailer
                </Typography>
                <Error text={this.props.error} />
                {form}
                <Snackbar
                    show={this.props.isSnackbarVisible}
                    message='Response submitted successfully!'
                    autoHideDuration={2000}
                    onSnackbarClose={this.props.snackbarCloseHandler}
                />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        userId: state.user.user ? state.user.user.lapuNumber : null,
        isLoading: state.user.isLoading,
        isSuccessful: state.user.isSuccessful,
        error: state.user.error,
        isSnackbarVisible: state.user.isSnackbarVisible
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addStoreInDb: (storeDetails, fseId) => dispatch(addStoreToFirestore(storeDetails, fseId)),
        snackbarCloseHandler: () => dispatch({ type: MAKE_SNACKBAR_INVISIBLE }),
        resetStateVariables: () => dispatch({ type: RESET_STATE })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddStore);