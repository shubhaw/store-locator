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
    UPDATE_MANAGER_LAPU_NUMBER,
    MAKE_SNACKBAR_VISIBLE,
    MAKE_SNACKBAR_INVISIBLE,
    SET_ERROR,
    CLEAR_ERROR,
    LOGOUT,
    SET_IS_FSE
} from '../actions/actionTypes';

const initialState = {
    user: null,
    isAuthenticated: false,
    isTmLapuNumberValid: false,
    isNewUser: false,
    error: null,
    isSuccessful: false,
    isLoading: false,
    isSnackbarVisible: false
}

const userReducer = (state = initialState, action) => {
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
                isLoading: false
            }
        case SET_FSE_LIST:
            return {
                ...state,
                fseList: action.fseList
            }
        case ADD_STORE_SUCCESS:
            return {
                ...state,
                isSuccessful: true,
                isLoading: false,
                isSnackbarVisible: true
            }
        case ADD_STORE_FAILURE:
            return {
                ...state,
                error: action.error,
                isLoading: false
            }
        case UPDATE_MANAGER_LAPU_NUMBER:
            localStorage.setItem('managerLapuNumber', action.managerLapuNumber);
            return {
                ...state,
                user: {
                    ...state.user,
                    managerLapuNumber: action.managerLapuNumber
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
        case SET_ERROR:
            return {
                ...state,
                error: action.error
            }
        case CLEAR_ERROR:
            return {
                ...state,
                error: null
            }
        case SET_IS_FSE:
            localStorage.setItem('isFSE', action.value);
            return {
                ...state,
                isTmLapuNumberValid: action.value === 'false' ? true : false
            };
        case LOGOUT:
            localStorage.removeItem('managerLapuNumber');
            localStorage.removeItem('isFSE');
            return {
                ...state,
                user: null,
                isTmLapuNumberValid: false,
                isAuthenticated: false
            }
        default:
            return state;
    }
}

export default userReducer;