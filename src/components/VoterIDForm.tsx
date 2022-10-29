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
      autocomplete_address: "",
      address_line_1: "",
      address_line_2: "",
      suburb: "",
      state: "",
      postcode: "",
    },
    onSubmit: (values) => {
      const address_line_1 = values.address_line_1;
      const address_line_2 = values.address_line_2;
      const address_combined = address_line_2 ? `${address_line_1}, ${address_line_2}` : address_line_1;
      const residential_address = [address_combined + ",", values.suburb, values.state, values.postcode].filter(Boolean).join(' ');

      const transformedValues = {
        voter_f_name: values.voter_f_name,
        voter_l_name: values.voter_l_name,
        voter_r_address: residential_address,
        voter_dob: new Date(values.voter_dob).toLocaleDateString("en-GB"),
      };
      props.submitCallback(transformedValues);
    },
  });

  const loadWidget = () => {
    // @ts-ignore
    const newWidget = new AddressFinder.Widget(
      document.getElementById("autocomplete_address"),
      "ADDRESSFINDER_DEMO_KEY",
      "AU"
    );

    newWidget.on("result:select", function (fullAddress, metaData) {
      formik.setFieldValue("autocomplete_address", fullAddress ? fullAddress : "");
      formik.setFieldValue("address_line_1", metaData.address_line_1 ? metaData.address_line_1 : "");
      formik.setFieldValue("address_line_2", metaData.address_line_2 ? metaData.address_line_2 : "");
      formik.setFieldValue("suburb", metaData.locality_name ? metaData.locality_name : "");
      formik.setFieldValue("state", metaData.state_territory ? metaData.state_territory : "");
      formik.setFieldValue("postcode", metaData.postcode ? metaData.postcode : "");
    });

    setWidget(newWidget);
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.id = "addressfinder-script";
    script.src = "https://api.addressfinder.io/assets/v3/widget.js";
    script.async = true;
    script.onload = loadWidget;
    document.body.appendChild(script);
    
    return () => {
      if (widget) {
        widget.destroy();
      }
      const scriptInDOM = document.getElementById("addressfinder-script");
      if (scriptInDOM) {
        try {
          scriptInDOM.remove();
        } catch (error) { 
          console.error(error);
        }
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
                max="9999-12-31"
                placeholder="Date of Birth"
                value={formik.values.voter_dob}
                onChange={formik.handleChange}
              />
            </FormControl>
            <FormControl id="autocomplete_address">
              <FormLabel>Address Autocomplete</FormLabel>
              <Input
                type="text"
                placeholder="Search for your address..."
                value={formik.values.autocomplete_address}
                onChange={formik.handleChange}
              />
            </FormControl>
            <FormControl id="address_line_1" isRequired>
              <FormLabel>Address Line 1</FormLabel>
              <Input
                type="text"
                placeholder="Address Line 1"
                value={formik.values.address_line_1}
                onChange={formik.handleChange}
              />
            </FormControl>
            <FormControl id="address_line_2">
              <FormLabel>Address Line 2</FormLabel>
              <Input
                type="text"
                placeholder="Address Line 2"
                value={formik.values.address_line_2}
                onChange={formik.handleChange}
              />
            </FormControl>
            <FormControl id="suburb" isRequired>
              <FormLabel>Suburb</FormLabel>
              <Input
                type="text"
                placeholder="Suburb"
                value={formik.values.suburb}
                onChange={formik.handleChange}
              />
            </FormControl>
            <FormControl id="state" isRequired>
              <FormLabel>State</FormLabel>
              <Input
                type="text"
                placeholder="State"
                value={formik.values.state}
                onChange={formik.handleChange}
              />
            </FormControl>
            <FormControl id="postcode" isRequired>
              <FormLabel>Postcode</FormLabel>
              <Input
                type="text"
                placeholder="Postcode"
                value={formik.values.postcode}
                onChange={formik.handleChange}
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

export default VoterIDForm;
