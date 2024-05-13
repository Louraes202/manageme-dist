import { View } from "react-native";
import * as SQLite from "expo-sqlite";
import getPieData from "../components/PieChartComponent";
import CustomPieChart from "../components/PieChartComponent";
import styles from "../../../styles/styles";

const StatisticsTab = () => {
  return (
    <View style={styles.screen}>
      <CustomPieChart pieData={getPieData} />
    </View>
  );
};

export default StatisticsTab;
