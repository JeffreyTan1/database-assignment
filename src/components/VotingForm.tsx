import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";

type Props = {
  formik: any;
  fields: { key: string; label: string }[];
  buttonLabel: string;
};

const VotingForm = (props: Props) => {
  const { formik, fields, buttonLabel } = props;
  return (
    <Flex
      bg="gray.100"
      align="center"
      justify="center"
      height="30rem"
      rounded={"md"}
    >
      <Box bg="white" p={6} rounded="md">
        <form onSubmit={formik.handleSubmit}>
          <VStack spacing={4} align="flex-start">
            {fields.map((field) => (
              <FormControl>
                <FormLabel htmlFor={field.key}>{field.label}</FormLabel>
                <Input
                  id={field.key}
                  name={field.key}
                  type={field.key}
                  variant="filled"
                  onChange={formik.handleChange}
                  value={formik.values[field.key]}
                />
              </FormControl>
            ))}
            <Button type="submit" colorScheme="teal" width="full">
              {buttonLabel}
            </Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
};

export default VotingForm;
