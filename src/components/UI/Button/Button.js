import React from 'react';
import styleClasses from './Button.module.css';

const button = (props) => {
    return (
        <button
            className={[styleClasses.Button, styleClasses[props.buttonType]].join(' ')}
            onClick={props.onClick}
            disabled={props.disabled}
        >
            {props.children}
        </button>
    );
};

export default button;