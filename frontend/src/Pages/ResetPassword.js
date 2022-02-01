import React from 'react';
import {
  Box,
  Container,
  Text,
} from "@chakra-ui/react";
import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input,InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { ViewIcon,ViewOffIcon } from '@chakra-ui/icons'
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useParams} from "react-router-dom";


const  Resetpassword=()=> {

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const [password, setPassword] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState();
  const history = useHistory();
  const {token} = useParams();



const submitHandler = async () => {
  if (!name ) {
      toast({
        title: "Campo Nickname vuoto",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
  return;
    }
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
     if (!regex.test(password)) {
      toast({
        title: "Minimo otto caratteri, almeno una lettera maiuscola, una minuscola e un numero!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    
    if (password !== confirmpassword) {
      toast({
        title: "Le password non coincidono",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
      try {
     

        await axios.post(
        "/api/user/resetpassword",
         {name,password},
         {
           headers:{Authorization: token}
         }
         );

      toast({
        title: "Password modificata con successo",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.removeItem("userInfoResetPass");
      history.push("/");
      setLoading(false);
      
    
     
    } catch (error) {
      toast({
        title: "Errore!",
        description: error.response.data.msg,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };




  return (
        <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl">
          Reset Password
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
           
      <VStack spacing="10px">
        <FormControl id="first-name" isRequired>
        <FormLabel>Nickname</FormLabel>
        <Input
          placeholder="Conferma il tuo Nickname"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={show ? "text" : "password"}
            placeholder="Inserisci la password"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? <ViewOffIcon/> : <ViewIcon/>}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Conferma Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Conferma la tua password"
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? <ViewOffIcon/> : <ViewIcon/>}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        onClick={submitHandler}
        style={{ marginTop: 15 }}
        isLoading={loading}
        
  
      >
        Cambia Password
      </Button>
      </VStack>
            
          
      </Box>
      </Container>


  )
}

export default Resetpassword;
