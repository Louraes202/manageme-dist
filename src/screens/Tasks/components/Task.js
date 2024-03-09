import { Box, Pressable, HStack, Badge, Text, Flex, Spacer } from "native-base";
import { useState, useffect } from "react";
import * as SQLite from "expo-sqlite";

const Task = ({ name, desc, group, category, date }) => {
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
              rounded="4"
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
          <Text mt="2" fontSize="sm" color="coolGray.700">
            {desc}
          </Text>
        </Box>
      </Pressable>
    </Box>
  );
};

export default Task;
