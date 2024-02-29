import React, { useEffect, useState } from 'react';
// import { Amplify } from "aws-amplify";
// import amplifyconfig from "./src/amplifyconfiguration.json";
// Amplify.configure(amplifyconfig);
    
import {
  AmityUiKitProvider,
  AmityUiKitChat,
} from "@amityco/react-native-chat-ui-kit";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Chat from './Chat';
import Social from './Social';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(false)
  const [primaryColor, setPrimaryColor] = useState<string>()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const darkMode = urlParams.get('darkMode');
    const primary = urlParams.get('primary');
    console.log('primary: ', primary);
    if (darkMode === 'true') {
      setDarkMode(true)
    }
    if(primary){
      setPrimaryColor(`#${primary}`)
    }
  }, [])
  const myTheme = {
    primary: primaryColor, // Primary color for main elements
  };
  return (
    <Router>

            <Routes>
              <Route path="/" element={<Navigate to="/social" replace />} />
              <Route
                path="/social"
                element={
               <Social/>
                } />
              <Route path="/chat" element={
                <Chat/>
              } />
            </Routes>

        </Router>
  );
}
