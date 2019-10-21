import React from 'react';
import { connect } from 'react-redux';
import { loadFseList } from '../../../store/actions/actions';
import { List, ListItem, ListItemText, Paper, Divider, Typography } from '@material-ui/core';


class ViewFSEs extends React.Component {

    componentDidMount() {
        this.props.loadFseList(this.props.userId);
    }

    render() {
        if (!this.props.fseList) {
            return <div>No Records</div>
        }
        var list = this.props.fseList.map(fse => {
            return (
                <ListItem button key={fse}>
                    <ListItemText primary={fse} />
                </ListItem>
            )
        });

        return (
            <Paper>
                <List>
                    <ListItem>
                        <Typography variant='h5'>FSEs under you</Typography>
                    </ListItem>
                    <Divider />
                    {list}
                </List>
            </Paper>
        )
    }
}


const mapStateToProps = state => {
    return {
        fseList: state.user.fseList,
        userId: state.user.user? state.user.user.lapuNumber: null
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadFseList: tmId => dispatch(loadFseList(tmId))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ViewFSEs);