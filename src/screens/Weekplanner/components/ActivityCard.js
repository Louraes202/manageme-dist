import React from 'react';
import { Text, VStack, HStack, Box, Pressable } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

const ActivityCard = ({ activity, onPress }) => {
  return (
    <Pressable onPress={() => onPress(activity)}>
      <Box borderWidth={1} borderColor="coolGray.300" borderRadius="md" p={4} mb={4}>
        <VStack space={2}>
          <HStack justifyContent="space-between" alignItems="center">
            <Text fontSize="md" bold>
              {activity.nomeAtividade}
            </Text>
            <Ionicons name="chevron-forward-outline" size={20} />
          </HStack>
          <Text fontSize="xs" color="coolGray.600">
            {activity.descricaoAtividade}
          </Text>
        </VStack>
      </Box>
    </Pressable>
  );
};

export default ActivityCard;
