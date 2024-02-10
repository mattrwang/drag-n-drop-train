import React, { useCallback } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Text, useToast, Flex, Box } from "@chakra-ui/react";
import { IoFolderOpen } from "react-icons/io5";

const FileUpload: React.FC = () => {
  const toast = useToast();
  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      acceptedFiles.forEach((file) => {
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
            description: "File type must be .txt",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
        });
      });
    },
    [toast]
  );

  const { getRootProps, getInputProps } = useDropzone({
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
      boxShadow="xl"
      borderRadius="lg"
      alignItems="center"
      justifyContent="center"
      flexDir="column"
    >
      <Text fontWeight="800" fontSize="20px">
        Upload your file
      </Text>
      <Text color="gray.500" fontSize="14px">
        File should be .txt
      </Text>
      <Box
        marginTop="36px"
        p={5}
        maxWidth="350px"
        borderRadius="lg"
        bg="gray.100"
        textAlign="center"
        w={["90%", "md"]}
        h="200px"
        border="3px dashed"
        borderColor="orange.200"
      >
        <Flex
          {...getRootProps()}
          direction="column"
          align="center"
          justify="center"
          h="100%"
        >
          <input {...getInputProps()} />
          <IoFolderOpen size="50" color="orange" />
          <Text mt={2} color="gray.500">
            Drag & drop your file here
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
};

export default FileUpload;
