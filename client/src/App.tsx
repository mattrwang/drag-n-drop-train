import React, { useState } from "react";
import "./App.css";
import { Button, Flex } from "@chakra-ui/react";
import Form from "./Components/Form";
import SentenceStack from "./Components/SentenceStack";
import Loading from "./Components/Loading";

function App() {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [generated, setGenerated] = useState<boolean>(false);
  const [data, setData] = useState<string[]>([]);

  const onSubmit = async (
    file: File | null,
    strength: number,
    sentences: number
  ) => {
    setSubmitted(true);

    if (file) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const fileContent = e.target?.result;

        try {
          const response = await fetch("http://localhost:5000/generate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              strength,
              num_sentences: sentences,
              fileContent,
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const responseData = await response.json();
          setData(responseData["sentences"]);
          setGenerated(true);
        } catch (error) {
          console.error("Failed to send data to the backend:", error);
        }
      };

      reader.readAsText(file);
    } else {
      console.error("No file provided");
    }
  };

  const onGenerateNew = () => {
    setSubmitted(false);
    setGenerated(false);
  };

  return (
    <Flex>
      {!submitted && <Form onFormSubmit={onSubmit} />}
      {submitted && !generated && <Loading />}
      {generated && (
        <Flex width="full">
          <Flex
            width="full"
            justifyContent="flex-end"
            position="absolute"
            padding="20px"
          >
            <Button
              bg="blue.300"
              _hover={{ bg: "blue.500" }}
              color="gray.50"
              onClick={onGenerateNew}
            >
              Generate New
            </Button>
          </Flex>

          <SentenceStack data={data} />
        </Flex>
      )}
    </Flex>
  );
}

export default App;
