import React from "react";
import "./App.css";
import { Box } from "@chakra-ui/react";
import FileUpload from "./Components/FileUpload";

function App() {
  return (
    <Box padding="50px">
      <FileUpload />
    </Box>
  );
}

export default App;
