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
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import StepFrom from "./StepForm";


const theme = extendTheme({
  components: {
    Steps,
  },
});
export const App = () => (
  <ChakraProvider theme={theme}>
    <Box width={"container.xl"} mx={"auto"} my={"10"}>
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
        <StepFrom />
      </Box>
    </Box>
  </ChakraProvider>
);
