import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [userResPass, setUserResPass] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();

  const history = useHistory();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userInfoResetPass = JSON.parse(localStorage.getItem("userInfoResetPass"));
    setUser(userInfo);
    setUserResPass(userInfoResetPass);
    if (!userInfo && !userInfoResetPass){
      history.push("/");
    }else{}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);


  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        userResPass, 
        setUserResPass,
        notification,
        setNotification,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
