import { CREATE_PROFILE } from './actionTypes';
import firebase from 'firebase/app';

const USER_COLLECTION = 'users';

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
                // return <Redirect to='/' />
            })
            .catch(err => console.error(err));
    }
}

const createProfile = user => {
    return {
        type: CREATE_PROFILE,
        userDetails: user
    }
}