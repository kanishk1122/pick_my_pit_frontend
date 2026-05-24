import React from "react";
import AppRoutes from "./utils/Routes.jsx";
import Footer from "./components/Footer";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ChatProvider } from './context/ChatContext';

const App = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_REACT_APP_CLIENT_KEY}>
      <ChatProvider>
        <div className="min-h-screen flex flex-col bg-[#FDFCF8]">
          <AppRoutes />
        </div>
      </ChatProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
