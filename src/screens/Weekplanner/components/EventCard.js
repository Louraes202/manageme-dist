import React from "react";
import { Box, VStack, Text, Pressable, Icon, HStack } from "native-base";
import { Ionicons } from "@expo/vector-icons";

const EventCard = ({ event, onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <Box
        borderWidth="1"
        borderColor="coolGray.300"
        borderRadius="md"
        p={3}
        mb={2}
        mr={2}
        bg="white"
        w={120}
      >
        <VStack space={2}>
          <Text fontSize="lg" bold>
            {event.nome}
          </Text>
          <Text color="coolGray.500" isTruncated maxWidth="70%">
            {event.descricao}
          </Text>
          <HStack alignItems="center" space={2}>
            <Icon as={Ionicons} name="calendar-alt" size="sm" color="coolGray.400" />
            <Text fontSize="xs" color="coolGray.500">
              {event.horaInicio}
            </Text>
          </HStack>
        </VStack>
      </Box>
    </Pressable>
  );
};

export default EventCard;
