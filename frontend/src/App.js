import "./App.css";
import Homepage from "./Pages/HomePage";
import { Route } from "react-router-dom";
import Chatpage from "./Pages/ChatPage";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";

function App() {
  return (
    <div className="App">
      <Route path="/" component={Homepage} exact />
      <Route path="/chats" component={Chatpage} />
      <Route path="/forgotpassword" component={ForgotPassword} />
      <Route path="/resetpassword/:token" component={ResetPassword} />
    </div>
  );
}

export default App;