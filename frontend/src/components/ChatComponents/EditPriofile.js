
import {
  Modal,
  ModalOverlay,
  ModalContent,
  useDisclosure,
  IconButton,
  ModalHeader,
  ModalBody,
  ModalCloseButton
 
} from "@chakra-ui/react";
import { Button, } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router";
import { useToast } from "@chakra-ui/toast";
import { ViewIcon,ViewOffIcon } from '@chakra-ui/icons'


const EditProfile = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState("");
  const [email] = useState("");
  const [pic, setPic] = useState();
  const [password, setPassword] = useState("");
 const [picLoading, setPicLoading] = useState(false);
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const history = useHistory();

const submitHandler = async () => {
    setPicLoading(true);
const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!name||!password) {
      toast({
        title: "Tutti i campi devono essere compilati!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
      
    }
     if (!regex.test(password)) {
      toast({
        title: "Minimo otto caratteri, almeno una lettera maiuscola, una minuscola e un numero!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
      
    }
    
    
    console.log(name, email, password, pic);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
      };
      const { data } = await axios.post(
        "/api/user/profile",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      console.log(data);
      toast({
        title: "Aggiornamento avvenuto con successo",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
      window.location.reload();
      history.push("/chats");
      
      
    } catch (error) {
      toast({
        title: "Errore!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }
  };


const deleteAccount = async () => {
try {
      const config = {
        headers: {
          "Content-type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
      };
       await axios.delete(
        "/api/user/deleteAccount",
        config
      );
      toast({
        title: "Account eliminato con successo",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.removeItem("userInfo");
      history.push("/");
      
      
    } catch (error) {
      toast({
        title: "Errore!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }



}





 const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast({
        title: "Selezione la tua immagine!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png" || pics.type === "image/jpg" ) {
      const data = new FormData();
      data.append("file", pics);
     data.append("upload_preset", "tolk-alot");
    data.append("cloud_name", "tolk-alot");
    fetch("https://api.cloudinary.com/v1_1/tolk-alot/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast({
        title: "Selezione la tua immagine!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
  };






  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
          
        <ModalOverlay />
         
        <ModalContent h="450px" w="400px">
             <ModalHeader
            fontSize="40px"
            d="flex"
            justifyContent="center"
          >
            Modifica profilo
          </ModalHeader>
          <ModalCloseButton />
            <ModalBody
            d="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <form>
           <FormControl id="first-name" isRequired>
        <FormLabel>Nickname</FormLabel>
        <Input
          name="name"
          placeholder="Inserisci il tuo nuovo Nickname"
          onChange={(e) => setName(e.target.value)}
          
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Inserisci la tua nuova password"
            name="password"
             onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? <ViewOffIcon/> : <ViewIcon/>}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Seleziona la tua nuova immagine</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={picLoading}
      >
        Aggiorna
      </Button>
      <Button
        colorScheme="red"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={deleteAccount}
      >
        Elimina Account
      </Button>
      </form>
      </ModalBody>
      
        </ModalContent>
        
      </Modal>
    </>
  );
};

export default EditProfile;