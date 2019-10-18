import React from 'react';
import { Typography } from '@material-ui/core';

const Error = props => (
    <Typography color="error" variant="h6">
        {props.text}
    </Typography>
)

export default Error;