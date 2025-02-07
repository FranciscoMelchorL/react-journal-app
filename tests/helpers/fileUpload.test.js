import { fileUpload } from '../../src/helpers/fileUpload';
import { v2 as cloudinary } from 'cloudinary';
import { getEnvironments } from '../../src/helpers/getEnvironments';

const { VITE_CLOUD_NAME, VITE_API_KEY, VITE_API_SECRET } = getEnvironments();

cloudinary.config(
    {
        cloud_name: VITE_CLOUD_NAME,
        api_key: VITE_API_KEY,
        api_secret: VITE_API_SECRET,
        secure: true,
    }
)

describe('Pruebas en "fileUpload"', () => {

    test('Debe de subir el archivo correctamente a Cloudinary', async() => {

        const imageURL = 'https://www.adorama.com/alc/wp-content/uploads/2018/11/landscape-photography-tips-yosemite-valley-feature.jpg';
        const resp = await fetch( imageURL );
        const blob = await resp.blob();
        const file = new File( [blob], 'landscape.jpg' );
        const url = await fileUpload( file );

        expect( typeof url ).toBe( 'string' );

        const segments = url.split('/');
        const imageID = segments[ segments.length-1 ].replace( '.jpg', '' );

        await cloudinary.api.delete_resources( [imageID] );

    });

    test('Debe de retornar null', async() => {

        const file = new File( [], 'null.jpg' );
        const url = await fileUpload( file );

        expect( url ).toBe( null );

    });

});