import { Flex, Text } from "@chakra-ui/react";
import Sentence from "./Sentence";

interface SentenceStackProps {
  data: String[];
}

const SentenceStack = ({ data }: SentenceStackProps) => {
  return (
    <Flex
      width="full"
      flexDir="column"
      alignItems="center"
      bg="gray.100"
      minHeight="100vh"
    >
      <Text
        fontSize="20px"
        marginTop="50px"
        fontWeight="800"
        marginBottom="20px"
      >
        Generated Sentences:
      </Text>
      <Flex flexDir="column">
        {data.map((sentence) => (
          <Sentence text={String(sentence)} />
        ))}
      </Flex>
    </Flex>
  );
};

export default SentenceStack;
