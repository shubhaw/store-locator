import React from 'react';
import { connect } from 'react-redux';
import { addStoreToFirestore } from '../../store/actions/actions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import styleClasses from './AddStore.module.css';
import Map from '../../components/Map/Map';
import Spinner from '../../components/UI/Spinner/Spinner';
// import axios from '../../axios';

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

    addStoreHandler = (event) => {
        event.preventDefault();

        this.setState({
            isLoading: true,
            isError: false,
            errorMessage: ''
        });

        let storeDetails = {};
        for (let formElementName in this.state.storeForm) {
            storeDetails[formElementName] = this.state.storeForm[formElementName].value;
        }

        storeDetails.location = this.state.location;
        storeDetails.addedBy = this.props.userId;
        storeDetails.managerId = 'Raman Singh';
        //add manager name to store while logging in

        this.props.addStoreInDb(storeDetails, this.props.userId);

        //#region axios
        // axios.post('/store', storeDetails)
        //     .then(res => {
        //         alert('Details submitted successfully.\nThanks:)');
        //         console.log(res);
        //         this.props.history.push('/home');
        //     })
        //     .catch(err => {
        //         alert('Something went wrong. Please try again later!');
        //         this.setState({
        //             isLoading: false,
        //         });
        //         console.error(err);
        //     });
        //#endregion
    }

    inputChangeHandler = (event, inputIdentifier) => {

        const updatedForm = {
            ...this.state.storeForm
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
            storeForm: updatedForm,
            isFormValid: isFormValid
        })

    }

    fetchCurrentLocation = (event) => {
        if (navigator.geolocation) {
            let options = {};
            navigator.geolocation.getCurrentPosition(this.setLocation, this.errorHandler, options);
        } else {
            alert('Location feature is not available on this browser!!!\nPlease use some other browser.');
        }
    }

    errorHandler = err => {
        if (err.code === 1) {
            alert("Error: Access is denied!\nPlease allow the browser to access the location.");
        } else if (err.code === 2) {
            alert("Error: Location is unavailable!");
        }
    }

    setLocation = position => {
        console.log('Latitude: ', position.coords.latitude, 'Longitude:', position.coords.longitude);
        this.setState({
            location: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }
        });
    }

    componentDidMount() {
        const FOSBeatValue = this.props.userId.substr(3);
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
        
        if(this.props.userId) {
            console.log('userId:', this.props.userId)
            //this.props.fetchMember(9999999999);
        }
    }

    toggleMap = (event) => {
        event.preventDefault();
        this.setState(prevState => ({ isMapVisible: !prevState.isMapVisible }));
    }

    render() {
        let map = null;
        let mapButtonText = 'Show Location on Map';
        if (this.state.isMapVisible) {
            map = <Map currentLocation={this.state.location} />
            mapButtonText = 'Hide Map';
        }

        let formElementsArray = [];
        for (let key in this.state.storeForm) {
            formElementsArray.push({
                id: key,
                config: this.state.storeForm[key]
            });
        }

        let submitFormButton = <Button buttonType="Success" onClick={this.addStoreHandler}>Submit</Button>;
        if (!this.state.isFormValid) {
            submitFormButton = <Button buttonType="Success" disabled onClick={this.addStoreHandler}>Submit</Button>;
        }
        let form = <Spinner />;

        if (!this.state.isLoading) {
            form = (
                <form onSubmit={this.addStoreHandler}>
                    {
                        formElementsArray.map((formElement, index) => (
                            <TextField
                                    error={formElement.config.isTouched || !(formElement.config.isTouched && formElement.config.isValid)}
                                    key={index}
                                    {...formElement.config.elementConfig}
                                    variant="outlined"
                                    margin="dense"
                                    style={{margin: '10px 0'}}
                                    fullWidth
                                    inputProps={formElement.config.inputProps}
                                    value={formElement.config.value}
                                    onChange={(event) => this.inputChangeHandler(event, formElement.id)}
                                />
                        ))
                    }
                    <Button variant="contained" color="primary" fullWidth type="submit" style={{margin: '15px 0'}}>
                        Submit
                    </Button>
                </form>
            )
            
            //#region old form
            // form = (
            //     <form className={styleClasses.formWrapper}
            //     // onSubmit={this.addStoreHandler}
            //     >
            //         <div className={styleClasses.form}>
            //             {
            //                 formElementsArray.map(formElement => (
            //                     <Input
            //                         key={formElement.id}
            //                         elementType={formElement.config.elementType}
            //                         elementConfig={formElement.config.elementConfig}
            //                         value={formElement.config.value}
            //                         onChange={(event) => this.inputChangeHandler(event, formElement.id)}
            //                         isValidationRequired={formElement.config.validation}
            //                         valid={formElement.config.isValid}
            //                         touched={formElement.config.isTouched}
            //                     />
            //                 ))
            //             }
            //         </div>
            //         <div className={styleClasses.map}>
            //             {map}
            //             <Button buttonType="Map" onClick={this.toggleMap}>
            //                 {mapButtonText}
            //             </Button>
            //             {submitFormButton}
            //         </div>

            //     </form>);
            //#endregion
        }

        return (
            <div className={styleClasses.AddStore}>
                <h1>Add Store</h1>
                {form}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        userId: state.user.user? state.user.user.lapuNumber: null,
        isLoading: state.user.isLoading,
        isSuccessful: state.user.isSuccessful,
        error: state.user.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addStoreInDb: (storeDetails, fseId) => dispatch(addStoreToFirestore(storeDetails, fseId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddStore);