import React from 'react';
import TextField from '@material-ui/core/TextField';

class AddFSE extends React.Component {
    state = {
        fseForm: {
            fseLapuNumber: {
                elementConfig: {
                    label: 'FSE LAPU Number',
                    multiline: true,
                    rowsMax: '8',
                    variant: 'outlined',
                    fullWidth: true
                },
                value: ''
            }
        }
    }

    fseLapuNumberChangeHandler = (event) => {
        const fseLapuNumbersString = event.target.value;
        const fseLapuNumbers = (fseLapuNumbersString.trim('')).split('\n');
        console.log(fseLapuNumbers);
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

    render() {
        let form = null;
        form = (
            <TextField {...this.state.fseForm.fseLapuNumber.elementConfig} value={this.state.fseForm.fseLapuNumber.value}
                onChange={this.fseLapuNumberChangeHandler} />
        )
        return (
            <React.Fragment>
                {form}
            </React.Fragment>
        )
    }
}

export default AddFSE;