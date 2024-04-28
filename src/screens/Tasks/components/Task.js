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
import { differenceInMinutes, formatDistanceToNow } from 'date-fns';
import { useGlobalContext } from "../../../context/GlobalProvider";

const Task = ({ task, name, desc, groupName, onPress, createdAt, deleteTask, doTask, setUpdateTasks }) => {
  const [done, setDone] = useState(false);
  const [dodelete, setDelete] = useState(false);

  const { updateTasks } = useGlobalContext();

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

  useEffect(() => {
    setTimeAgo(!isNaN(createdAtDate) ? formatDistanceToNow(createdAtDate, { addSuffix: true }) : "Data indisponível");
    setUpdateTasks(false);
  }, [updateTasks])


  const createdAtDate = new Date(createdAt);
  
  // Calcular a diferença de tempo em relação ao agora
  const [timeAgo, setTimeAgo] = useState(!isNaN(createdAtDate) ? formatDistanceToNow(createdAtDate, { addSuffix: true }) : "Data indisponível");


  return (
    <Box alignItems="center" marginY={2}>
      <Pressable
        onPress={onPress}
        rounded="8"
        overflow="hidden"
        borderWidth="1"
        borderColor="coolGray.300"
        maxW="400"
        shadow="3"
        bg="coolGray.100"
        m='3'
        p="5"
        w="364"
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
              {groupName}
            </Badge>
            <Spacer />
            <Text fontSize={10} color="coolGray.800">
              {timeAgo}
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
            <IconButton style={{backgroundColor: 'blue', borderBottomEndRadius: 0, borderTopEndRadius: 0, width: 30, height: 25}} _icon={{as: FontAwesome, name: "check", color: "white"}} onPress={() => {setDone(true); setUpdateTasks(true)}}/>
            <IconButton style={{backgroundColor: 'red', borderBottomStartRadius: 0, borderTopStartRadius: 0, width: 30, height: 25}} _icon={{as: FontAwesome, name: "trash", color: "white"}} onPress={() => {setDelete(true); setUpdateTasks(true)}}/>
          </HStack>
        </Box>
      </Pressable>
    </Box>
  );
};

export default Task;
