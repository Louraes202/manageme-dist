import { StyleSheet, Dimensions } from 'react-native';
import Colors from '../../assets/utils/pallete.json';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container_loading: {
        flex: 1,
        backgroundColor: Colors.navblue,
        alignItems: 'center',
        justifyContent: 'center',
    },

    maintext_loading: {
        fontFamily: 'Poppins',
        fontSize: 24,
        color: '#ffffff',
    },

    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        alignItems: 'center',
        justifyContent: 'center',
    },

    maintext: {
        fontFamily: 'Poppins',
        fontSize: 24,
        color: '#000000',
    },

    mainlogo: {
        width: width * 0.5, 
        height: height * 0.2, 
        marginBottom: 30,
    },

    input: {
        width: width * 0.7,
        marginVertical: 15,
    },

    button: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        marginVertical: 10,
        alignItems: 'center',
        width: width * 0.7, // Use 100% da largura disponível
        borderRadius: 20,
    },

    buttonText: {
        color: '#fff',
        fontSize: 18,
    },

    authmaintext: {
        fontFamily: 'Kode Mono',
        fontSize: 24,
        color: '#ffffff',
        marginTop: 20,
    },

    screen: {
        flex: 1,
        backgroundColor: "#ffffff",
        padding: 10
    },

    /*New styles*/

    title_text : {
        fontFamily: 'Poppins_Medium',
        fontSize: 24,
    },

    title_textscreen : {
        fontFamily: 'Poppins',
        fontSize: 24,
    }
});

export default styles;