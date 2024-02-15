import React, { useCallback } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import {
  Text,
  useToast,
  Flex,
  Box,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { IoFolderOpen } from "react-icons/io5";

interface FileUploadProps {
  onFileUploaded: (file: File) => void;
}

const FileUpload = ({ onFileUploaded }: FileUploadProps) => {
  const toast = useToast();
  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      acceptedFiles.forEach((file) => {
        onFileUploaded(file);
        toast({
          title: `File uploaded: ${file.name}`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      });

      fileRejections.forEach(({ file, errors }) => {
        errors.forEach((error) => {
          toast({
            title: `Error uploading file: ${file.name}`,
            description: error.message,
            status: "error",
            duration: 2000,
            isClosable: true,
          });
        });
      });
    },
    [onFileUploaded, toast]
  );

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "text/plain": [".txt"],
    },
  });

  return (
    <Flex
      height="400px"
      width="400px"
      bg="white"
      boxShadow="xl"
      borderRadius="lg"
      alignItems="center"
      justifyContent="center"
      flexDir="column"
    >
      <Text fontWeight="800" fontSize="20px" color="gray.600">
        Upload your file
      </Text>
      <Text color="gray.500" fontSize="14px">
        File should be .txt
      </Text>
      <Box
        marginTop="36px"
        marginBottom="20px"
        p={5}
        maxWidth="350px"
        borderRadius="lg"
        bg="gray.50"
        textAlign="center"
        w={["90%", "md"]}
        h="200px"
        border="3px dashed"
        borderColor="blue.300"
      >
        <Flex
          {...getRootProps()}
          direction="column"
          align="center"
          justify="center"
          h="100%"
        >
          <input {...getInputProps()} />
          <IoFolderOpen size="50" color="63B3ED" />
          <Text mt={2} color="gray.500">
            Drag & drop your file here
          </Text>
        </Flex>
      </Box>
      <List spacing={3}>
        {acceptedFiles.map((file) => (
          <ListItem key={file.name}>
            <ListIcon as={CheckCircleIcon} color="green.500" />
            {file.name} - {file.size} bytes
          </ListItem>
        ))}
      </List>
    </Flex>
  );
};

export default FileUpload;
