import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import { useFormik } from "formik";
import { useState } from "react";
import { doesVoterExist, hasNotPreviouslyVoted } from "../helpers/queries";
import VoterIDForm from "./VoterIDForm";
import VoteCastingForm from "./VoteCastingForm";

type Props = {
  setRenderCount: any;
  electionCode: string;
};

interface VoterIDValues {
  voter_f_name: string;
  voter_l_name: string;
  voter_dob: string;
  voter_r_address: string;
}

interface CastVotesValues {}

const StepForm = (props: Props) => {
  const { colorMode } = useColorMode();
  const settingsBubbleColor = colorMode === "light" ? "#13d4ba50" : "#00a89150";
  const toast = useToast();
  const { nextStep, activeStep } = useSteps({
    initialStep: 0,
  });
  const [voterIDData, setVoterIDData] = useState<VoterIDValues | null>(null);
  const [electorateName, setElectorateName] = useState<string | null>(null);

  const resetStepForm = () => {
    props.setRenderCount((prev: number) => prev + 1);
  };

  const handleVoterIDSubmit = async (values: VoterIDValues) => {
    if (!values) return;

    // Check if voter is registered
    const {
      success: voterExists,
      message: voterExistsMessage,
      electorateName: voterElectorateName,
    } = await doesVoterExist(values);
    toast({
      title: voterExists ? "Voter validated" : "Voter not found",
      description: voterExistsMessage,
      status: voterExists ? "success" : "error",
      duration: voterExists ? 1000 : 4000,
      isClosable: true,
    });
    if (!voterExists) {
      resetStepForm();
      return;
    }

    // Check if already voted
    const { success: notPreviouslyVoted, message: notPreviouslyVotedMessage } =
      await hasNotPreviouslyVoted({
        ...values,
        election_code: props.electionCode,
      });
    toast({
      title: notPreviouslyVoted
        ? "Voter has not voted"
        : "Voter has voted before",
      description: notPreviouslyVotedMessage,
      status: notPreviouslyVoted ? "success" : "error",
      duration: notPreviouslyVoted ? 1000 : 4000,
      isClosable: true,
    });
    if (!notPreviouslyVoted) {
      resetStepForm();
      return;
    }

    // If both checks pass, proceed to next step
    setVoterIDData(values);
    setElectorateName(voterElectorateName);
    nextStep();
  };

  const handleCastVotesSubmit = (values: VoterIDValues) => {
    resetStepForm();
  };

  const steps = [
    {
      label: "Voter Identification",
      content: <VoterIDForm submitCallback={handleVoterIDSubmit} />,
    },
    {
      label: "Cast Votes",
      content: <VoteCastingForm submitCallback={handleCastVotesSubmit} electorateName={electorateName}/>,
    },
  ];

  return (
    <Flex flexDir="column" width="100%">
      <Box
        width={"15%"}
        mx={"auto"}
        textAlign={"center"}
        mb={2}
        bg={settingsBubbleColor}
        fontWeight={"semibold"}
        py={1.5}
        rounded={"md"}
        shadow={"md"}
      >
        Election Code: {props.electionCode}
      </Box>
      <Steps activeStep={activeStep} labelOrientation="vertical">
        {steps.map(({ label, content }) => (
          <Step label={label} key={label}>
            <Box my={5} />
            {content}
          </Step>
        ))}
      </Steps>
      <Flex width="100%" justify="center" my={10}>
        <Button
          isDisabled={activeStep === 0}
          mr={4}
          size="md"
          onClick={resetStepForm}
        >
          Reset
        </Button>
      </Flex>
    </Flex>
  );
};

export default StepForm;
