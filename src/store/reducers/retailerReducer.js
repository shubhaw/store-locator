import { UPDATE_RETAILER_LIST, SET_RETAILER_COUNT, RESET_RETAILER } from "../actions/actionTypes";

const initialState = {
    retailerList: [],
    retailerCount: -1
}

const retailerReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_RETAILER_LIST:
            const retailerList = [...state.retailerList];
            const updatedRetailerList = retailerList.concat(action.retailerList);
            return {
                ...state,
                retailerList: updatedRetailerList
            }
        case SET_RETAILER_COUNT:
            return {
                ...state,
                retailerCount: action.count
            }
        case RESET_RETAILER:
            return {
                ...state,
                retailerList: [],
                retailerCount: -1
            }
        default:
            return state;
    }
}

export default retailerReducer;