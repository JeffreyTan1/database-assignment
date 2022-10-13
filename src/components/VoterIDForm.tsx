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
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useEffect, useState, useRef } from "react";

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
      fullName: "",
      address: "",
      suburb: "",
      state: "",
      postcode: "",
      alreadyVoted: false,
    },
    onSubmit: (values) => {
      props.submitCallback(values);
    },
  });


   const loadWidget = () => {
     // @ts-ignore
     const newWidget = new AddressFinder.Widget(
       document.getElementById("address"),
       "ADDRESSFINDER_DEMO_KEY",
       "AU"
     );

     newWidget.on("result:select", function (fullAddress, metaData) {
       formik.setFieldValue("address", fullAddress);
       formik.setFieldValue("suburb", metaData.locality_name);
       formik.setFieldValue("state", metaData.state_territory);
       formik.setFieldValue("postcode", metaData.postcode);
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
            <FormControl>
              <FormLabel htmlFor="firstName">Full Name</FormLabel>
              <Input
                id="fullName"
                name="fullName"
                type="fullName"
                variant="filled"
                onChange={formik.handleChange}
                value={formik.values.fullName}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Address</FormLabel>
              <Input
                type={"search"}
                id="address"
                name="address"
                placeholder="Enter your address here..."
                variant="filled"
                onChange={formik.handleChange}
                value={formik.values.address}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Suburb</FormLabel>
              <Input
                id="suburb"
                name="suburb"
                variant="filled"
                onChange={formik.handleChange}
                value={formik.values.suburb}
              />
            </FormControl>
            <FormControl>
              <FormLabel>State</FormLabel>
              <Input
                id="state"
                name="state"
                variant="filled"
                onChange={formik.handleChange}
                value={formik.values.state}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Postcode</FormLabel>
              <Input
                id="postcode"
                name="postcode"
                variant="filled"
                onChange={formik.handleChange}
                value={formik.values.postcode}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="alreadyVoted">
                Have you voted before in THIS election? (Tick if already voted)
              </FormLabel>
              <Checkbox
                id="alreadyVoted"
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
