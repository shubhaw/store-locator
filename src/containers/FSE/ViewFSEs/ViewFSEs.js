import React from 'react';
import { connect } from 'react-redux';
import { loadFseList } from '../../../store/actions/actions';
import { List, ListItem, ListItemText, Paper, Typography } from '@material-ui/core';


class ViewFSEs extends React.Component {

    componentDidMount() {
        this.props.loadFseList(this.props.userId);
    }

    fseClickHandler = fseLapuNumber => {
        console.log('[fseClickHandler] fseLapuNumber: ', fseLapuNumber);
        this.props.history.push({
            pathname: '/view-retailers',
            search: '?fseLapuNumber=' + fseLapuNumber
        })
    }

    render() {
        if (!this.props.fseList) {
            return <div>No Records</div>
        }
        var list = this.props.fseList.map(fse => {
            return (
                <ListItem button key={fse} onClick={() => this.fseClickHandler(fse)}>
                    <ListItemText primary={fse} />
                </ListItem>
            )
        });

        return (
            <React.Fragment>
                <Typography variant='h5'>FSEs under you</Typography>
                <Paper style={{marginTop: '15px'}}>
                    <List>
                        {list}
                    </List>
                </Paper>
            </React.Fragment>
        )
    }
}


const mapStateToProps = state => {
    return {
        fseList: state.user.fseList,
        userId: state.user.user ? state.user.user.lapuNumber : null
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadFseList: tmId => dispatch(loadFseList(tmId))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ViewFSEs);