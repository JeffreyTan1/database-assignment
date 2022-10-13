import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Flex,
  Image,
  HStack,
  extendTheme,
} from "@chakra-ui/react";
import { StepsStyleConfig as Steps } from "chakra-ui-steps";
import { useState } from "react";
import { ColorModeSwitcher } from "./components/ColorModeSwitcher"
import StepFrom from "./components/StepForm";

const theme = extendTheme({
  components: {
    Steps,
  },
});

const App = () => {
  const [stepFormRenderCount, setStepFormRenderCount] = useState(0);

  return (
  <ChakraProvider theme={theme}>
    <Box mx={"auto"} maxW={"container.xl"} my={10} px={10}>
      <Flex
        width={"full"}
        justifyContent={"space-between"}
        alignItems={"center"}
        px={2}
        py={4}
        borderBottomWidth={1}
      >
        <Image src={"/logo.png"} width={85} />
        <Text fontSize={"2xl"} color={"teal.500"} fontWeight={"semibold"}>
          Federal Election App
        </Text>
        <ColorModeSwitcher />
      </Flex>

      <Box p={14}>
        <StepFrom key={stepFormRenderCount} setRenderCount={setStepFormRenderCount}/>
      </Box>
    </Box>
  </ChakraProvider>)
};

export default App;