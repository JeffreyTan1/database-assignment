import {
  Box,
  Button,
  Flex,
  FormLabel,
  Input,
  VStack,
  useColorMode,
  Image,
  Grid,
  Text,
  Center,
  Divider,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { castVotes } from "../helpers/queries";
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
      candidatePreferences: [],
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
      const candidates = await castVotes(payload);
      const candidatesWithPreferences = candidates.data.map((candidate) => {
        return {
          ...candidate,
          preference: null,
        };
      });
      formik.setFieldValue("candidatePreferences", candidatesWithPreferences);
    };
  
    setCandidates();
  }, [])
  
  const handlePreferenceChange = (index: number, val: string) => {
    const candidatePreferences = formik.values.candidatePreferences;
    candidatePreferences[index].preference = val;
    formik.setFieldValue("candidatePreferences", candidatePreferences);
  }

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
            <Grid templateColumns="1fr 2fr 1fr" alignItems={"center"} columnGap={10}>
              <Image src={"/logo.png"} w={20} h={45} />
              <Text>House of Representitives Ballot Paper</Text>
              <Center rounded="full" border={"1px"} fontSize={'xs'}>
                Official Use Only
              </Center>
            </Grid>
            <Text fontWeight={'bold'}>Electoral Division of {props.electorateName}</Text>
            <Divider/>
            <Text fontSize={'lg'}>
              Number the boxes from 1 to {formik.values.candidatePreferences.length} in the order of your choice
            </Text>
            <Divider/>
            {formik?.values?.candidatePreferences?.map((candidate, index) => {
              const uniqueId = candidate.candidate_name + candidate.party_code;
              return (
                <Box id={uniqueId} key={uniqueId} w={'full'}>
                  <Grid
                    templateColumns="0.5fr 0.8fr 2fr"
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <FormLabel>{candidate.party_code}</FormLabel>
                    <Input
                      w={20}
                      type="number"
                      placeholder=""
                      value={candidate.preference}
                      onChange={(e) =>
                        handlePreferenceChange(index, e.target.value)
                      }
                    />
                    <FormLabel>{candidate.candidate_name}</FormLabel>
                  </Grid>
                </Box>
              );
            })}

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
