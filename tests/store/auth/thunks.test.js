import { loginWithEmailPassword, logoutFirebase, registerUserWithEmailPassword, signInWithGoogle } from '../../../src/firebase/providers';
import { checkingCredentials, login, logout } from '../../../src/store/auth/authSlice';
import { checkingAuthentication, startCreatingUserWithEmailPassword, startGoogleSingIn, startLoginWithEmailPassword, startLogout } from '../../../src/store/auth/thunks';
import { clearNotesLogout } from '../../../src/store/journal';
import { demoUser } from '../../fixtures/authFixtures';

jest.mock('../../../src/firebase/providers');

describe('Pruebas en authThunks', () => {
    
    const dispatch = jest.fn();
    beforeEach(() => jest.clearAllMocks());

    test('Debe de invocar el checkingCredentials', async() => {

        await checkingAuthentication()( dispatch );
        expect( dispatch ).toHaveBeenCalledWith( checkingCredentials() );

    });

    test('startGoogleSingIn debe de llamar checkingCredentials y login - Éxito', async() => {

        const loginData = {ok: true, ...demoUser};
        await signInWithGoogle.mockResolvedValue( loginData );
        await startGoogleSingIn()( dispatch );

        expect( dispatch ).toHaveBeenCalledWith( checkingCredentials() );
        expect( dispatch ).toHaveBeenCalledWith( login( loginData ) );

    });

    test('startGoogleSingIn debe de llamar checkingCredentials y logout - Error', async() => {

        const loginData = {ok: false, errorMessage: 'Un error en Google'};
        await signInWithGoogle.mockResolvedValue( loginData );
        await startGoogleSingIn()( dispatch );

        expect( dispatch ).toHaveBeenCalledWith( checkingCredentials() );
        expect( dispatch ).toHaveBeenCalledWith( logout( loginData ) );

    });

    test('startLoginWithEmailPassword debe de llamar a checkingCredentials y login - Éxito', async() => {

        const loginData = {ok: true, ...demoUser};
        const formData = {email: demoUser.email, password: '123456'};

        await loginWithEmailPassword.mockResolvedValue( loginData );
        await startLoginWithEmailPassword( formData )( dispatch );

        expect( dispatch ).toHaveBeenCalledWith( checkingCredentials() );
        expect( dispatch ).toHaveBeenCalledWith( login( loginData ) );

    });
    
    test('startLoginWithEmailPassword debe de llamar a checkingCredentials y logout - Error', async() => {
        
        const loginData = {ok: false, ...demoUser};
        const formData = {email: demoUser.email, password: '123456'};
        
        await loginWithEmailPassword.mockResolvedValue( loginData );
        await startLoginWithEmailPassword( formData )( dispatch );
        
        expect( dispatch ).toHaveBeenCalledWith( checkingCredentials() );
        expect( dispatch ).toHaveBeenCalledWith( logout( loginData ) );
        
    });
    
    test('startCreatingUserWithEmailPassword debe de llamar a checkingCredentials y login - Éxito', async() => {
    
        const loginData = {ok: true, ...demoUser};
        const formData = {email: demoUser.email, password: '123456', displayName: demoUser.displayName};
    
        await registerUserWithEmailPassword.mockResolvedValue( loginData );
        await startCreatingUserWithEmailPassword( formData )( dispatch );
    
        expect( dispatch ).toHaveBeenCalledWith( checkingCredentials() );
        expect( dispatch ).toHaveBeenCalledWith( login( loginData ) );
    
    });

    test('startCreatingUserWithEmailPassword debe de llamar a checkingCredentials y logout - Error', async() => {
    
        const loginData = {ok: false, ...demoUser};
        const formData = {email: demoUser.email, password: '123456', displayName: demoUser.displayName};
    
        await registerUserWithEmailPassword.mockResolvedValue( loginData );
        await startCreatingUserWithEmailPassword( formData )( dispatch );
    
        expect( dispatch ).toHaveBeenCalledWith( checkingCredentials() );
        expect( dispatch ).toHaveBeenCalledWith( logout( loginData ) );
    
    });

    test('startLogout debe de llamar logoutFirebase, clearNotes y logout', async() => {

        await startLogout()( dispatch );

        expect( logoutFirebase ).toHaveBeenCalled();
        expect( dispatch ).toHaveBeenCalledWith( clearNotesLogout() );
        expect( dispatch ).toHaveBeenCalledWith( logout() );

    });

});