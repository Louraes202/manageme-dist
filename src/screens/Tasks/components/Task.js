import {
  Box,
  Pressable,
  HStack,
  Badge,
  Text,
  Flex,
  Spacer,
  Button,
  IconButton
} from "native-base";
import { useState, useEffect } from "react";
import * as SQLite from "expo-sqlite";
import { FaCheckCircle } from "react-icons/fa";
import { FontAwesome } from "@expo/vector-icons";

const Task = ({ name, key, desc, group, category, date, doTask, deleteTask, task, update, setUpdate }) => {
  const [done, setDone] = useState(false);
  const [dodelete, setDelete] = useState(false);

  useEffect(() => {
    if (dodelete) {
      deleteTask(task);
    }
  }, [dodelete]);

  useEffect(() => {
    if (done) {
      doTask(task);
    }
  }, [done]);

  return (
    <Box alignItems="center" marginY={2}>
      <Pressable
        onPress={() => console.log("I'm Pressed")}
        rounded="8"
        overflow="hidden"
        borderWidth="1"
        borderColor="coolGray.300"
        maxW="96"
        shadow="3"
        bg="coolGray.100"
        p="5"
        w="96"
      >
        <Box>
          <HStack alignItems="center">
            <Badge
              colorScheme="darkBlue"
              _text={{
                color: "white",
              }}
              variant="solid"
              rounded="30"
            >
              {group}
            </Badge>
            <Spacer />
            <Text fontSize={10} color="coolGray.800">
              1 month ago
            </Text>
          </HStack>
          <Text color="coolGray.800" mt="3" fontWeight="medium" fontSize="xl">
            {name}
          </Text>
          <HStack alignItems="center">
            <Text mt="2" fontSize="sm" color="coolGray.700">
              {desc}
            </Text>
            <Spacer />
            <IconButton style={{backgroundColor: 'blue', borderBottomEndRadius: 0, borderTopEndRadius: 0, width: 30, height: 25}} _icon={{as: FontAwesome, name: "check", color: "white"}} onPress={() => {setDone(true); setUpdate(true)}}/>
            <IconButton style={{backgroundColor: 'red', borderBottomStartRadius: 0, borderTopStartRadius: 0, width: 30, height: 25}} _icon={{as: FontAwesome, name: "trash", color: "white"}} onPress={() => {setDelete(true); setUpdate(true)}}/>
          </HStack>
        </Box>
      </Pressable>
    </Box>
  );
};

export default Task;
