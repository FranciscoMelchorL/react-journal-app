import { collection, deleteDoc, doc, setDoc } from 'firebase/firestore/lite';
import { firebaseDB } from '../../firebase/config';
import { addNewEmptyNote, deleteNoteById, savingNewNote, setActiveNote, setNotes, setPhotosToActiveNote, setSaving, updateNote } from './';
import { fileUpload, loadNotes } from '../../helpers';

export const startNewNote = () => {
    return async(dispatch, getState) => {

        dispatch(savingNewNote());

        const {uid} = getState().auth;
        
        const newNote = {
            title: '',
            body: '',
            date: new Date().getTime()
        }

        const newDoc = doc(collection(firebaseDB, `${uid}/journal/notes`));
        await setDoc(newDoc, newNote); 
        
        newNote.id = newDoc.id;
        
        dispatch(addNewEmptyNote(newNote));
        dispatch(setActiveNote(newNote));

    }
}

export const startLoadingNotes = () => {
    return async(dispatch, getState) => {
        const {uid} = getState().auth;
        
        const notes = await loadNotes(uid);
        
        dispatch(setNotes(notes));
        
    }
}

export const startSaveNote = () => {
    return async(dispatch, getState) => {
        dispatch(setSaving());

        const {uid} = getState().auth;
        const {active} = getState().journal;

        const note = {...active};
        delete note.id;
        
        const docRef = doc(firebaseDB, `${uid}/journal/notes/${active.id}`);
        await setDoc(docRef, note, {merge:true});

        dispatch(updateNote(active));
    }
}

export const startUploadingFiles = (files = []) => {
    return async(dispatch) => {
        dispatch(setSaving());

        const fileUploadPromises = [];
        for (const file of files) {
            fileUploadPromises.push(fileUpload(file));
        }

        const photosURLs = await Promise.all(fileUploadPromises);
        dispatch(setPhotosToActiveNote(photosURLs));
        
    }
}

export const startDeletingNote = () => {
    return async(dispatch, getState) => {
        const {uid} = getState().auth;
        const {active} = getState().journal;
        
        const docRef = doc(firebaseDB, `${uid}/journal/notes/${active.id}`);
        await deleteDoc(docRef);

        dispatch(deleteNoteById(active.id));
        
    }
}