import React from 'react';
import styleClasses from './AddStore.module.css';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Map from '../../components/Map/Map';

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
                    required: false
                },
                isValid: false,
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
                    required: false
                },
                isValid: false,
                isTouched: false
            },
            retailerLAPUNumber: {
                elementType: 'input',
                elementConfig: {
                    type: 'number',
                    placeholder: 'Retailer LAPU Number',
                    min: '1000000000',
                    max: '9999999999'
                },
                value: '',
                validation: {
                    required: true
                },
                isValid: false,
                isTouched: false
            },
            FOSBeat: {
                elementType: 'select',
                elementConfig: {
                    placeholder: 'FOS Beat',
                    options: [
                        { value: 'fastest', displayValue: 'Fastest' },
                        { value: 'cheapest', displayValue: 'Cheapest' }
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
                    placeholder: 'Jio Gross'
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
                    placeholder: 'Jio Gross'
                },
                value: '',
                validation: {
                    required: true
                },
                isValid: false,
                isTouched: false
            }
        },
        location: null
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

        return isValid;
    }

    addStoreHandler = (event) => {
        console.log('OrderHandler Called!!!');

        event.preventDefault();

        this.setState({ isLoading: true });
        let storeDetails = {};
        for (let formElementName in this.state.storeForm) {
            storeDetails[formElementName] = this.state.storeForm[formElementName].value;
        }

        if (!this.state.location) {
            this.fetchCurrentLocation();
        }

        
        storeDetails.location = this.state.location;
        console.log(storeDetails);
        //workaround
        // setTimeout(() => {
        //     storeDetails.location = this.state.location;
        //     console.log(storeDetails);
        // }, 5000);



        //this.props.purchaseBurger(order);
    }

    inputChangeHandler = (event, inputIdentifier) => {
        // console.log(event.target.value);
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
            //console.log(inputName, ': ', updatedForm[inputName].isValid);

        }

        console.log(isFormValid);


        this.setState({
            storeForm: updatedForm,
            isFormValid: isFormValid
        })

    }




    fetchCurrentLocation = (event) => {
        if (event) {
            event.preventDefault();
        }

        if (navigator.geolocation) {
            // console.log('Available');
            let options = {};
            navigator.geolocation.getCurrentPosition(this.showLocation, this.errorHandler, options);
        } else {
            console.log('Location feature not available on this browser!!!');
        }
    }

    errorHandler = err => {
        if (err.code === 1) {
            alert("Error: Access is denied!");
        } else if (err.code === 2) {
            alert("Error: Position is unavailable!");
        }
    }

    showLocation = position => {
        console.log('Latitude: ', position.coords.latitude, 'Longitude:', position.coords.longitude);
        this.setState({
            location: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }
        });
    }

    render() {
        let map = null;
        if (this.state.location) {
            map = <Map currentLocation={this.state.location} />
        }

        let formElementsArray = [];
        for (let key in this.state.storeForm) {
            formElementsArray.push({
                id: key,
                config: this.state.storeForm[key]
            });
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
                    <Button buttonType="Map" onClick={this.fetchCurrentLocation}>Show Location on Map</Button>
                    {map}
                    <Button buttonType="Success" onClick={this.addStoreHandler}>Submit</Button>
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