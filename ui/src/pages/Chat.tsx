import {
    Alert,
    AlertDescription,
    AlertTitle,
    Box,
    Button,
    ButtonGroup,
    Flex,
    Icon,
    Text
} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Messages from "../components/Messages";
import {Divider} from '@chakra-ui/react'
import {FaThumbsUp} from "react-icons/fa6";
import {FaThumbsDown} from "react-icons/fa6";
import { useToast } from '@chakra-ui/react'

function AlertIcon() {
    return null;
}

const Chat = ({stopChat}) => {
    const toast = useToast()
    const [messages, setMessages] = useState([]);
    const [userId, setUser] = useState(null);
    const [chatId, setChatId] = useState(null);
    const [inputMessage, setInputMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [askForSuccess, setAskForSuccess] = useState(false);

    useEffect(() => {
        const startChat = async () => {

            try {

                const createResponse = await fetch('http://localhost:8000/user/create')
                const {userId} = await createResponse.json()
                const response = await fetch('http://localhost:8000/chat/start', {
                    method: 'POST',
                    cors: 'cors',
                    body: JSON.stringify({userId: userId})
                });
                const {chatId} = await response.json()
                setUser(userId)
                setChatId(chatId);
                setMessages(
                    [
                        {from: "computer", text: "Hi! How can I help?"}
                    ]
                )
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        startChat();
    }, []);
    const handleSendMessage = async () => {
        if (!inputMessage.trim().length) {
            return;
        }
        const message = inputMessage;
        setMessages((old) => [...old, {from: "me", text: message}]);
        setInputMessage("");
        setLoading(true)
        let result;
        try {
            const response = await fetch('http://localhost:8000/chat/chat', {
                method: 'POST',
                cors: 'cors',
                body: JSON.stringify({
                    chatId: chatId,
                    userId: userId,
                    message: inputMessage
                })

            })
            result = await response.json();
            if (result.ai_message) {
                setMessages((old) => [...old, {from: "computer", text: result.ai_message}]);
                setLoading(false)
            }
            if (result.askForSuccess) {
                setAskForSuccess(true)
            }
        } catch (error) {
            setError(true)
            setLoading(false)
            setErrorMessage('There was an error processing your request. ' + error)
        }


    };
    const setSuccess = async (success: boolean) => {
        try {
            const response = await fetch('http://localhost:8000/chat/success', {
                method: 'POST',
                cors: 'cors',
                body: JSON.stringify({chatId: chatId, success: success})
            });
            toast({
                title: 'Thank you for providing feedback.',
                description: success ? 'Glad we could help!' : 'We will look into what went wrong',
                status: success ? 'success' : 'info'
            })
            setAskForSuccess(false)
        } catch (error) {
            console.error('Error fetching data:', error);
        }

    }
    return (
        <Box
            position="fixed"
            bottom="100px"
            right={["20px", "20px", "160px"]}
            zIndex={3}
            height={500}
            width={350}
            boxShadow="lg"
            borderRadius="lg"
            bg="#F2F7E9"
            p={4}
        >
            <Header stopChat={stopChat}/>
            <Divider/>
            {error ? <Alert status='error'>
                    <AlertIcon/>
                    <AlertTitle>Oh no!</AlertTitle>
                    <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>

                : ''}
            <Messages messages={messages} loading={loading}/>
            {askForSuccess ?
                <Flex flexDirection="row" >
                    <Text>Did you get the info you were looking for?</Text>
                    <ButtonGroup spacing='1'>
                        <Button color="#4AAF51"
                               onClick={()=> setSuccess(false)}
                        >
                            <Icon as={FaThumbsDown}/>
                        </Button>
                        <Button color="#4AAF51"
                               onClick={()=>setSuccess(true)}
                        >
                            <Icon as={FaThumbsUp}/>
                        </Button>
                    </ButtonGroup>
                </Flex>

                : ''}

            <Footer
                inputMessage={inputMessage}
                setInputMessage={setInputMessage}
                handleSendMessage={handleSendMessage}
            />
        </Box>
    );
};

export default Chat;