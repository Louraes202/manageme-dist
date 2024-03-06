import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1c73ff',
        alignItems: 'center',
        justifyContent: 'center',
    },

    maintext: {
        fontFamily: 'Poppins',
        fontSize: 24,
        color: '#ffffff',
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
        backgroundColor: '#1c73ff',
        padding: 10
    },
});

export default styles;