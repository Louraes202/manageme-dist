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
        fontFamily: 'Kode Mono',
        fontSize: 24,
        color: '#ffffff',
    },

    mainlogo: {
        width: width * 0.5, 
        height: height * 0.2, 
        marginBottom: 30,
    },
    });

export default styles;