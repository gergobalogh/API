import React from "react";
import {Flex, Input, Button, Icon} from "@chakra-ui/react";
import { FaPaperPlane } from "react-icons/fa6";

const Footer = ({ inputMessage, setInputMessage, handleSendMessage }) => {
    return (
        <Flex w="100%" mt="1">
            <Input
                placeholder="Type Something..."
                border="none"
                borderRadius="md"
                onKeyPress={(e) => {
                    if (e.key === "Enter") {
                        handleSendMessage();
                    }
                }}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
            />
            <Button
                bg="#4AAF51"
                color="white"
                borderRadius="md"
                _hover={{
                    bg: "#28b131",
                    color: "black",
                }}
                disabled={inputMessage.trim().length <= 0}
                onClick={handleSendMessage}
            >
                <Icon as={FaPaperPlane}/>
            </Button>
        </Flex>
    );
};

export default Footer;