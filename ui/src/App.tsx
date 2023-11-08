import {Button, ChakraProvider, theme, useColorModeValue} from "@chakra-ui/react";
import {ChatIcon} from '@chakra-ui/icons'
import Chat from "./pages/Chat";
import {useState} from "react";

const App = () => {
    const [openChat, setOpenChat] = useState(false);

    const startChat =  () => {
        setOpenChat(true)

        try {

        } catch (error) {
            console.log(error)
        }
    }
    const stopChat = () => {
        setOpenChat(false)
    }
    return (
        <ChakraProvider theme={theme}>

            {openChat ? <Chat stopChat={stopChat}/> : <Button
                onClick={startChat}
                position="fixed"
                bottom="100px"
                right={["20px", "20px", "160px"]}
                zIndex={3}
                bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
                leftIcon={<ChatIcon/>}
            >
                Help
            </Button>}
        </ChakraProvider>
    );
};

export default App;