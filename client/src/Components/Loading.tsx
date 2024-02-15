import { Flex, Spinner, Text } from "@chakra-ui/react";

const Loading = () => {
  return (
    <Flex
      direction="column"
      width="full"
      height="100vh"
      justifyContent="center"
      alignItems="center"
      bg="gray.100"
    >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.300"
        size="xl"
      />
      <Text mt="10px" color="gray.600" fontSize="20px">
        Loading...
      </Text>
      <Text color="gray.600" fontSize="14px">
        This may take a minute
      </Text>
    </Flex>
  );
};

export default Loading;
