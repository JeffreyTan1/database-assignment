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
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  residentialAddress: string;
}

interface CastVotesValues {}

const StepForm = (props: Props) => {
  const { colorMode } = useColorMode();
  const settingBubbleColor = colorMode === "light" ? "teal.200" : "teal.500";
  const toast = useToast();
  const { nextStep, activeStep } = useSteps({
    initialStep: 0,
  });

  const resetStepForm = () => {
    props.setRenderCount((prev: number) => prev + 1);
  };

  const handleVoterIDSubmit = async (values: VoterIDValues) => {
    if (!values) return;

    // Check if voter is registered
    const { success: voterExists, message: voterExistsMessage } =
      await doesVoterExist(values);
    toast({
      title: voterExists ? "Voter validated" : "Voter not found",
      description: voterExistsMessage,
      status: voterExists ? "success" : "error",
      duration: 5000,
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
      duration: 5000,
      isClosable: true,
    });
    if (!notPreviouslyVoted) {
      resetStepForm();
      return;
    }

    // If both checks pass, proceed to next step
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
      content: <VoteCastingForm submitCallback={handleCastVotesSubmit} />,
    },
  ];

  return (
    <Flex flexDir="column" width="100%">
      <Box
        width={"20%"}
        mx={"auto"}
        textAlign={"center"}
        fontWeight={"semibold"}
        mb={2}
        bg={settingBubbleColor}
        py={1}
        rounded={"md"}
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
