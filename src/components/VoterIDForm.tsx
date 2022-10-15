import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useColorMode,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import './../styles/addressfinder.css' 

interface Props {
  submitCallback: (values: any) => void;
}

const VoterIDForm = (props: Props) => {
  const { colorMode } = useColorMode();
  const outerBgColor = colorMode === "light" ? "gray.100" : "gray.700";
  const innerBgColor = colorMode === "light" ? "white" : "gray.800";

  const [ widget, setWidget ] = useState(null);

  const formik = useFormik({
    initialValues: {
      voter_f_name: "",
      voter_l_name: "",
      voter_dob: "",
      voter_r_address: "",
    },
    onSubmit: (values) => {
      const transformedValues = {
        ...values,
        voter_dob: new Date(values.voter_dob).toLocaleDateString('en-GB'),
      };
      props.submitCallback(transformedValues);
    },
  });

  const loadWidget = () => {
    // @ts-ignore
    const newWidget = new AddressFinder.Widget(
      document.getElementById("voter_r_address"),
      "ADDRESSFINDER_DEMO_KEY",
      "AU"
    );

    newWidget.on("result:select", function (fullAddress, metaData) {
      formik.setFieldValue("voter_r_address", fullAddress);
    });

    setWidget(newWidget);
  };

  useEffect(() => {
    // check if dom has a script with id addressfinder-script
    const scriptInDOM = document.getElementById("addressfinder-script");
    if (!scriptInDOM) {
      const script = document.createElement("script");
      script.id = "addressfinder-script";
      script.src = "https://api.addressfinder.io/assets/v3/widget.js";
      script.async = true;
      script.onload = loadWidget;
      document.body.appendChild(script);
    } 
    
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
            <FormControl id="voter_f_name" isRequired>
              <FormLabel>First Name</FormLabel>
              <Input
                type="text"
                placeholder="First Name"
                value={formik.values.voter_f_name}
                onChange={formik.handleChange}
              />
            </FormControl>
            <FormControl id="voter_l_name" isRequired>
              <FormLabel>Last Name</FormLabel>
              <Input
                type="text"
                placeholder="Last Name"
                value={formik.values.voter_l_name}
                onChange={formik.handleChange}
              />
            </FormControl>
            <FormControl id="voter_dob" isRequired>
              <FormLabel>Date of Birth</FormLabel>
              <Input
                type="date"
                placeholder="Date of Birth"
                value={formik.values.voter_dob}
                onChange={formik.handleChange}
              />
            </FormControl>
            <FormControl id="voter_r_address" isRequired>
              <FormLabel>Residential Address</FormLabel>
              <div >
                <Input
                  type="text"
                  placeholder="Search for your address..."
                  value={formik.values.voter_r_address}
                  onChange={formik.handleChange}
                />
              </div>
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

export default VoterIDForm;
