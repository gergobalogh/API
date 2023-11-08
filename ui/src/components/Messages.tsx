import React, {useEffect, useRef, useState} from "react";
import {Avatar, Fade, Flex, Icon, ScaleFade, Text} from "@chakra-ui/react";
import newpharma from "../assets/img.png"
import Threedots from "./Threedots";
import {BiCheckDouble} from "react-icons/bi";

const Messages = ({messages, loading}) => {
    const AlwaysScrollToBottom = () => {
        const elementRef = useRef();
        useEffect(() => elementRef.current.scrollIntoView());
        return <div ref={elementRef}/>;
    };
    const [itemIndex, setItemIndex] = useState(0);
    useEffect(() => {
        if (itemIndex === messages.length) {
            const timeout = setTimeout(() => {
                setItemIndex(itemIndex + 1);
            }, 100);
            return () => {
                clearTimeout(timeout);
            };
        }
    }, [itemIndex, messages]);
    return (
        <Flex w="100%" h="80%" overflowY="scroll" flexDirection="column" p="3"
              css={{
                  '&::-webkit-scrollbar': {
                      width: '4px',
                  },
                  '&::-webkit-scrollbar-track': {
                      width: '6px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                      background: "grey",
                      borderRadius: '24px',
                  },
              }}
        >
            {messages.map((item, index) => {
                const isLastItem = index === messages.length - 1;
                if (item.from === "me") {
                    return (
                        <Flex key={index} w="100%" justify="flex-end">
                            <Flex
                                bg="#4AAF51"
                                borderRadius="md"
                                color="white"
                                minW="100px"
                                maxW="350px"
                                my="1"
                                p="2"
                            >
                                <Text>{item.text}</Text>
                            </Flex>
                            <Flex
                                pos="relative"
                            >
                                    <Icon as={BiCheckDouble}
                                          color="#E2EEF7"
                                          pos='absolute'
                                          bottom="2px"
                                          right="2px"
                                    />
                            </Flex>
                        </Flex>
                    );
                }
            else
                {
                    return (
                        <Flex w="100%" key={index}>
                            {isLastItem?
                                <ScaleFade direction='left' in={!loading}
                                >
                                    <Avatar
                                        name="Computer"
                                        src={newpharma}
                                        size="sm"
                                    />
                                    <Flex
                                        bg="#F0F9ED"
                                        color="#282C60"
                                        minW="100px"
                                        maxW="350px"
                                        my="1"
                                        p="2"
                                    >
                                        <Text>{item.text}</Text>
                                    </Flex>
                                </ScaleFade> :
                                <>
                                    <Avatar
                                        name="Computer"
                                        src={newpharma}
                                        size="sm"
                                    />
                                    <Flex
                                        bg="#F0F9ED"
                                        color="#282C60"
                                        minW="100px"
                                        maxW="350px"
                                        my="1"
                                        p="2"
                                    >
                                        <Text>{item.text}</Text>
                                    </Flex>
                                </>
                            }
                        </Flex>
                    );
                }
            })}
            {loading ?  <Threedots/> : ''}
                <AlwaysScrollToBottom />
                </Flex>
                );
            };

export default Messages;