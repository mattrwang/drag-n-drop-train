import {
  Button,
  Flex,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Text,
  useToast,
} from "@chakra-ui/react";
import FileUpload from "./FileUpload";
import React, { useState } from "react";

interface FormProps {
  onFormSubmit: (
    file: File | null,
    strength: number,
    sentences: number
  ) => void;
}

const Form = ({ onFormSubmit }: FormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [strength, setStrength] = useState<number>(1);
  const [numSentences, setNumSentences] = useState<number>(1);
  const toast = useToast();

  const handleFileUpload = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const handleSliderChange = (value: number) => {
    setStrength(value);
  };

  const sliderValueToText = (value: number) => {
    switch (value) {
      case 1:
        return "Very Weak";
      case 2:
        return "Weak";
      case 3:
        return "Strong";
      case 4:
        return "Very Strong";
      default:
        return "";
    }
  };

  const handleNumberChange = (value: number) => {
    setNumSentences(value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: `Error training model`,
        description: "Please upload a .txt file",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } else {
      onFormSubmit(file, strength, numSentences);
    }
  };

  return (
    <Flex
      width="full"
      height="100vh"
      justifyContent="center"
      alignItems="center"
      bg="gray.100"
    >
      <Flex width="full" alignItems="center" justifyContent="space-evenly">
        <FileUpload onFileUploaded={handleFileUpload} />
        <form onSubmit={onSubmit}>
          <Flex height="400px" flexDir="column" justifyContent="space-evenly">
            <Flex flexDir="column">
              <Text color="gray.600" fontWeight="800" fontSize="20px">
                Select strength of the model:
              </Text>
              <Text fontSize="12px" color="gray.600">
                Note: stronger options will take longer to train.
              </Text>
              <Slider
                id="slider"
                marginTop="8px"
                marginLeft="10px"
                defaultValue={1}
                min={1}
                max={4}
                step={1}
                onChange={(val) => handleSliderChange(val)}
                focusThumbOnChange={false}
              >
                <SliderTrack bg="gray.200">
                  <SliderFilledTrack bg="blue.300" />
                </SliderTrack>
                <SliderThumb boxSize={6} />
              </Slider>
              <Text fontSize="sm" color="gray.600">
                {`Strength: ${sliderValueToText(strength)}`}
              </Text>
            </Flex>
            <Flex flexDir="column">
              <Text color="gray.600" fontWeight="600" fontSize="20px">
                Number of sentences to generate:
              </Text>
              <Slider
                id="slider"
                marginTop="8px"
                marginLeft="10px"
                defaultValue={1}
                min={1}
                max={10}
                step={1}
                onChange={(val) => handleNumberChange(val)}
                focusThumbOnChange={false}
              >
                <SliderTrack bg="gray.200">
                  <SliderFilledTrack bg="blue.300" />
                </SliderTrack>
                <SliderThumb boxSize={6} />
                {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => (
                  <SliderMark
                    key={value}
                    value={value}
                    mt="15px"
                    ml="-4px"
                    fontSize="sm"
                    color="gray.600"
                  >
                    {value}
                  </SliderMark>
                ))}
              </Slider>
            </Flex>
            <Button
              mt="100px"
              width="200px"
              type="submit"
              fontWeight="400"
              bg="blue.300"
              color="gray.50"
              _hover={{ bg: "blue.500" }}
            >
              Train and Generate
            </Button>
          </Flex>
        </form>
      </Flex>
    </Flex>
  );
};

export default Form;
