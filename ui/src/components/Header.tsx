import React from "react";
import {Flex, Avatar, AvatarBadge, Text, Icon, Button} from "@chakra-ui/react";
import newpharma from "../assets/img.png"
import {IoClose} from "react-icons/io5";

IoClose
const Header = ({stopChat}) => {
    return (
        <Flex w="100%">
            <Avatar size="sm" name="Newpharma" src={newpharma}
                    objectFit='contain'
            >
                <AvatarBadge boxSize="1em" bg="green.500"/>
            </Avatar>
            <Flex flexDirection="column" mx="5" justify="center" pr="20px">
                <Text fontSize="lg" fontWeight="bold">
                    Newpharma SupportBot
                </Text>

            </Flex>
            <Button onClick={()=>stopChat()}> <Icon fontSize="2xl" as={IoClose}/>
            </Button>
        </Flex>
    );
};

export default Header;