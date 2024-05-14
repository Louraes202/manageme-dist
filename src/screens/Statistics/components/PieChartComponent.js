import React from "react";
import { View, Text } from "react-native";
import { PieChart as GiftedPieChart } from "react-native-gifted-charts";
import * as SQLite from "expo-sqlite";
import styles from "../../../styles/styles";

const renderDot = (color) => (
  <View
    style={{
      height: 10,
      width: 10,
      borderRadius: 5,
      backgroundColor: color,
      marginRight: 10,
    }}
  />
);

const renderLegendComponent = () => {
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginBottom: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: 120,
            marginRight: 20,
          }}
        >
          {renderDot("#006DFF")}
          <Text style={{ color: "white" }}>Excellent: 47%</Text>
        </View>
        <View
          style={{ flexDirection: "row", alignItems: "center", width: 120 }}
        >
          {renderDot("#8F80F3")}
          <Text style={{ color: "white" }}>Okay: 16%</Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: 120,
            marginRight: 20,
          }}
        >
          {renderDot("#3BE9DE")}
          <Text style={{ color: "white" }}>Good: 40%</Text>
        </View>
        <View
          style={{ flexDirection: "row", alignItems: "center", width: 120 }}
        >
          {renderDot("#FF7F97")}
          <Text style={{ color: "white" }}>Poor: 3%</Text>
        </View>
      </View>
    </>
  );
};

const CustomPieChart = ({ data }) => (

    <View
      style={{
        margin: 20,
        padding: 16,
        borderRadius: 20,
        backgroundColor: "#232B5D",
      }}
    >
      <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
        Performance
      </Text>
      <View style={{ padding: 20, alignItems: "center" }}>
        <GiftedPieChart
          data={data}
          donut
          showGradient
          sectionAutoFocus
          radius={90}
          innerRadius={60}
          innerCircleColor={"#232B5D"}
          centerLabelComponent={() => (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text
                style={{ fontSize: 22, color: "white", fontWeight: "bold" }}
              >
                47%
              </Text>
              <Text style={{ fontSize: 14, color: "white" }}>Excellent</Text>
            </View>
          )}
        />
      </View>
      {renderLegendComponent}
    </View>
);

export default CustomPieChart;
