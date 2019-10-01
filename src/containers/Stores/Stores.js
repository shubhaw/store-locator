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
                this.setState({ stores: res.data });
                console.log(res.data);
            })
            .catch(err => console.error(err));
    }

    render() {
        let storeList = null;
        if (this.state.stores) {
            storeList = this.state.stores.map((store, index) => {
                const location = store.location._latitude + '°N, '  + store.location._longitude + '°E'
                return (
                    <Store
                        key={index}
                        retailerLAPUNumber={store.retailerLAPUNumber}
                        retailerLocation={location}
                        FOSBeat={store.FOSBeat}
                        jioTertiary={store.jioTertiary}
                        jioGross={store.jioGross}
                        vodafoneTertiary={store.vodafoneTertiary}
                        vodafoneGross={store.vodafoneGross}
                        ideaTertiary={store.ideaTertiary}
                        ideaGross={store.ideaGross}
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
                            <ExcelColumn label="Date Stamp" value="dateOfSubmission" />
                            <ExcelColumn label="Time Stamp" value="timeOfSubmission" />
                            <ExcelColumn label="Retailer Shop Location (Lat, Long)" value="retailerLAPUNumber" />
                            <ExcelColumn label="Retailer Airtel LAPU Number" value="retailerLAPUNumber" />
                            <ExcelColumn label="FOS Beat" value="FOSBeat" />
                            <ExcelColumn label="Jio Tertiary" value="jioTertiary" />
                            <ExcelColumn label="Jio Gross" value="jioGross" />
                            <ExcelColumn label="Vodafone Tertiary" value="vodafoneTertiary" />
                            <ExcelColumn label="Vodafone Gross" value="vodafoneGross" />
                            <ExcelColumn label="!dea Tertiary" value="ideaTertiary" />
                            <ExcelColumn label="!dea Gross" value="ideaGross" />
                        </ExcelSheet>
                    </ExcelFile>
                </center>

            </div>
        )
    }
}

export default Stores;