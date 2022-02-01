import React from 'react';
import {
  Box,
  Container,
  Text,
} from "@chakra-ui/react";
import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useState } from "react";
import { useToast} from "@chakra-ui/react";
import { useHistory} from "react-router-dom";
import axios from "axios";
function CheckEmail() {
  const [email, setEmail] = useState();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
 const history = useHistory();

   const submitHandler = async () => {
    if (!email ) {
      toast({
        title: "Il campo email è vuoto",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
      try {
      const data= await axios.post('/api/user/forgotpassword', {email})

      toast({
        title: "Controlla la tua email",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfoResetPass", JSON.stringify(data));
      history.push("/");
      setLoading(false);
      
      
      
     
    
     
    } catch (error) {
      toast({
        title: "Errore!",
        description: "Credenziali non corrette",
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
        <Text fontSize="4xl" fontFamily="Work sans">
          Password dimenticata
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
           
      <VStack spacing="10px">
      <FormControl id="email" isRequired>
        <FormLabel>Email </FormLabel>
        <Input
          value={email}
          type="email"
          placeholder="Inserisci l'email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        onClick={submitHandler}
        style={{ marginTop: 15 }}
        isLoading={loading}
        
  
      >
        Avanti
      </Button>
      </VStack>
            
          
      </Box>
      </Container>)
}

export default CheckEmail;
