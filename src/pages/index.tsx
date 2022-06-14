import { useState, useEffect } from "react";
import {
  Text,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Flex,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";

import { Hero } from "../components/Hero";
import { Container } from "../components/Container";
import { Main } from "../components/Main";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { Footer } from "../components/Footer";
import abi from "../utils/BuyMeCoffee.json";
import { ethers } from "ethers";
import MemoCard from "../components/MemoCard";

declare const window: any;

const contractAddress = "0x262272a81d27A14c3946fCa6714133112ae4b8E0";
const contractABI = abi.abi;
const ETH_TIP = "0.0001";
const DEFAULT_MESSAGE = "Enjoy your coffee ;)";

const Index = () => {
  const [currentAccount, setCurrentAccount] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [memos, setMemos] = useState([]);
  const [loading, setLoading] = useState(false);

  const onNameChange = (e) => setName(e.target.value);
  const onMessageChange = (e) => setMessage(e.target.value);

  //check wallet connect
  const isWalletConnected = async () => {
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({ method: "eth_accounts" });
      console.log("accounts: ", accounts);

      if (accounts.length > 0) {
        const account = accounts[0];
        console.log("wallet is connected! " + account);
      } else {
        console.log("make sure MetaMask is connected");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("please install MetaMask");
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const buyCoffee = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        setLoading(true);
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log("buying coffee..");
        const coffeeTxn = await buyMeACoffee.buyCoffee(
          name ? name : "anonymouse",
          message ? message : DEFAULT_MESSAGE,
          { value: ethers.utils.parseEther(ETH_TIP) }
        );

        await coffeeTxn.wait();

        console.log("mined ", coffeeTxn.hash);

        console.log("coffee purchased!");

        // Clear the form fields.
        setName("");
        setMessage("");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Function to fetch all memos stored on-chain.
  const getMemos = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log("fetching memos from the blockchain..");
        const memos = await buyMeACoffee.getMemos();
        console.log("fetched!");
        setMemos(memos);
      } else {
        console.log("Metamask is not connected");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let buyMeACoffee;
    isWalletConnected();
    getMemos();

    // Create an event handler function for when someone sends
    // us a new memo.
    const onNewMemo = (from, timestamp, name, message) => {
      console.log("Memo received: ", from, timestamp, name, message);
      setMemos((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message,
          name,
        },
      ]);
    };

    const { ethereum } = window;

    // Listen for new memo events.
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();
      buyMeACoffee = new ethers.Contract(contractAddress, contractABI, signer);

      buyMeACoffee.on("NewMemo", onNewMemo);
    }

    return () => {
      if (buyMeACoffee) {
        buyMeACoffee.off("NewMemo", onNewMemo);
      }
    };
  }, []);

  const color = useColorModeValue("gray.800", "white");

  return (
    <Container>
      <Flex direction="column" justifyContent="center" alignItems="center">
        <Hero />
        {currentAccount ? (
          <Main mt={5}>
            <FormControl id="name">
              <FormLabel>
                <Text color="text">Name:</Text>
              </FormLabel>
              <Input
                color={color}
                type="text"
                placeholder="anynoumse"
                onChange={onNameChange}
              />
            </FormControl>
            <FormControl id="name">
              <FormLabel>
                <Text color="text">Message:</Text>
              </FormLabel>
              <Textarea
                color={color}
                placeholder={DEFAULT_MESSAGE}
                onChange={onMessageChange}
              ></Textarea>
            </FormControl>

            <Button
              variant="outline"
              colorScheme="green"
              rounded="button"
              flexGrow={1}
              mx={2}
              width="full"
              onClick={buyCoffee}
              isLoading={loading}
              loadingText="buying coffee ☕.."
            >
              {`Send 1 Coffee for ${ETH_TIP}ETH`}
            </Button>
          </Main>
        ) : (
          <Main>
            <Button
              colorScheme="green"
              rounded="button"
              flexGrow={1}
              size="lg"
              mx={2}
              onClick={connectWallet}
            >
              Connect your wallet
            </Button>
          </Main>
        )}

        <Flex
          w="100%"
          maxWidth="40rem"
          mt="8"
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          {currentAccount && (
            <Heading fontSize="2vw">Memos from friends:</Heading>
          )}

          {currentAccount &&
            memos.length &&
            memos.map((memo, index) => <MemoCard key={index} {...memo} />)}
        </Flex>

        <DarkModeSwitch />
        <Footer>
          <Text
            bgGradient="linear(to-l, heroGradientStart, heroGradientEnd)"
            bgClip="text"
          >
            Alchemy, Hardhat, Solidity, Next ❤️ Chakra
          </Text>
        </Footer>
      </Flex>
    </Container>
  );
};

export default Index;
