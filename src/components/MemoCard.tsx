import { chakra, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import moment from "moment";

interface TestimonialCardProps {
  name: string;
  message: string;
  timestamp: string;
  from: string;
}

export default function MemoCard(props: TestimonialCardProps) {
  const { name, message, timestamp, from } = props;
  const color = useColorModeValue("gray.800", "white");

  return (
    <Flex
      my={2}
      boxShadow={"lg"}
      maxW={"640px"}
      direction={{ base: "column-reverse", md: "row" }}
      width={"full"}
      rounded={"xl"}
      p={10}
      justifyContent={"space-between"}
      position={"relative"}
      border="1px"
      borderColor="gray.200"
    >
      <Flex
        direction={"column"}
        textAlign={"left"}
        justifyContent={"space-between"}
      >
        <Text color={color}>
          from: <chakra.span fontWeight={"bold"}>{from}</chakra.span>
        </Text>

        <chakra.p
          bgGradient="linear(to-l, heroGradientStart, heroGradientEnd)"
          bgClip="text"
          mt="2"
          fontWeight={"medium"}
          fontSize={"15px"}
          pb={4}
        >
          {message}
        </chakra.p>

        <chakra.p color={color} fontWeight={"bold"} fontSize={14}>
          {name} - {moment(timestamp).fromNow()}
        </chakra.p>
      </Flex>
    </Flex>
  );
}
