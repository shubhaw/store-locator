import React from 'react';
import styleClasses from './AddStore.module.css';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Map from '../../components/Map/Map';
import axios from '../../axios';

class AddStore extends React.Component {
    state = {
        storeForm: {
            dateOfSubmission: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Date of Submission',
                    readOnly: 'readOnly'
                },
                value: new Date().getDate() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear(),
                validation: {
                    required: true
                },
                isValid: true,
                isTouched: false
            },
            timeOfSubmission: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Time of Submission',
                    readOnly: 'readOnly'
                },
                value: new Date().getHours() + ':' + new Date().getMinutes(),
                validation: {
                    required: true
                },
                isValid: true,
                isTouched: false
            },
            retailerLAPUNumber: {
                elementType: 'input',
                elementConfig: {
                    type: 'number',
                    placeholder: 'Retailer LAPU Number',
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
                elementType: 'select',
                elementConfig: {
                    placeholder: 'FOS Beat',
                    options: [
                        { value: 'FOS Beat Value 1', displayValue: 'FOS Beat Value 1' },
                        { value: 'FOS Beat Value 2', displayValue: 'FOS Beat Value 2' }
                    ]
                },
                value: 'fastest',
                isValid: true
            },
            jioTertiary: {
                elementType: 'input',
                elementConfig: {
                    type: 'number',
                    placeholder: 'Jio Tertiary'
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
                    placeholder: 'Jio Gross'
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
                    placeholder: 'Vodafone Tertiary'
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
                    placeholder: 'Vodafone Gross'
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
                    placeholder: 'Idea Tertiary'
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
                    placeholder: 'Idea Gross'
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

        if(rules.min) {
            isValid = parseInt(value.trim(' ')) >= rules.min && isValid;
        }

        if(rules.max) {
            isValid = parseInt(value.trim(' ')) <= rules.max && isValid;
        }

        return isValid;
    }

    addStoreHandler = (event) => {
        event.preventDefault();
        
        console.log('addStoreHandler Called!!!');

        let storeDetails = {};
        for (let formElementName in this.state.storeForm) {
            storeDetails[formElementName] = this.state.storeForm[formElementName].value;
        }

        storeDetails.location = this.state.location;

        axios.post('/store', storeDetails)
            .then(res => console.log(res))
            .catch(err => console.error(err));
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
        this.fetchCurrentLocation();
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
        if(!this.state.isFormValid) {
            submitFormButton = <Button buttonType="Success" disabled onClick={this.addStoreHandler}>Submit</Button>;
        }
        let form = (
            <form className={styleClasses.formWrapper}
            // onSubmit={this.addStoreHandler}
            >
                <div className={styleClasses.form}>
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
                </div>
                <div className={styleClasses.map}>
                    {map}
                    <Button buttonType="Map" onClick={this.toggleMap}>
                        {mapButtonText}
                    </Button>
                    {submitFormButton}
                </div>

            </form>);


        return (
            <div className={styleClasses.AddStore}>
                <h1>Add Store</h1>
                {form}
            </div>
        )
    }
}

export default AddStore;