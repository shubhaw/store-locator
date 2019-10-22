import React from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableRow, TableCell, TableHead } from '@material-ui/core';

const Retailer = props => {
    let retailerDetailsTable = (
        <React.Fragment>
            <tr>
                <td>
                    <Typography variant="body2">
                        <b>Retailer LAPU Number</b>
                    </Typography>
                </td>
                <td align="right">{props.retailerLapuNumber}</td>
            </tr>
            <tr>
                <td>
                    <Typography variant="body2">
                        <b>Retailer Location</b>
                    </Typography>
                </td>
                <td align="right">{props.location.lat}, {props.location.lng}</td>
            </tr>
        </React.Fragment>
    )

    let fseLapuNumberRow = null;
    if (localStorage.getItem('isFSE') && localStorage.getItem('isFSE') === 'false') {
        fseLapuNumberRow = (
            <tr>
                <td>
                    <Typography variant="body2">
                        <b>FOS Beat</b>
                    </Typography>
                </td>
                <td align="right">{props.fseLapuNumber}</td>
            </tr>
        )
    }

    const competitorDetailsTable = (
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell style={{ paddingLeft: '2px' }}><b>Company</b></TableCell>
                    <TableCell align="right"><b>Tertiary</b></TableCell>
                    <TableCell align="right" style={{ paddingRight: '2px' }}><b>Gross</b></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell component="th" scope="row" style={{ paddingLeft: '2px' }}>Jio</TableCell>
                    <TableCell align="right">{props.jioTertiary}</TableCell>
                    <TableCell align="right" style={{ paddingRight: '2px' }}>{props.jioGross}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell component="th" scope="row" style={{ paddingLeft: '2px' }}>Vodafone</TableCell>
                    <TableCell align="right">{props.vodafoneTertiary}</TableCell>
                    <TableCell align="right" style={{ paddingRight: '2px' }}>{props.vodafoneGross}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell component="th" scope="row" style={{ paddingLeft: '2px' }}>!dea</TableCell>
                    <TableCell align="right">{props.ideaTertiary}</TableCell>
                    <TableCell align="right" style={{ paddingRight: '2px' }}>{props.ideaGross}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )

    const addedAt = (
        <Typography variant="caption">
            <i>{props.dateTime}</i>
        </Typography>
    )
    return (
        <React.Fragment>
            <Card style={{ margin: '10px 0' }}>
                <CardContent>
                    <table width="100%" style={{marginBottom: '0px'}}>
                        <tbody>
                            {retailerDetailsTable}
                            {fseLapuNumberRow}
                        </tbody>
                    </table>
                    
                    {competitorDetailsTable}
                    <div style={{textAlign: 'right', marginTop: '10px'}}>
                        {addedAt}
                    </div>
                </CardContent>
            </Card>
        </React.Fragment>
    )
}

export default Retailer;