import { collection, deleteDoc, getDocs } from 'firebase/firestore/lite';
import { addNewEmptyNote, deleteNoteById, savingNewNote, setActiveNote, setNotes, setPhotosToActiveNote, setSaving, updateNote } from '../../../src/store/journal/journalSlice';
import { startDeletingNote, startLoadingNotes, startNewNote, startSaveNote, startUploadingFiles } from '../../../src/store/journal/thunks';
import { firebaseDB } from '../../../src/firebase/config';
import { loadNotes } from '../../../src/helpers';

describe('Pruebas en journalThunks', () => {

    const dispatch = jest.fn();
    const getState = jest.fn();

    beforeEach(() => jest.clearAllMocks());

    test('startNewNote debe de crear una nueva nota', async() => {

        const uid = 'TEST-UID';
        getState.mockReturnValue( { auth: { uid: uid } } );
        await startNewNote()( dispatch, getState );

        expect( dispatch ).toHaveBeenCalledWith( savingNewNote() );
        expect( dispatch ).toHaveBeenCalledWith( addNewEmptyNote( {
            body: '',
            title: '',
            id: expect.any( String ),
            date: expect.any( Number ),
        } ) );

        expect( dispatch ).toHaveBeenCalledWith( setActiveNote( {
            body: '',
            title: '',
            id: expect.any( String ),
            date: expect.any( Number ),
        } ) );

        // Borrar de Firebase

        const collectionRef = collection(firebaseDB, `${uid}/journal/notes`);
        const docs = await getDocs( collectionRef );

        const deletePromises = [];
        docs.forEach( doc => deletePromises.push( deleteDoc( doc.ref ) ) );
        await Promise.all( deletePromises );

    });

    test('startLoadingNotes debe de cargar todas las notas', async() => {

        const uid = 'TEST-UID';
        getState.mockReturnValue( { auth: { uid: uid } } );
        await startLoadingNotes()( dispatch, getState );

        expect( dispatch ).toHaveBeenCalledWith( setNotes( await loadNotes( uid ) ) );

    });

    test('startSaveNote debe de guardar la nota activa', async() => {

        const uid = 'TEST-UID';
        const active = { id: new Date().getTime() };
        getState.mockReturnValue( { auth: { uid: uid }, journal: { active: active } } );
        await startSaveNote()( dispatch, getState );

        expect( dispatch ).toHaveBeenCalledWith( setSaving() );
        expect( dispatch ).toHaveBeenCalledWith( updateNote( active ) );

    });
    
    test('startUploadingFiles debe de subir las fotos', async() => {
        
        const files = [];
        await startUploadingFiles( files )( dispatch );
        
        expect( dispatch ).toHaveBeenCalledWith( setSaving() );
        expect( dispatch ).toHaveBeenCalledWith( setPhotosToActiveNote( files) );
        
    });

    test('startDeletingNote debe de eliminar la nota activa', async() => {

        const uid = 'TEST-UID';
        const active = { id: new Date().getTime() };
        getState.mockReturnValue( { auth: { uid: uid }, journal: { active: active } } );
        await startDeletingNote()( dispatch, getState );

        expect( dispatch ).toHaveBeenCalledWith( deleteNoteById( active.id ) );

    });
    
});