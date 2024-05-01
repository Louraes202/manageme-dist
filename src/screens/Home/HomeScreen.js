import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import styles from "../../styles/styles"; // Importar estilos globais
import { Box, FlatList, Flex, Icon, Pressable, Spacer, VStack } from "native-base";
import { Dimensions } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const DataBox = ({ title, subtitle, description }) => {
  return (
    <Box
      width={160}
      height={160}
      margin={3}
      padding={3}
      backgroundColor={"transparent"}
      borderColor={"blue.500"}
      borderWidth={1.5}
      borderRadius={25}
    >
      <Text style={homestyles.boxtitle1}>{title}</Text>
      <Text style={homestyles.boxtitle2}>{subtitle}</Text>
      <Spacer />
      <Text style={homestyles.boxdesc}>{description}</Text>
    </Box>
  );
};

const NavBox = ({ title, subtitle, description, icon, text, color }) => {
  return (
    <Box
      height={60}
      margin={3}
      padding={2.5}
      backgroundColor={color}
      borderColor={color}
      borderWidth={1.5}
      borderRadius={10}
    >
      <Pressable flexDirection={'row'} alignItems={'center'}>
        <Icon
          m="2"
          size="6"
          color="white"
          as={<FontAwesome5 name={icon} />}
        />

        <Text style={homestyles.navtext}>{text}</Text>
      </Pressable>
    </Box>
  );
};

const Home = ({ navigation }) => {
  return (
    <ScrollView style={styles.screen}>
      <Text
        style={[
          styles.title_textscreen,
          { marginLeft: 10, marginTop: 10, marginBottom: -10 },
        ]}
      >
        Welcome back, Martim.
      </Text>

      <Flex
        direction="row"
        wrap="wrap"
        marginY={15}
        justifyItems={"center"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <DataBox title="0" subtitle="Tasks" description="To conclude today" />
        <DataBox title="0" subtitle="Habits" description="To fulfill today" />
        <DataBox title="0" subtitle="Activities" description="Going on today" />
        <DataBox title="0" subtitle="Projects" description="In progress" />
      </Flex>

      <Text style={[styles.title_textscreen, { marginLeft: 10 }]}>
        Navigate to
      </Text>
      <VStack marginBottom={10}>
        <NavBox icon='check' text='Tasks' color='blue.500'/>
        <NavBox icon='calendar-week' text='Planner' color='blue.500'/>
        <NavBox icon='bullseye' text='Habits' color='blue.500'/>
        <NavBox icon='chart-pie' text='Statistics & IA' color='blue.500'/>
      </VStack>
    </ScrollView>
  );
};

export default Home;

const homestyles = StyleSheet.create({
  boxtitle1: {
    fontFamily: "Poppins_Medium",
    fontSize: 24,
  },
  boxtitle2: {
    fontFamily: "Poppins",
    fontSize: 20,
  },
  boxdesc: {
    fontFamily: "Poppins",
  },
  navtext: {
    fontFamily: "Poppins_Medium",
    fontSize: 20,
    marginLeft: 7,
    color: '#ffffff',
  },
});
