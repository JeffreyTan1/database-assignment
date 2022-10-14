import { Box, Button, Flex, useToast } from "@chakra-ui/react";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import { useState } from "react";
import VoterIDForm from "./VoterIDForm";
import VotingForm from "./VotingCastingForm";

type Props = {
  setRenderCount: any;
};

interface VoterIDValues {
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  residentialAddress: string;
  alreadyVoted: boolean;
}

interface CastVotesValues {
}

const StepForm = (props: Props) => {
  const toast = useToast();
  const { nextStep, activeStep } = useSteps({
    initialStep: 0,
  });

  const resetStepForm = () => {
    props.setRenderCount((prev: number) => prev + 1);
  };

  const [voterIDData, setVoterIDData] = useState <VoterIDValues|null>(null);

  const handleVoterIDSubmit = (values: VoterIDValues) => {
    if (!values) return;

    // Check empty fields
    for (const [key, value] of Object.entries(values)) {
      if (value === "") {
        toast({
          title: "Error",
          description: "Please fill out all fields",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      };
    };

    // Check if already voted
    if (values.alreadyVoted) {
      toast({
        title: "Error",
        description: "You have already voted. Voter fraud is a crime.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      resetStepForm();
      return;
    };

    // Check if voter is registered
    setVoterIDData(values);
    nextStep();
  };

  const handleCastVotesSubmit = (values: VoterIDValues) => {
    alert(JSON.stringify({ voterIDData, ...values }, null, 2));
    resetStepForm();
  };

  const steps = [
    {
      label: "Voter Identification",
      content: <VoterIDForm submitCallback={handleVoterIDSubmit} />,
    },
    {
      label: "Cast Votes",
      content: <VotingForm submitCallback={handleCastVotesSubmit} />,
    },
  ];

  return (
    <Flex flexDir="column" width="100%">
      <Steps activeStep={activeStep} labelOrientation="vertical">
        {steps.map(({ label, content }) => (
          <Step label={label} key={label}>
            <Box my={5} />
            {content}
          </Step>
        ))}
      </Steps>
      <Flex width="100%" justify="center" my={10}>
        <Button isDisabled={activeStep === 0} mr={4} size="md" onClick={resetStepForm}>
          Reset
        </Button>
      </Flex>
    </Flex>
  );
};

export default StepForm;