import { Box, Button, Flex } from "@chakra-ui/react";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import { useFormik } from "formik";
import TextForm from "./TextForm";
import VotingForm from "./VotingForm";

type Props = {
  setRenderCount: any;
};

const StepForm = (props: Props) => {
  const { nextStep, setStep, activeStep } = useSteps({
    initialStep: 0,
  });

  const resetStepForm = () => {
    props.setRenderCount((prev: number) => prev + 1);
  };

  const nameFields = [
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
  ];
  const nameFormik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
      nextStep();
    },
  });

  const residentialAddressFields = [
    { key: "residentialAddress", label: "Residential Address" },
  ];
  const residentialAddressFormik = useFormik({
    initialValues: {
      residentialAddress: "",
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
      nextStep();
    },
  });

  const votingFields = [{ key: "votingAddress", label: "Voting Address" }];
  const votingFormik = useFormik({
    initialValues: {
      votingAddress: "",
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
      nextStep();
    },
  });

  const steps = [
    {
      label: "Name",
      content: (
        <TextForm formik={nameFormik} fields={nameFields} buttonLabel="Next" />
      ),
    },
    {
      label: "Residential Address",
      content: (
        <TextForm
          formik={residentialAddressFormik}
          fields={residentialAddressFields}
          buttonLabel="Next"
        />
      ),
    },
    {
      label: "Voting",
      content: (
        <VotingForm
          formik={votingFormik}
          fields={votingFields}
          buttonLabel="Cast Votes"
        />
      ),
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