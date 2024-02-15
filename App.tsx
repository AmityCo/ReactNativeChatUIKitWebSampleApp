import React, { useEffect, useState } from 'react';
import { Amplify } from "aws-amplify";
import amplifyconfig from "./src/amplifyconfiguration.json";
Amplify.configure(amplifyconfig);

import {
  AmityUiKitProvider,
  AmityUiKitChat,
} from "@amityco/react-native-chat-ui-kit";

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
    <AmityUiKitProvider
      apiKey="b3babb0b3a89f4341d31dc1a01091edcd70f8de7b23d697f"
      apiRegion="sg"
      userId="John"
      displayName="John"
      apiEndpoint="https://api.sg.amity.co"
      darkMode={darkMode}
      theme={myTheme}
    >
      <AmityUiKitChat />
    </AmityUiKitProvider>
  );
}
