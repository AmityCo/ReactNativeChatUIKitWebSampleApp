import React, { useEffect, useState } from 'react';
// import { Amplify } from "aws-amplify";
// import amplifyconfig from "./src/amplifyconfiguration.json";
// Amplify.configure(amplifyconfig);

import {
  AmityUiKitProvider,
  AmityUiKitChat,
} from "@amityco/react-native-chat-ui-kit";
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function Chat() {
  const [darkMode, setDarkMode] = useState<boolean>(false)
  const styles = useStyles()

  const [primaryColor, setPrimaryColor] = useState<string>()
  const [apiKey, setApiKey] = useState<string>('')
  const [userId, setUserId] = useState<string>('')
  const [apiRegion, setApiRegion] = useState<string>('sg')
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const darkMode = urlParams.get('darkMode');
    const primary = urlParams.get('primary');
    const apiKey = urlParams.get('apiKey');
    const userId = urlParams.get('userId');
    if (darkMode === 'true') {
      setDarkMode(true)
    }
    if (primary) setPrimaryColor(`#${primary}`)
    if (apiKey) setApiKey(apiKey)
    if (userId) setUserId(userId)
    if (apiRegion) setApiRegion(apiRegion)
    setTimeout(() => {
      setLoading(false)
    }, 1000);
  }, [])

  const myTheme = {
    primary: primaryColor, // Primary color for main elements
  };

  return (
    apiKey &&
    <AmityUiKitProvider
      apiKey={apiKey}
      apiRegion={apiRegion}
      userId={userId}
      displayName={userId}
      apiEndpoint={`https://api.${apiRegion}.amity.co`}
      theme={myTheme}
      darkMode={darkMode}
    >

      {loading ?
        <View style={loading ? styles.loadingContainer : styles.hide}>
          <ActivityIndicator color={primaryColor} size="large" />
        </View> : <AmityUiKitChat />
      }

    </AmityUiKitProvider >

  );
}
const useStyles = () => {
  const styles = StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
    },
    hide: {
      display: 'none'
    },

  });
  return styles
}
