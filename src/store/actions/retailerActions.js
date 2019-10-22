import firebase from 'firebase/app';
import 'firebase/firestore';
import { SET_RETAILER_COUNT, UPDATE_RETAILER_LIST, SET_ERROR } from './actionTypes';

// const TM_COLLECTION = 'TMs';
const FSE_COLLECTION = 'FSEs';
const ENTRIES_SUB_COLLECTION = 'entries';

export const fetchRetailerDetailsForFseFromFirestore = fseLapuNumber => {
    return dispatch => {
        const currentDate = new Date()
        const firstDayOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const db = firebase.firestore();
        const retailerList = [];
        let retailerListQuery = db.collection(FSE_COLLECTION).doc(fseLapuNumber).collection(ENTRIES_SUB_COLLECTION)
            .orderBy('addedAt', 'desc')
            .where('addedAt', '>=', firstDayOfCurrentMonth)
            .where('addedAt', '<=', lastDayOfCurrentMonth)
            // .limit(1);
        retailerListQuery.get()
            .then(docSnapshots => {
                // console.log('[fetchRetailerDetailsFromFirestore] docSnapshots', docSnapshots)
                if (docSnapshots.empty) {
                    return dispatch(setRetailerCount(0))
                }

                dispatch(setRetailerCount(docSnapshots.size));
                
                docSnapshots.forEach(docSnapshot => {
                    if(docSnapshot.exists) {
                        // console.log('[fetchRetailerDetailsFromFirestore] docSnapshot', docSnapshot.data())
                        retailerList.push(docSnapshot.data())
                    }
                })
                return dispatch(updateRetailerDetails(retailerList));
            })
            .catch(err => {
                console.log(err)
                dispatch(setError(err))
            });
    }
}


export const fetchRetailerDetailsForTmFromFirestore = tmLapuNumber => {
    return dispatch => {
        console.log('[fetchRetailerDetailsForTmFromFirestore] inside the function')
        const currentDate = new Date()
        const firstDayOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const db = firebase.firestore();
        const retailerList = [];
        let retailerListQuery = db.collectionGroup(ENTRIES_SUB_COLLECTION)
            .where('managerLapuNumber', '==', Number(tmLapuNumber))
            .where('addedAt', '>=', firstDayOfCurrentMonth)
            .where('addedAt', '<=', lastDayOfCurrentMonth)
            .orderBy('addedAt', 'desc')
            // .limit(1);
        retailerListQuery.get()
            .then(docSnapshots => {
                console.log('[fetchRetailerDetailsForTmFromFirestore] docSnapshots', docSnapshots)
                if (docSnapshots.empty) {
                    return dispatch(setRetailerCount(0))
                }

                dispatch(setRetailerCount(docSnapshots.size));
                
                docSnapshots.forEach(docSnapshot => {
                    if(docSnapshot.exists) {
                        // console.log('[fetchRetailerDetailsForTmFromFirestore] docSnapshot', docSnapshot.data())
                        retailerList.push(docSnapshot.data())
                    }
                })
                return dispatch(updateRetailerDetails(retailerList));
            })
            .catch(err => {
                console.log(err)
                dispatch(setError(err))
            });
    }
}

const setRetailerCount = count => ({
    type: SET_RETAILER_COUNT,
    count
})

const updateRetailerDetails = retailerList => ({
    type: UPDATE_RETAILER_LIST,
    retailerList
})


const setError = error => ({
    type: SET_ERROR,
    error
})