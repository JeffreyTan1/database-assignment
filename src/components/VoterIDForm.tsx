import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useColorMode,
  Checkbox,
  Select,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";

interface Props {
  submitCallback: (values: any) => void;
}

const TextForm = (props: Props) => {
  const { colorMode } = useColorMode();
  const outerBgColor = colorMode === "light" ? "gray.100" : "gray.700";
  const innerBgColor = colorMode === "light" ? "white" : "gray.800";

  const [ widget, setWidget ] = useState(null);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      gender: "",
      dateOfBirth: "",
      residentialAddress: "",
      alreadyVoted: false,
    },
    onSubmit: (values) => {
      props.submitCallback(values);
    },
  });

  const loadWidget = () => {
    // @ts-ignore
    const newWidget = new AddressFinder.Widget(
      document.getElementById("residentialAddress"),
      "ADDRESSFINDER_DEMO_KEY",
      "AU"
    );

    newWidget.on("result:select", function (fullAddress, metaData) {
      formik.setFieldValue("residentialAddress", fullAddress);
    });

    setWidget(newWidget);
  };

  useEffect(() => {
    var script = document.createElement("script");
    script.src = "https://api.addressfinder.io/assets/v3/widget.js";
    script.async = true;
    script.onload = loadWidget;
    document.body.appendChild(script);

    return () => {
      if (widget) {
        widget.destroy();
      }
    };
  }, []);

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
            <FormControl id="firstName" isRequired>
              <FormLabel>First Name</FormLabel>
              <Input
                type="text"
                placeholder="First Name"
                value={formik.values.firstName}
                onChange={formik.handleChange}
              />
            </FormControl>
            <FormControl id="lastName" isRequired>
              <FormLabel>Last Name</FormLabel>
              <Input
                type="text"
                placeholder="Last Name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
              />
            </FormControl>
            <FormControl id="gender" isRequired>
              <FormLabel>Gender</FormLabel>
              <Select
                placeholder="Select option"
                value={formik.values.gender}
                onChange={formik.handleChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Select>
            </FormControl>
            <FormControl id="dateOfBirth" isRequired>
              <FormLabel>Date of Birth</FormLabel>
              <Input
                type="date"
                placeholder="Date of Birth"
                value={formik.values.dateOfBirth}
                onChange={formik.handleChange}
              />
            </FormControl>
            <FormControl id="residentialAddress" isRequired>
              <FormLabel>Residential Address</FormLabel>
              <Input
                type="text"
                placeholder="Search for your address..."
                value={formik.values.residentialAddress}
                onChange={formik.handleChange}
              />
            </FormControl>
            <FormControl id="alreadyVoted">
              <FormLabel htmlFor="alreadyVoted">
                Have you voted before in THIS election? (Tick if already voted)
              </FormLabel>
              <Checkbox
                name="alreadyVoted"
                variant="filled"
                onChange={formik.handleChange}
                checked={formik.values.alreadyVoted}
              />
            </FormControl>
            <Button type="submit" colorScheme="teal" width="full">
              Next
            </Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
};

export default TextForm;
