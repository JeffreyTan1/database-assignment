import {
  ChakraProvider,
  Box,
  Text,
  Image,
  extendTheme,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { StepsStyleConfig as Steps } from "chakra-ui-steps";
import { useState } from "react";
import { ColorModeSwitcher } from "./components/ColorModeSwitcher"
import StepFrom from "./components/MultiStepForm";

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
        <Grid
          width={"full"}
          px={2}
          py={4}
          borderBottomWidth={1}
          gridTemplateColumns={"repeat(3, 1fr)"}
          alignItems={"center"}
        >
          <Image src={"/logo.png"} width={'30%'} />
          <Text
            fontSize={"xl"}
            color={"teal.500"}
            fontWeight={"semibold"}
            textAlign={"center"}
          >
            Federal Election App
          </Text>
          <GridItem justifySelf={'end'}>
            <ColorModeSwitcher />
          </GridItem>
        </Grid>

        <Box p={"3%"}>
          <StepFrom
            key={stepFormRenderCount}
            setRenderCount={setStepFormRenderCount}
          />
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default App;