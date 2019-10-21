import retailerReducer from './retailerReducer';
import userReducer from './userReducer';
import {combineReducers} from 'redux';

const rootReducer = combineReducers({
    user: userReducer,
    retailer: retailerReducer
})

export default rootReducer;