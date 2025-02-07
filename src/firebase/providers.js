import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { firebaseAuth } from "./config";

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async() => {
    try {
        const result = await signInWithPopup(firebaseAuth, googleProvider);
        // const credentials = GoogleAuthProvider.credentialFromResult(result);
        const {displayName, email, photoURL, uid} = result.user;
        return {
            ok: true,
            displayName,
            email,
            photoURL,
            uid
        }               

    } catch (error) {
        console.log(error);
        const errorCode = error.code;
        const errorMessage = error.message;
        return {ok: false, errorMessage}    
    }
}

export const registerUserWithEmailPassword = async({email, password, displayName}) => {
    try {
        const resp = await createUserWithEmailAndPassword(firebaseAuth, email, password);
        const {uid, photoURL} = resp.user;
        
        await updateProfile(firebaseAuth.currentUser, {displayName});

        return {ok: true, uid, photoURL, email, displayName}
        
    } catch (error) {
        if(error.message === 'Firebase: Error (auth/email-already-in-use).') error.message = 'correo  electrónico ya en uso.'
        return {ok: false, errorMessage: error.message}
    }
}

export const loginWithEmailPassword = async({email, password}) => {
    try {
        const resp = await signInWithEmailAndPassword(firebaseAuth, email, password);
        const {uid, displayName, photoURL} = resp.user;

        return {ok:true, uid, photoURL, displayName}
        
    } catch (error) {
        if(error.message === 'Firebase: Error (auth/invalid-credential).') error.message = 'usuario y/o contraseña incorrectos.'
        return {ok: false, errorMessage: error.message}
    }
}

export const logoutFirebase = async() => {
    return await firebaseAuth.signOut();
}