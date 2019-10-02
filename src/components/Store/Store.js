import React from 'react';
import styleClasses from './Store.module.css';

const Store = props => {
    return (
        <div className={styleClasses.Store}>
            <div className={styleClasses.Flexbox}>
                <div>
                    <div className={styleClasses.independentFields}>
                        <div className={styleClasses.label}>Retailer LAPU Number:</div>
                        <div className={styleClasses.valueField}>{props.retailerLAPUNumber}</div>
                    </div>
                    <div className={styleClasses.independentFields}>
                        <div className={styleClasses.label}>Retailer Location:</div>
                        <div className={styleClasses.valueField}>{props.retailerLocation}</div>
                    </div>
                    <div className={styleClasses.independentFields}>
                        <div className={styleClasses.label}>FOS Beat:</div>
                        <div className={styleClasses.valueField}>{props.FOSBeat}</div>
                    </div>
                </div>
                <div>
                    <div className={styleClasses.dataTable}>
                        <div className={styleClasses.columnHeader + ' ' + styleClasses.rowHeader} style={{ borderTopLeftRadius: '5px' }}></div>
                        <div className={styleClasses.columnHeader}>Tertiary</div>
                        <div className={styleClasses.columnHeader} style={{ borderTopRightRadius: '5px' }}>Gross</div>
                        <div className={styleClasses.rowHeader}>Jio</div>
                        <div>{props.jioTertiary}</div>
                        <div>{props.jioGross}</div>
                        <div className={styleClasses.rowHeader}>Vodafone</div>
                        <div>{props.vodafoneTertiary}</div>
                        <div>{props.vodafoneGross}</div>
                        <div className={styleClasses.rowHeader} style={{ borderBottomLeftRadius: '5px' }}>!dea</div>
                        <div>{props.ideaTertiary}</div>
                        <div style={{ borderBottomRightRadius: '5px' }}>{props.ideaGross}</div>
                    </div>
                </div>
            </div>
            <div className={styleClasses.submittedAt}>
                <span style={{fontWeight: 'bold'}}>Submitted at: </span> {props.submittedAt}
            </div>
        </div>
    )
}

export default Store;