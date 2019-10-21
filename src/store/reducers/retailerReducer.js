import { UPDATE_RETAILER_LIST } from "../actions/actionTypes";

const initialState = {
    retailerList: []
}

const retailerReducer = (state = initialState, action) => {
    switch(action.type) {
        case UPDATE_RETAILER_LIST:
            const retailerList = [...state.retailerList];
            const updatedRetailerList = retailerList.concat(action.retailerList);
            return {
                ...state,
                retailerList: updatedRetailerList
            }
            default:
                return state;
    }
}

export default retailerReducer;