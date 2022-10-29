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
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { StepsStyleConfig as Steps } from "chakra-ui-steps";
import { useFormik } from "formik";
import { useState } from "react";
import { ColorModeSwitcher } from "./components/ColorModeSwitcher";
import MultiStepForm from "./components/MultiStepForm";

const theme = extendTheme({
  components: {
    Steps,
  },
});

const App = () => {
  const [stepFormRenderCount, setStepFormRenderCount] = useState(0);
  const [activeElectionCode, setActiveElectionCode] = useState("1");
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [targetTable, setTargetTable] = useState('');

  const handleAdminModalClose = () => {
    setShowAdminModal(false);
    setTargetTable("");
  };

  const handleModalOpen = (table: string) => {
    setShowAdminModal(true);
    setTargetTable(table);
  };

  return (
    <ChakraProvider theme={theme}>
      <Box mx={"auto"} maxW={"container.xl"} my={10} px={10}>
        <Modal isOpen={showAdminModal} onClose={handleAdminModalClose} size={"6xl"}>
          <ModalOverlay />
          <ModalContent h={"80vh"} w={"80rem"}>
            <ModalHeader>{targetTable} Table</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <iframe
                title="admin"
                src={`https://titan.csit.rmit.edu.au/~s3851781/view_table.php?table=${targetTable}`}
                width="100%"
                height="100%"
              />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="teal" mr={3} onClick={handleAdminModalClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

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

        <Box my={10}>
          {activeElectionCode ? (
            <MultiStepForm
              key={stepFormRenderCount}
              setRenderCount={setStepFormRenderCount}
              electionCode={activeElectionCode}
            />
          ) : (
            <Flex h={"30rem"} justifyContent={"center"} alignItems={"center"} flexDir={'column'}>
              <Text>You must set an election code to use this app!</Text>
              <Text>Set this in the Admin Panel</Text>
              <Text fontSize={"4xl"} transform={"rotate(-90deg)"} position={'relative'} top={65}>👈</Text>
            </Flex>
          )}
        </Box>

        <Box
          p={8}
          rounded={"md"}
          shadow={"xl"}
          border={"1px"}
          borderColor={"gray.100"}
          bg={"inherit"}
        >
          <Text fontSize={"lg"} fontWeight={"bold"}>
            Admin Panel
          </Text>
          <Text decoration={"underline"} textUnderlineOffset={3} my={3}>
            View Tables
          </Text>
          <HStack>
            {["Preference", "Ballot", "Voter", "Issuance"].map((table) => (
              <Button key={table} onClick={() => handleModalOpen(table)}>
                {table}
              </Button>
            ))}
          </HStack>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default App;
