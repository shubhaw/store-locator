import React from 'react';
import ReactExport from 'react-export-excel';
import axios from '../../axios';
import Button from '../../components/UI/Button/Button';
import styleClasses from './Stores.module.css';
import Store from '../../components/Store/Store';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class Stores extends React.Component {

    state = {
        stores: null
    }

    componentDidMount() {
        axios.get('/stores')
            .then(res => {
                // let stores = [];
                let stores = res.data.map(rawStore => {
                    const store = {
                        retailerLAPUNumber: rawStore.retailerLAPUNumber,
                        retailerLocation: rawStore.location._latitude + '°N, ' + rawStore.location._longitude + '°E',
                        FOSBeat: rawStore.FOSBeat,
                        jioTertiary: rawStore.jioTertiary,
                        jioGross: rawStore.jioGross,
                        vodafoneTertiary: rawStore.vodafoneTertiary,
                        vodafoneGross: rawStore.vodafoneGross,
                        ideaTertiary: rawStore.ideaTertiary,
                        ideaGross: rawStore.ideaGross,
                        submittedAt: new Date(rawStore.submittedAt._seconds * 1000).toLocaleString(),
                        dateOfSubmission: new Date(rawStore.submittedAt._seconds * 1000).toLocaleDateString(),
                        timeOfSubmission: new Date(rawStore.submittedAt._seconds * 1000).toLocaleTimeString(),
                        addedBy: rawStore.addedBy
                    };
                    return store;
                });
                this.setState({ stores: stores });
                console.log(stores);
            })
            .catch(err => console.error(err));
    }

    render() {
        let storeList = null;
        if (this.state.stores) {
            storeList = this.state.stores.map((store, index) => {
                return (
                    <Store
                        key={index}
                        retailerLAPUNumber={store.retailerLAPUNumber}
                        retailerLocation={store.retailerLocation}
                        FOSBeat={store.FOSBeat}
                        jioTertiary={store.jioTertiary}
                        jioGross={store.jioGross}
                        vodafoneTertiary={store.vodafoneTertiary}
                        vodafoneGross={store.vodafoneGross}
                        ideaTertiary={store.ideaTertiary}
                        ideaGross={store.ideaGross}
                        submittedAt={store.submittedAt}
                    />
                )
            })
        }

        return (
            <div className={styleClasses.Stores}>
                <center><h2>All Stores</h2></center>
                {storeList}

                <center>
                    <ExcelFile element={<Button buttonType="Success" onClick={this.addStoreHandler}>Download</Button>}>
                        <ExcelSheet data={this.state.stores} name="Stores">
                            <ExcelColumn label="Date" value="dateOfSubmission" />
                            <ExcelColumn label="Time" value="timeOfSubmission" />
                            <ExcelColumn label="Retailer Shop Location (Lat, Long)" value="retailerLocation" />
                            <ExcelColumn label="Retailer Airtel LAPU Number" value="retailerLAPUNumber" />
                            <ExcelColumn label="FOS Beat" value="FOSBeat" />
                            <ExcelColumn label="Jio Tertiary" value="jioTertiary" />
                            <ExcelColumn label="Jio Gross" value="jioGross" />
                            <ExcelColumn label="Vodafone Tertiary" value="vodafoneTertiary" />
                            <ExcelColumn label="Vodafone Gross" value="vodafoneGross" />
                            <ExcelColumn label="!dea Tertiary" value="ideaTertiary" />
                            <ExcelColumn label="!dea Gross" value="ideaGross" />
                            <ExcelColumn label="Added By" value="addedBy" />
                        </ExcelSheet>
                    </ExcelFile>
                </center>

            </div>
        )
    }
}

export default Stores;