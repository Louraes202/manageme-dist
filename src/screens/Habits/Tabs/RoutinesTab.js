import React from "react";
import { View } from "react-native";
import styles from "../../../styles/styles";
import { useIsFocused } from "@react-navigation/native";

const RoutinesTab = ({ navigation }) => {
    const isFocused = useIsFocused();
    return ( 
        <View style={styles.screen}>

        </View>
    );
}
 
export default RoutinesTab;