import React from "react";
import {
  Text,
  Image,
  VStack,
  Box,
  AspectRatio,
  Center,
  Stack,
  Heading,
  Pressable,
} from "native-base";

const truncateText = (text, limit) => {
  return text.length > limit ? text.substring(0, limit) + "..." : text;
};

const ProjectCard = ({ navigation, project }) => {
  return (
    <Box alignItems="center" mx={2}>
      <Box
        maxW="80"
        rounded="lg"
        overflow="hidden"
        borderColor="coolGray.200"
        borderWidth="1"
        _dark={{ borderColor: "coolGray.600", backgroundColor: "gray.700" }}
        _light={{ backgroundColor: "gray.50" }}
      >
        <AspectRatio w="100%" ratio={16 / 9}>
          <Image source={{ uri: project.imageUri }} alt="Project Image" />
        </AspectRatio>

        <Center
          bg="violet.500"
          _dark={{ bg: "violet.400" }}
          position="absolute"
          bottom="0"
          w={"100%"}
          py="1.5"
        ></Center>

        <Stack p="4" space={3}>
          <Heading size="md" ml="-1">
            {project.nome}
          </Heading>
          <Text mb={2}>{truncateText(project.descricao, 50)}</Text>
        </Stack>
      </Box>
    </Box>
  );
};

export default ProjectCard;
