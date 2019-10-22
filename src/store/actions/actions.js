import {
    CREATE_PROFILE,
    ADD_FSE_SUCCESS,
    ADD_FSE_FAILURE,
    SET_IS_LOADING,
    SET_FSE_LIST,
    ADD_STORE_SUCCESS,
    ADD_STORE_FAILURE,
    UPDATE_MANAGER_LAPU_NUMBER,
    SET_ERROR,
    CLEAR_ERROR,
    LOGOUT,
    SET_IS_FSE
} from './actionTypes';

import firebase from 'firebase/app';
import 'firebase/firestore';
import firebaseApp from '../../config/Firebase/firebase';

const USER_COLLECTION = 'users';
const TM_COLLECTION = 'TMs';
const FSE_COLLECTION = 'FSEs';
const ENTRIES_SUB_COLLECTION = 'entries';

export const addUserInFirestore = userDetails => {
    return dispacth => {
        const db = firebase.firestore();
        db.collection(USER_COLLECTION).add({
            empId: userDetails.employeeId,
            name: userDetails.name,
            phoneNumber: userDetails.lapuNumber,
            reportsTo: userDetails.reportsTo
        })
            .then(docRef => {
                console.log('Document written with ID: ', docRef.id);
                const user = {
                    name: userDetails.displayName,
                    phoneNumber: userDetails.lapuNumber
                }
                return dispacth(createProfile(user));
            })
            .catch(err => console.error(err));
    }
}

export const addFseInFirestore = (fseList, tmId) => {
    return dispatch => {
        dispatch(setIsLoading(true));
        const db = firebase.firestore();
        db.collection(TM_COLLECTION).doc(tmId).get()
            .then(docSnapshot => {
                let oldFseList = [];

                if (docSnapshot.exists) {
                    oldFseList = docSnapshot.get('fseList')
                }
                const updatedFseList = fseList.concat(oldFseList);

                db.collection(TM_COLLECTION).doc(tmId).set({
                    fseList: updatedFseList
                }, { merge: true })
                    .then(() => {
                        return dispatch(addFSESuccess());
                    })
                    .catch(err => {
                        return dispatch(addFSEFailure(err));
                    });
            })
            .catch(err => {
                return dispatch(addFSEFailure(err));
            });

    }
}

const setIsLoading = value => {
    return {
        type: SET_IS_LOADING,
        value
    }
}

const addFSESuccess = () => {
    return {
        type: ADD_FSE_SUCCESS
    }
}

const addFSEFailure = error => {
    return {
        type: ADD_FSE_FAILURE,
        error
    }
}
const createProfile = user => {
    return {
        type: CREATE_PROFILE,
        userDetails: user
    }
}

export const loadFseList = tmId => {
    return dispatch => {
        const db = firebase.firestore();
        db.collection(TM_COLLECTION).doc(tmId).get()
            .then(docSnapshot => {
                if (!docSnapshot.exists) {
                    console.log('No document exists');
                } else {
                    return dispatch(setFseList(docSnapshot.get('fseList')))
                }
            })
    }
}

const setFseList = fseList => {
    return {
        type: SET_FSE_LIST,
        fseList
    }
}

export const addStoreToFirestore = (storeDetails, fseId) => {
    return dispatch => {
        dispatch(setIsLoading(true));
        const db = firebase.firestore();
        db.collection(FSE_COLLECTION).doc(fseId).collection(ENTRIES_SUB_COLLECTION)
            .add(storeDetails)
            .then(docSnapshot => {
                return dispatch(addStoreSuccess())
            })
            .catch(error => dispatch(addStoreFailure(error)));
    }
}

const addStoreSuccess = () => {
    console.log('[actions] addStoreSuccess called!')
    return {
        type: ADD_STORE_SUCCESS
    }
}

const addStoreFailure = error => {
    return {
        type: ADD_STORE_FAILURE,
        error
    }
}

export const checkFSEinFirestore = fseLapuNumber => {
    return dispatch => {
        dispatch(clearError());
        const db = firebase.firestore();
        console.log('[checkFSEinFirestore] lapuNumber:', fseLapuNumber);
        db.collection(TM_COLLECTION).where('fseList', 'array-contains', Number(fseLapuNumber))
            .get()
            .then(querySnapshot => {
                console.log('inside then', querySnapshot);
                if(querySnapshot.empty) {
                    return dispatch(setError('LAPU Number is not valid!'));
                }
                querySnapshot.forEach(doc => {
                    if(doc.exists) {
                        console.log('Manager Id:', doc.id);
                        console.log('Manager Name:', doc.data().name);
                        console.log('------------------------------');
                        dispatch(setIsFSE('true'));
                        return dispatch(updateManagerLapuNumber(doc.id));
                    }
                })
            })
            .catch(err => {
                console.error(err);
                dispatch(setError('Error connecting to server, please try again later.'))
            });
    }
}

export const checkTMinFirestore = tmLapuNumber => {
    return dispatch => {
        dispatch(clearError());
        const db = firebase.firestore();
        console.log('[checkTMinFirestore] lapuNumber:', tmLapuNumber);
        db.collection('tmList').where('tmLapuNumberList', 'array-contains', Number(tmLapuNumber))
            .get()
            .then(querySnapshot => {
                if(querySnapshot.empty) {
                    return dispatch(setError('LAPU Number is not valid!'));
                }
                querySnapshot.forEach(doc => {
                    if(doc.exists) {
                        return dispatch(setIsFSE('false'));
                    }
                })
            })
            .catch(err => {
                console.error(err);
                dispatch(setError('Error connecting to server, please try again later.'))
            });
    }
}

const setIsFSE = value => ({
    type: SET_IS_FSE,
    value
});

const updateManagerLapuNumber = managerLapuNumber => ({
    type: UPDATE_MANAGER_LAPU_NUMBER,
    managerLapuNumber
})

const setError = error => ({
    type: SET_ERROR,
    error
})

const clearError = () => ({
    type: CLEAR_ERROR
})

export const logoutFromFirestore = () => {
    return dispatch => {
        firebaseApp.auth().signOut()
            .then(() => {
                return dispatch(logout());
            })
            .catch(err => dispatch(setError(err)));
    }
}

const logout = () => ({
    type: LOGOUT
})


