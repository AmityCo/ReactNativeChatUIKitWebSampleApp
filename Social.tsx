import React, { useEffect, useRef, useState } from 'react';
// import { Amplify } from "aws-amplify";
// import amplifyconfig from "./src/amplifyconfiguration.json";
// Amplify.configure(amplifyconfig);
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  AmityUiKitProvider,
  AmityUiKitSocial,
} from "@amityco/react-native-social-ui-kit";
import { ActivityIndicator, Text, View } from 'react-native'
import { ResizeMode, Video } from 'expo-av';
import { StyleSheet } from 'react-native';

export default function Social() {

  const styles = useStyles()
  const [darkMode, setDarkMode] = useState<boolean>(false)
  const [primaryColor, setPrimaryColor] = useState<string>()
  const [textBodyColor, setTextBodyColor] = useState<string>('')
  const [textSubColor, setTextSubColor] = useState<string>('')
  const [background, setBackground] = useState<string>('')
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
    const background = urlParams.get('background');
    const text = urlParams.get('text');
    const subTitle = urlParams.get('subtitle');
    const apiRegion = urlParams.get('apiRegion');
    if (darkMode === 'true') {
      setDarkMode(true)
    }
    if (primary) setPrimaryColor(`#${primary}`)
    if (apiKey) setApiKey(apiKey)
    if (userId) setUserId(userId)
    if (apiRegion) setApiRegion(apiRegion)
    if(background) setBackground(`#${background}`)
    if(text) setTextBodyColor(`#${text}`)
    if(subTitle) setTextSubColor(`#${subTitle}`)

    setTimeout(() => {
      setLoading(false)
    }, 1000);
  }, [])

  const myTheme = {
    primary: primaryColor, // Primary color for main elements
    background: background,
    base: textBodyColor,
    baseShade1: textSubColor,
    baseShade2: textSubColor,
    baseShade3: textSubColor,
  };


  console.log('myTheme: ', myTheme);


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
        </View> : <AmityUiKitSocial />
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
