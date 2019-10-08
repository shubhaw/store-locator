import React from 'react';
import { Redirect } from 'react-router-dom';
import { addFseInFirestore } from '../../../store/actions/actions';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import AlertDialog from '../../../components/UI/Dialog/Dialog';
import { FormControl } from '@material-ui/core';
import { RESET_STATE } from '../../../store/actions/actionTypes';


class AddFSE extends React.Component {
    state = {
        fseForm: {
            fseLapuNumber: {
                elementConfig: {
                    label: 'FSE LAPU Number',
                    multiline: true,
                    rowsMax: '8',
                    variant: 'outlined',
                    fullWidth: true,
                    required: true
                },
                value: ''
            }
        },
        isDialogVisible: false,
        correctFSEList: [],
        wrongFSEList: []
    }

    fseLapuNumberChangeHandler = (event) => {
        const fseLapuNumbersString = event.target.value;
        this.setState({
            fseForm: {
                ...this.state.fseForm,
                fseLapuNumber: {
                    ...this.state.fseForm.fseLapuNumber,
                    value: fseLapuNumbersString
                }
            }
        })
    }

    formSubmitHandler = (event) => {
        event.preventDefault();

        let fseLapuNumbers = (this.state.fseForm.fseLapuNumber.value.trim('\n')).split('\n');
        fseLapuNumbers = fseLapuNumbers.filter(fse => fse.length !== 0);
        if (fseLapuNumbers.length === 0) {
            this.setState({
                fseForm: {
                    ...this.state.fseForm,
                    fseLapuNumber: {
                        ...this.state.fseForm.fseLapuNumber,
                        value: ''
                    }
                }
            })
            return;
        }

        let correctFSEList = fseLapuNumbers.filter(fse => (fse.length === 10 && fse.match(/^([,.\d]+)$/)));
        let wrongFSEList = fseLapuNumbers.filter(fse => (fse.length !== 10 || !fse.match(/^([,.\d]+)$/)));
        correctFSEList = correctFSEList.map(fse => Number(fse));

        this.setState({ correctFSEList });


        if (wrongFSEList.length !== 0) {
            this.setState({
                wrongFSEList,
                isDialogVisible: true
            });
        } else if (correctFSEList.length !== 0) {
            this.props.addFSEHandler(correctFSEList, this.props.userId);
        }



    }

    closeDialogHandler = () => {
        this.setState({
            isDialogVisible: false
        })
    }

    finalSubmitHandler = () => {
        this.props.addFSEHandler(this.state.correctFSEList, this.props.userId);

        this.setState({
            isDialogVisible: false,
        });
    }

    render() {
        if (!this.props.userId) {
            return <Redirect to='/' />
        }

        if (this.props.isSuccessful) {
            this.props.resetState();
            return < Redirect to='/' />
        }

        let dialog = (
            <AlertDialog
                show={this.state.isDialogVisible}
                title='Invalid values entered!'
                description={this.state.wrongFSEList + ' are not valid. These will be ignored. Do you want to continue?'}
                negativeButtonText='Cancel'
                positiveButtonText='Continue'
                handleClose={this.closeDialogHandler}
                handleContinue={this.finalSubmitHandler}
            />
        )

        let form = null;
        if (this.props.isLoading) {
            form = <Spinner />
        } else {
            form = (
                <form onSubmit={this.formSubmitHandler}>
                    <FormControl required fullWidth>
                        <TextField {...this.state.fseForm.fseLapuNumber.elementConfig} value={this.state.fseForm.fseLapuNumber.value}
                            onChange={this.fseLapuNumberChangeHandler} />
                    </FormControl>
                    <br /><br />
                    <Button variant="contained" color="primary" fullWidth type="submit">
                        Add FSE
                    </Button>
                </form>
            )
        }

        return (
            <React.Fragment>
                {form}
                {dialog}
                {this.props.error}
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        userId: state.user ? state.user.phoneNumber : null,
        isSuccessful: state.isSuccessful,
        error: state.error,
        isLoading: state.isLoading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addFSEHandler: (fseList, userId) => dispatch(addFseInFirestore(fseList, userId)),
        resetState: () => dispatch({ type: RESET_STATE })
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AddFSE);