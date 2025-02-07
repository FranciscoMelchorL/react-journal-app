import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { firebaseAuth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { login, logout } from '../store/auth';
import { startLoadingNotes } from '../store/journal';

export const useCheckAuth = () => {
    const {status} = useSelector(state => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        onAuthStateChanged(firebaseAuth, async(user) => {
            if(!user) return dispatch(logout());
            const {uid, email, photoURL, displayName} = user;
            dispatch(login({uid, email, photoURL, displayName}));
            dispatch(startLoadingNotes());
        });
      
    }, [])

    return status;
}
