import { UPDATE_USER, CREATE_PROFILE } from '../actions/actionTypes';

const initialState = {
    user: null,
    isAuthenticated: false,
    isNewUser: false
}

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_USER:
            if (action.user) {
                return {
                    ...state,
                    user: action.user,
                    isAuthenticated: true
                }
            } else {
                return state;
            }
        case CREATE_PROFILE:
            return {
                ...state,
                user: action.userDetails,
                isNewUser: false
            }
        default:
            return state;
    }
}