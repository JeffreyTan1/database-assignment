import { Box, Button, Flex } from "@chakra-ui/react";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import { useState } from "react";
import VoterIDForm from "./VoterIDForm";

type Props = {
  setRenderCount: any;
};

const StepForm = (props: Props) => {
  const { nextStep, activeStep } = useSteps({
    initialStep: 0,
  });

  const resetStepForm = () => {
    props.setRenderCount((prev: number) => prev + 1);
  };

  const [voterIDData, setVoterIDData] = useState(null);

  const handleVoterIDSubmit = (values: any) => {
    setVoterIDData(values);
    nextStep();
  };

  const handleCastVotesSubmit = (values: any) => {
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
      content: <VoterIDForm submitCallback={handleCastVotesSubmit} />,
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