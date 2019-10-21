import React from 'react';
import { connect } from 'react-redux';
import Spinner from '../../../components/UI/Spinner/Spinner';
import { Typography, Drawer, Fab, Divider, Button, Chip } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import styleClasses from './ViewRetailers.module.css';
import { fetchRetailerDetailsFromFirestore } from '../../../store/actions/actions';
import { SET_IS_FSE } from '../../../store/actions/actionTypes';
import Retailer from '../../../components/Retailer/Retailer';

class ViewRetailers extends React.Component {

    state = {
        retailerList: [
            {
                lapuNumber: 2314569780,
                isSelected: true
            },
            {
                lapuNumber: 9784561230,
                isSelected: true
            },
            {
                lapuNumber: 4569782310,
                isSelected: true
            }
        ],
        fseList: [
            {
                lapuNumber: 2314569785,
                isSelected: true
            },
            {
                lapuNumber: 4569782135,
                isSelected: true
            },
            {
                lapuNumber: 9784562315,
                isSelected: true
            },
            {
                lapuNumber: 7984561325,
                isSelected: true
            },
            {
                lapuNumber: 1234567895,
                isSelected: true
            }
        ],
        localRetailerList: [],
        distinctRetailerLapuNumberList: [],
        isFilterVisible: false
    }

    filterChangeHandler = event => {
        this.setState({ retailer: event.target.value })
    }

    filterDrawerCloseHandler = () => {
        this.setState({
            isFilterVisible: false
        })
    }

    filterDrawerOpenHandler = () => {
        this.setState({
            isFilterVisible: true
        })
    }

    onFilterChipClicked = (retailerLapuNumber) => {
        const updatedRetailerList = this.state.localRetailerList.map(retailer => {
            if(retailer.retailerLAPUNumber === retailerLapuNumber) {
                retailer.isSelected = !retailer.isSelected
            }
            return retailer
        })

        const updatedDistinctRetailerLapuNumberList = this.state.distinctRetailerLapuNumberList.map(retailer => {
            if(retailer.retailerLAPUNumber === retailerLapuNumber) {
                retailer.isSelected = !retailer.isSelected
            }
            return retailer
        })

        this.setState({
            localRetailerList: updatedRetailerList,
            distinctRetailerLapuNumberList: updatedDistinctRetailerLapuNumberList
        })
    }

    componentDidUpdate() {
        if (this.state.localRetailerList.length === 0 && this.props.retailerList.length > 0) {
            const localRetailerList = this.props.retailerList.map(retailer => {
                retailer.isSelected = true;
                return retailer;
            })

            const retailerLapuNumberList = [...new Set(this.props.retailerList.map(retailer => retailer.retailerLAPUNumber))]
            const distinctRetailerLapuNumberList = retailerLapuNumberList.map(lapuNumber => {
                return {
                    retailerLAPUNumber: lapuNumber,
                    isSelected: true
                }
            })
            this.setState({
                localRetailerList,
                distinctRetailerLapuNumberList
            })
        }
    }

    render() {
        
        if (this.props.user && this.props.retailerList.length === 0) {
            this.props.fetchRetailerList(this.props.user.lapuNumber);
        }

        const heading = (
            <Typography variant="h5" onClick={this.props.check}>
                View Retailers
            </Typography>
        );

        const retailerFilter = (
            <div>
                <Typography variant="h6">
                    Retailers
                </Typography>
                {
                    this.state.distinctRetailerLapuNumberList.map(retailer => {
                        let icon = null;
                        let style = {
                            margin: '5px'
                        };

                        if (retailer.isSelected) {
                            icon = <CheckCircleOutlineIcon />
                            style = {
                                margin: '5px',
                                backgroundColor: 'rgba(0, 0, 150, 0.2)',
                                boxShadow: '0 1px #ccc'
                            }
                        }
                        
                        return (
                            <Chip key={retailer.retailerLAPUNumber}
                                variant="outlined"
                                color="primary"
                                clickable
                                size="small"
                                icon={icon}
                                onClick={() => this.onFilterChipClicked(retailer.retailerLAPUNumber)}
                                style={style}
                                label={retailer.retailerLAPUNumber}
                            />
                        )
                    }
                    )
                }
            </div>
        )

        let fseFilter = null;
        if (localStorage.getItem('isFSE') && localStorage.getItem('isFSE') === 'false') {
            fseFilter = (
                <div>
                    <Typography variant="h5">
                        FSEs
                            </Typography>
                    {this.state.fseList.map(fse => (
                        <Chip key={fse.lapuNumber}
                            variant="outlined"
                            color="primary"
                            clickable
                            onClick={this.onFilterChipClicked}
                            style={{ margin: '5px' }}
                            label={fse.lapuNumber}
                        />
                    ))}
                </div>
            )
        }

        let filter = null;

        filter = (
            <Drawer anchor="bottom" open={this.state.isFilterVisible} variant="temporary" onClose={this.filterDrawerCloseHandler} >
                <div className={styleClasses.FilterDrawer}>
                    {retailerFilter}
                    <Divider />
                    {fseFilter}
                    <Button variant="contained" fullWidth color="primary" onClick={this.filterDrawerCloseHandler}>Done</Button>
                </div>
            </Drawer>
        )



        let storeList = <Spinner />;

        if (this.state.localRetailerList.length !== 0) {
            storeList = this.state.localRetailerList.map((retailer, index) => {
                if(!retailer.isSelected) {
                    return null;
                }
                return (
                    <Retailer
                        key={index}
                        retailerLapuNumber={retailer.retailerLAPUNumber}
                        location={retailer.location}
                        fseLapuNumber={retailer.FOSBeat}
                        jioTertiary={retailer.jioTertiary}
                        jioGross={retailer.jioGross}
                        vodafoneTertiary={retailer.vodafoneTertiary}
                        vodafoneGross={retailer.vodafoneGross}
                        ideaTertiary={retailer.ideaTertiary}
                        ideaGross={retailer.ideaGross}
                        addedAt={retailer.addedAt}
                    />
                )
            })
        }

        const style = {
            margin: 0,
            top: 'auto',
            right: 20,
            bottom: 20,
            left: 'auto',
            position: 'fixed',
        };

        return (
            <React.Fragment>
                {heading}
                <Fab color="primary" aria-label="Filter" onClick={this.filterDrawerOpenHandler} style={style} variant="round">
                    <FilterListIcon />
                </Fab>
                {storeList}
                {filter}
            </React.Fragment>
        )
    }
}


const mapStateToProps = state => {
    return {
        user: state.user.user,
        retailerList: state.retailer.retailerList
    }
}

const mapDispatchToProps = dispatch => ({
    fetchRetailerList: fseLapuNumber => dispatch(fetchRetailerDetailsFromFirestore(fseLapuNumber)),
    check: () => dispatch({ type: SET_IS_FSE })
})

export default connect(mapStateToProps, mapDispatchToProps)(ViewRetailers);