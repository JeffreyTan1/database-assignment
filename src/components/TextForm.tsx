import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useColorMode
} from "@chakra-ui/react";

type Props = {
  formik: any;
  fields: {key: string, label: string}[];
  buttonLabel: string;
}

const TextForm = (props: Props) => {
  const { formik, fields, buttonLabel } = props;
  const { colorMode } = useColorMode();
  const outerBgColor = colorMode === "light" ? "gray.100" : "gray.700";
  const innerBgColor = colorMode === "light" ? "white" : "gray.800";
  
  return (
    <Flex
      bg={outerBgColor}
      align="center"
      justify="center"
      height="25rem"
      rounded={"md"}
    >
      <Box bg={innerBgColor} minW={"40%"} maxW={"90%"} p={6} rounded="md">
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
}

export default TextForm;