import {
  Box,
  Button,
  Flex,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import { useState } from "react";
import { castVotes, doesVoterExist, hasNotPreviouslyVoted } from "../helpers/queries";
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

type CastVotesValues = {candidate_name: string; party_code: string; preference: string}[];

const StepForm = (props: Props) => {
  const { colorMode } = useColorMode();
  const settingsBubbleColor = colorMode === "light" ? "#3ad6c450" : "#00a89150";
  const toast = useToast();
  const { nextStep, activeStep } = useSteps({
    initialStep: 0,
  });
  const [voterIDData, setVoterIDData] = useState<VoterIDValues | null>(null);
  const [electorateName, setElectorateName] = useState<string | null>(null);

  const resetStepForm = () => {
    props.setRenderCount((prev: number) => prev + 1);
    setVoterIDData(null);
    setElectorateName(null);
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

  const handleCastVotesSubmit = async (values: CastVotesValues) => {
    if (!values) return;
    const { success: votesCast, message: votesCastMessage } =
      await castVotes({
        ...values,
        election_code: props.electionCode,
        electorate_name: electorateName,
        ...voterIDData,
      });
    toast({
      title: votesCast ? "Votes cast" : "Votes not cast",
      description: votesCastMessage,
      status: votesCast ? "success" : "error",
      duration: votesCast ? 1000 : 4000,
      isClosable: true,
    });

    resetStepForm();
  };

  const steps = [
    {
      label: "Voter Identification",
      content: <VoterIDForm submitCallback={handleVoterIDSubmit} />,
    },
    {
      label: "Cast Votes",
      content: <VoteCastingForm submitCallback={handleCastVotesSubmit} electionCode={props.electionCode} electorateName={electorateName}/>,
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
        fontSize={"sm"}
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
