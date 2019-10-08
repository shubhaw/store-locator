import {
    CREATE_PROFILE,
    ADD_FSE_SUCCESS,
    ADD_FSE_FAILURE,
    SET_IS_LOADING,
    SET_FSE_LIST
} from './actionTypes';
import firebase from 'firebase/app';
import 'firebase/firestore';

const USER_COLLECTION = 'users';
const TM_COLLECTION = 'TMs';

export const addUserInFirestore = userDetails => {
    return dispacth => {
        const db = firebase.firestore();
        db.collection(USER_COLLECTION).add({
            empId: userDetails.employeeId,
            name: userDetails.name,
            phoneNumber: userDetails.phoneNumber,
            reportsTo: userDetails.reportsTo
        })
            .then(docRef => {
                console.log('Document written with ID: ', docRef.id);
                const user = {
                    name: userDetails.displayName,
                    phoneNumber: userDetails.phoneNumber
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