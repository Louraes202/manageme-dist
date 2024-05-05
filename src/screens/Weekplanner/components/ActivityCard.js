import React, { useState } from 'react';
import { Box, VStack, HStack, Text, Badge, Pressable } from 'native-base';
import Draggable from 'react-native-draggable';
import { Ionicons } from '@expo/vector-icons';

const ActivityCard = ({ activity, isDraggable, onDrop, onPress }) => {
  const initialPosition = { x: 0, y: 0 };
  const [position, setPosition] = useState(initialPosition);

  const resetPosition = () => {
    setPosition(initialPosition);
  };

  return (
    <Pressable onPress={() => onPress(activity)}>
      <Box borderWidth={1} borderColor="coolGray.300" borderRadius="md" p={4} mb={4} zIndex={999}>
        <VStack space={2}>
          <HStack justifyContent="space-between" alignItems="center">
            <Text fontSize="md" bold>{activity.nomeAtividade}</Text>
            <Ionicons name="chevron-forward-outline" size={20} />
          </HStack>
          <Text fontSize="xs" color="coolGray.600">{activity.descricaoAtividade}</Text>
          {activity.nomeGrupo && (
            <Badge colorScheme="blue" alignSelf="flex-start">
              {activity.nomeGrupo}
            </Badge>
          )}
        </VStack>
      </Box>
    </Pressable>
  );

};

export default ActivityCard;
