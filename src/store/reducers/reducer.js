import {
    UPDATE_USER,
    CREATE_PROFILE,
    ADD_FSE_SUCCESS,
    ADD_FSE_FAILURE,
    SET_IS_LOADING,
    RESET_STATE,
    SET_FSE_LIST,
    ADD_STORE_SUCCESS,
    ADD_STORE_FAILURE,
    UPDATE_MANAGER_ID,
    MAKE_SNACKBAR_VISIBLE,
    MAKE_SNACKBAR_INVISIBLE
} from '../actions/actionTypes';

const initialState = {
    user: null,
    isAuthenticated: false,
    isNewUser: false,
    error: null,
    isSuccessful: false,
    isLoading: false,
    isSnackbarVisible: false
}

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_USER:
            if (action.user) {
                return {
                    ...state,
                    user: {
                        ...state.user,
                        ...action.user
                    },
                    isAuthenticated: true
                }
            } else {
                return state;
            }
        case CREATE_PROFILE:
            return {
                ...state,
                user: {
                    ...state.user,
                    ...action.userDetails
                },
                isNewUser: false
            }
        case ADD_FSE_SUCCESS:
            return {
                ...state,
                isSuccessful: true
            };
        case ADD_FSE_FAILURE:
            return {
                ...state,
                error: action.error,
                isLoading: false
            };
        case SET_IS_LOADING:
            return {
                ...state,
                isLoading: action.value
            }
        case RESET_STATE:
            return {
                ...state,
                isSuccessful: false,
                error: null,
                isLoading: false,
                isSnackbarVisible: false
            }
        case SET_FSE_LIST:
            return {
                ...state,
                fseList: action.fseList
            }
        case ADD_STORE_SUCCESS:
            return {
                ...state,
                isSuccessful: true
            }
        case ADD_STORE_FAILURE:
            return {
                ...state,
                error: action.error,
                isLoading: false
            }
        case UPDATE_MANAGER_ID:
            return {
                ...state,
                user: {
                    ...state.user,
                    managerId: action.managerId
                }
            }
        case MAKE_SNACKBAR_VISIBLE:
            return {
                ...state,
                isSnackbarVisible: true
            }
        case MAKE_SNACKBAR_INVISIBLE:
            return {
                ...state,
                isSnackbarVisible: false
            }
        default:
            return state;
    }
}