import {
  ChakraProvider,
  Box,
  Text,
  Image,
  extendTheme,
  Grid,
  GridItem,
  Flex,
  FormControl,
  Input,
  FormLabel,
  Button,
} from "@chakra-ui/react";
import { StepsStyleConfig as Steps } from "chakra-ui-steps";
import { useFormik } from "formik";
import { useState } from "react";
import { ColorModeSwitcher } from "./components/ColorModeSwitcher";
import StepFrom from "./components/MultiStepForm";

const theme = extendTheme({
  components: {
    Steps,
  },
});

const App = () => {
  const [stepFormRenderCount, setStepFormRenderCount] = useState(0);
  const [activeElectionCode, setActiveElectionCode] = useState(null);

  const settingsFormik = useFormik({
    initialValues: {
      election_code: "",
    },
    onSubmit: (values) => {
      setActiveElectionCode(values.election_code);
    },
  });

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
          <Image src={"/logo.png"} width={"30%"} />
          <Text
            fontSize={"xl"}
            color={"teal.500"}
            fontWeight={"semibold"}
            textAlign={"center"}
          >
            Federal Election App
          </Text>
          <GridItem justifySelf={"end"}>
            <ColorModeSwitcher />
          </GridItem>
        </Grid>

        <Box p={"3%"}>
          {!activeElectionCode ? (
            <form onSubmit={settingsFormik.handleSubmit}>
              <Flex justifyContent={"center"} alignItems={"end"} gap={5}>
                <FormControl id="election_code" isRequired w={"15%"}>
                  <FormLabel>Election Code</FormLabel>
                  <Input
                    type="text"
                    placeholder="Election Code"
                    value={settingsFormik.values.election_code}
                    onChange={settingsFormik.handleChange}
                  />
                </FormControl>
                <Button type="submit" colorScheme="teal" w={"10%"}>
                  Set
                </Button>
              </Flex>
            </form>
          ) : (
            <StepFrom
              key={stepFormRenderCount}
              setRenderCount={setStepFormRenderCount}
              electionCode={activeElectionCode}
            />
          )}
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default App;
