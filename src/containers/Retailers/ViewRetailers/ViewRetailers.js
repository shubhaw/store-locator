import React from 'react';
import { connect } from 'react-redux';
import ReactExport from 'react-export-excel';
import Spinner from '../../../components/UI/Spinner/Spinner';
import { Typography, Drawer, Fab, Divider, Button, Chip, Grid } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import styleClasses from './ViewRetailers.module.css';
import { fetchRetailerDetailsForFseFromFirestore, fetchRetailerDetailsForTmFromFirestore } from '../../../store/actions/retailerActions';
import Retailer from '../../../components/Retailer/Retailer';
import { RESET_RETAILER } from '../../../store/actions/actionTypes';
import GetAppIcon from '@material-ui/icons/GetApp';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class ViewRetailers extends React.Component {

    state = {
        localRetailerList: [],
        distinctRetailerLapuNumberList: [],
        distinctFseLapuNumberList: [],
        isFilterVisible: false
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

    onRetailerFilterClicked = retailerLapuNumber => {
        const updatedRetailerList = this.state.localRetailerList.map(retailer => {
            if (retailer.retailerLAPUNumber === retailerLapuNumber) {
                retailer.isSelected = !retailer.isSelected
            }
            return retailer
        })

        const selectedList = [...new Set(updatedRetailerList.map(retailer => retailer.isSelected ? retailer.FOSBeat : null).filter(lapuNumber => lapuNumber !== null))]
        const unSelectedList = [...new Set(updatedRetailerList.map(retailer => retailer.isSelected ? null : retailer.FOSBeat).filter(lapuNumber => lapuNumber !== null))]


        const updatedDistinctFseLapuNumberList = selectedList.map(lapuNumber => ({
            fseLapuNumber: lapuNumber,
            isSelected: true
        }))
            .concat(
                unSelectedList.filter(lapuNumber => selectedList.indexOf(lapuNumber) === -1)
                    .map(lapuNumber => ({
                        fseLapuNumber: lapuNumber,
                        isSelected: false
                    }))
            )


        const updatedDistinctRetailerLapuNumberList = this.state.distinctRetailerLapuNumberList.map(retailer => {
            if (retailer.retailerLapuNumber === retailerLapuNumber) {
                retailer.isSelected = !retailer.isSelected
            }
            return retailer
        })

        this.setState({
            localRetailerList: updatedRetailerList,
            distinctRetailerLapuNumberList: updatedDistinctRetailerLapuNumberList,
            distinctFseLapuNumberList: updatedDistinctFseLapuNumberList
        })
    }

    onFseFilterChipClicked = fseLapuNumber => {
        let isSelectedAfterToggle = true;
        const updatedDistinctFseLapuNumberList = this.state.distinctFseLapuNumberList.map(fse => {
            if (fse.fseLapuNumber === fseLapuNumber) {
                fse.isSelected = !fse.isSelected
                isSelectedAfterToggle = fse.isSelected
            }
            return fse
        })

        const updatedRetailerList = this.state.localRetailerList.map(retailer => {
            if (retailer.FOSBeat === fseLapuNumber) {
                retailer.isSelected = isSelectedAfterToggle
            }
            return retailer
        })

        const tempDistinctRetailerLapuNumberList = updatedRetailerList.map(retailer => {
            if (retailer.isSelected) {
                return {
                    retailerLapuNumber: retailer.retailerLAPUNumber,
                    isSelected: true
                }
            } else {
                return {
                    retailerLapuNumber: retailer.retailerLAPUNumber,
                    isSelected: false
                }
            }
        })

        let updatedDistinctRetailerLapuNumberList = [];
        const map = new Map();
        for (const retailer of tempDistinctRetailerLapuNumberList) {
            if (!map.has(retailer.retailerLapuNumber)) {
                map.set(retailer.retailerLapuNumber, true);
                updatedDistinctRetailerLapuNumberList.push({
                    retailerLapuNumber: retailer.retailerLapuNumber,
                    isSelected: retailer.isSelected
                });
            }
        }

        this.setState({
            localRetailerList: updatedRetailerList,
            distinctRetailerLapuNumberList: updatedDistinctRetailerLapuNumberList,
            distinctFseLapuNumberList: updatedDistinctFseLapuNumberList
        })
    }

    componentDidUpdate() {
        this.loadLocalLists();
    }

    componentDidMount() {
        this.fetchRetailerListForFirstTime();
        this.loadLocalLists();
    }

    componentWillUnmount() {
        this.props.resetRetailers();
    }

    loadLocalLists = () => {
        if (this.state.localRetailerList.length === 0 && this.props.retailerList.length > 0) {
            const localRetailerList = this.props.retailerList.map(retailer => {
                retailer.isSelected = true;
                retailer.date = new Date(retailer.addedAt.seconds * 1000).toLocaleDateString();
                retailer.time = new Date(retailer.addedAt.seconds * 1000).toLocaleTimeString();
                retailer.dateTime = new Date(retailer.addedAt.seconds * 1000).toLocaleString();
                return retailer;
            })

            const retailerLapuNumberList = [...new Set(this.props.retailerList.map(retailer => retailer.retailerLAPUNumber))]
            const distinctRetailerLapuNumberList = retailerLapuNumberList.map(lapuNumber => {
                return {
                    retailerLapuNumber: lapuNumber,
                    isSelected: true
                }
            })

            const fseLapuNumberList = [...new Set(this.props.retailerList.map(retailer => retailer.FOSBeat))]
            const distinctFseLapuNumberList = fseLapuNumberList.map(lapuNumber => {
                return {
                    fseLapuNumber: lapuNumber,
                    isSelected: true
                }
            })

            this.setState({
                localRetailerList,
                distinctRetailerLapuNumberList,
                distinctFseLapuNumberList
            })
        }
    }

    fetchRetailerListForFirstTime = () => {

        if (this.props.retailerCountInDb <= 0 && localStorage.getItem('isFSE') === 'true') {
            this.props.fetchRetailerListForFSE(this.props.user.lapuNumber);
        } else if (this.props.retailerCountInDb <= 0 && localStorage.getItem('isFSE') === 'false') {
            if (this.props.location.search === '') {
                this.props.fetchRetailerListForTM(this.props.user.lapuNumber);
            } else {
                const fseLapuNumber = this.props.location.search.split("=")[1];
                this.props.fetchRetailerListForFSE(fseLapuNumber);
            }
        }
    }

    render() {

        const icon = {
            color: '#3f51b5',
            cursor: 'pointer'
        }
        let excel = null;

        // const selectedRetailerList = this.state.localRetailerList.map(retailer => retailer.isSelected ? retailer : null)
        //     .filter(retailer => retailer != null);

        const selectedRetailerList = this.state.localRetailerList.map(retailer => {
            if (retailer.isSelected) {
                retailer.latitude = retailer.location ? retailer.location.lat : null;
                retailer.longitude = retailer.location ? retailer.location.lng : null;
                retailer.formattedLocation = retailer.location ? (retailer.location.lat + '°N, ' + retailer.location.lng + '°E') : null;
                return retailer;
            } else {
                return null;
            }
        })
            .filter(retailer => retailer != null);

        if (selectedRetailerList.length !== 0) {
            excel = (
                <ExcelFile element={<GetAppIcon style={icon} />}>
                    <ExcelSheet data={selectedRetailerList} name="Entries">
                        <ExcelColumn label="FSE LAPU Number" value="FOSBeat" />
                        <ExcelColumn label="Retailer LAPU Number" value="retailerLAPUNumber" />
                        <ExcelColumn label="Jio Tertiary" value="jioTertiary" />
                        <ExcelColumn label="Jio Gross" value="jioGross" />
                        <ExcelColumn label="Vodafone Tertiary" value="vodafoneTertiary" />
                        <ExcelColumn label="Vodafone Gross" value="vodafoneGross" />
                        <ExcelColumn label="Idea Tertiary" value="ideaTertiary" />
                        <ExcelColumn label="Idea Gross" value="ideaGross" />
                        <ExcelColumn label="Added At" value="dateTime" />
                        <ExcelColumn label="Date" value="date" />
                        <ExcelColumn label="Time" value="time" />
                        <ExcelColumn label="Location (Lat, Lng)" value="formattedLocation" />
                        <ExcelColumn label="Latitude" value="latitude" />
                        <ExcelColumn label="Longitude" value="longitude" />
                    </ExcelSheet>
                </ExcelFile>
            )
        }

        const heading = (
            <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="flex-start"
            >
                <Typography variant="h5">
                    View Retailers
                </Typography>
                {excel}
            </Grid>
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
                            <Chip key={retailer.retailerLapuNumber}
                                variant="outlined"
                                color="primary"
                                clickable
                                size="small"
                                icon={icon}
                                onClick={() => this.onRetailerFilterClicked(retailer.retailerLapuNumber)}
                                style={style}
                                label={retailer.retailerLapuNumber}
                            />
                        )
                    })
                }
            </div>
        )

        let fseFilter = null;
        fseFilter = (
            <div>
                <Typography variant="h6">
                    FSEs
                </Typography>
                {
                    this.state.distinctFseLapuNumberList.map(fse => {
                        let icon = null;
                        let style = {
                            margin: '5px'
                        };

                        if (fse.isSelected) {
                            icon = <CheckCircleOutlineIcon />
                            style = {
                                margin: '5px',
                                backgroundColor: 'rgba(0, 0, 150, 0.2)',
                                boxShadow: '0 1px #ccc'
                            }
                        }

                        return (
                            <Chip key={fse.fseLapuNumber}
                                variant="outlined"
                                color="primary"
                                clickable
                                size="small"
                                icon={icon}
                                onClick={() => this.onFseFilterChipClicked(fse.fseLapuNumber)}
                                style={style}
                                label={fse.fseLapuNumber}
                            />
                        )
                    })
                }
            </div>
        )

        let filter = null;

        filter = (
            <Drawer anchor="bottom" open={this.state.isFilterVisible} variant="temporary" onClose={this.filterDrawerCloseHandler} >
                <div className={styleClasses.FilterDrawer}>
                    {retailerFilter}
                    <Divider />
                    {fseFilter}
                    <Button variant="contained" fullWidth color="primary" style={{ marginTop: '10px' }} onClick={this.filterDrawerCloseHandler}>Done</Button>
                </div>
            </Drawer>
        )


        let spinner = <Spinner />;
        if (this.props.retailerCountInDb >= 0) {
            spinner = null;
        }

        let entries = null;

        let noRetailersFound = (
            <div style={{ textAlign: "center", marginTop: '150px' }}>
                <Typography variant="caption">
                    No Entries found!
                </Typography>
            </div>
        );

        if (this.props.retailerCountInDb !== 0) {
            noRetailersFound = null;
        }

        if (this.state.localRetailerList.length !== 0) {
            entries = this.state.localRetailerList.map((retailer, index) => {
                if (!retailer.isSelected) {
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
                        dateTime={retailer.dateTime}
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
                {spinner}
                {entries}
                {noRetailersFound}
                {filter}
            </React.Fragment>
        )
    }
}


const mapStateToProps = state => {
    return {
        user: state.user.user,
        isAuthenticated: state.user.isAuthenticated,
        retailerList: state.retailer.retailerList,
        retailerCountInDb: state.retailer.retailerCount
    }
}

const mapDispatchToProps = dispatch => ({
    fetchRetailerListForFSE: fseLapuNumber => dispatch(fetchRetailerDetailsForFseFromFirestore(fseLapuNumber)),
    fetchRetailerListForTM: tmLapuNumber => dispatch(fetchRetailerDetailsForTmFromFirestore(tmLapuNumber)),
    resetRetailers: () => dispatch({ type: RESET_RETAILER })
})

export default connect(mapStateToProps, mapDispatchToProps)(ViewRetailers);