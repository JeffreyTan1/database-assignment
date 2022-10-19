import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useColorMode,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { getCandidates } from "../helpers/queries";
import { useEffect } from "react";

type Props = {
  submitCallback: (values: any) => void;
  electionCode: string;
  electorateName: string;
};

const VoteCastingForm = (props: Props) => {
  const { colorMode } = useColorMode();
  const outerBgColor = colorMode === "light" ? "gray.100" : "gray.700";
  const innerBgColor = colorMode === "light" ? "white" : "gray.800";
  
  const formik = useFormik({
    initialValues: {
    },
    onSubmit: (values) => {
      props.submitCallback(values);
    },
  });

  useEffect(() => {
    const setCandidates = async () => {
      const payload = {
        election_code: props.electionCode,
        electorate_name: props.electorateName,
      };
      const candidates = await getCandidates(payload);
      formik.setFieldValue("candidates", candidates);
    };
  
    setCandidates();
  }, [])
  

  return (
    <Flex
      bg={outerBgColor}
      align="center"
      justify="center"
      py={10}
      rounded={"md"}
    >
      <Box bg={innerBgColor} minW={"40%"} maxW={"90%"} p={6} rounded="md">
        <form onSubmit={formik.handleSubmit}>
          <VStack spacing={4} align="flex-start">
            
            <Button type="submit" colorScheme="teal" width="full">
              Next
            </Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
};

export default VoteCastingForm;
