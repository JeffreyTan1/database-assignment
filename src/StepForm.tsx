import { Button, Flex, Text, Box } from "@chakra-ui/react";
import { Step, Steps, useSteps } from "chakra-ui-steps";

const content = (
  <Box>
    {/* <LoremI p={1} /> */}
    <Text>Content</Text>
  </Box>
);

const steps = [
  { label: "Name", content },
  { label: "Residential Address", content },
  { label: "Voting", content },
];

const StepForm = () => {
  const { nextStep, prevStep, setStep, reset, activeStep } = useSteps({
    initialStep: 0,
  });

  return (
    <Flex flexDir="column" width="100%">
      <Steps activeStep={activeStep}>
        {steps.map(({ label, content }) => (
          <Step label={label} key={label}>
            {content}
          </Step>
        ))}
      </Steps>
      {activeStep === steps.length ? (
        <Flex p={4}>
          <Button mx="auto" size="sm" onClick={reset}>
            Reset
          </Button>
        </Flex>
      ) : (
        <Flex width="100%" justify="flex-end">
          <Button
            isDisabled={activeStep === 0}
            mr={4}
            onClick={prevStep}
            size="sm"
            variant="ghost"
          >
            Prev
          </Button>
          <Button size="sm" onClick={nextStep}>
            {activeStep === steps.length - 1 ? "Finish" : "Next"}
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default StepForm;