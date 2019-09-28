import React from 'react';
import styleClasses from './Input.module.css';

const Input = (props) => {
    let inputElement = null;

    let inputClasses = [styleClasses.InputElement];

    if(!props.valid && props.isValidationRequired && props.touched) {
        inputClasses.push(styleClasses.Invalid);
    }

    switch (props.elementType) {
        case ('input'):
            inputElement = <input className={inputClasses.join(' ')} {...props.elementConfig} value={props.value} onChange={props.onChange} />
            break;
        case ('textarea'):
            inputElement = <textarea className={inputClasses.join(' ')} {...props.elementConfig} value={props.value} onChange={props.onChange} />
            break;
        case ('select'):
            inputElement = (
                <select className={inputClasses.join(' ')} onChange={props.onChange}>
                    {
                        props.elementConfig.options.map(option => (
                            <option key={option.value} value={option.value}>{option.displayValue}</option>
                        ))
                    }
                </select>
            );
            break;
        default:
            inputElement = <input className={inputClasses.join(' ')} {...props.elementConfig} value={props.value} onChange={props.onChange} />
            break;
    }
    return (
        <div className={styleClasses.Input}>
            <label className={styleClasses.Label}>{props.elementConfig.placeholder}</label>
            {inputElement}
        </div>
    );
};

export default Input;