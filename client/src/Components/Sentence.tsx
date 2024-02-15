import React from "react";
import { Text } from "@chakra-ui/react";

interface SentenceProps {
  text: string;
}

const Sentence = ({ text }: SentenceProps) => {
  return (
    <Text
      marginBottom="20px"
      fontSize="lg"
      color="gray.600"
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      borderColor="blue.300"
      bg="gray.50"
      boxShadow="sm"
    >
      {text}
    </Text>
  );
};

export default Sentence;
