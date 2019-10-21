import React from 'react';

import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

export default (props) => {

    return (
        <div>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={props.show}
                autoHideDuration={props.autoHideDuration}
                onClose={props.onSnackbarClose}
                TransitionComponent={Slide}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">{props.message}</span>}
                action={[
                    <IconButton
                        key="close"
                        aria-label="close"
                        color="inherit"
                        onClick={props.onSnackbarClose}
                    >
                        <CloseIcon />
                    </IconButton>,
                ]}
            />
        </div>
    )
}

