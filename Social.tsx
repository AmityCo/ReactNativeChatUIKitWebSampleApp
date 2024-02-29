import React, { useEffect, useState } from 'react';
// import { Amplify } from "aws-amplify";
// import amplifyconfig from "./src/amplifyconfiguration.json";
// Amplify.configure(amplifyconfig);

import {
  AmityUiKitProvider,
  AmityUiKitSocial,
} from "@amityco/react-native-social-ui-kit";
import { Text } from 'react-native'
export default function Social() {
  const [darkMode, setDarkMode] = useState<boolean>(false)
  const [primaryColor, setPrimaryColor] = useState<string>()
  const [apiKey, setApiKey] = useState<string>('')
  const [userId, setUserId] = useState<string>('')
  const [apiRegion, setApiRegion] = useState<string>('sg')
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const darkMode = urlParams.get('darkMode');
    const primary = urlParams.get('primary');
    const apiKey = urlParams.get('apiKey');
    const userId = urlParams.get('userId');
    console.log('primary: ', primary);
    if (darkMode === 'true') {
      setDarkMode(true)
    }
    if(primary)  setPrimaryColor(`#${primary}`)
    if(apiKey) setApiKey(apiKey)
    if(userId) setUserId(userId)
  }, [])
  const myTheme = {
    primary: primaryColor, // Primary color for main elements
  };
  return (
    <AmityUiKitProvider
      apiKey={apiKey}
      apiRegion={apiRegion}
      userId={userId}
      displayName={userId}
      apiEndpoint={`https://api.${apiRegion}.amity.co`}
      theme={myTheme}
      darkMode={darkMode}
    >
      <AmityUiKitSocial />

    </AmityUiKitProvider>
  );
}
