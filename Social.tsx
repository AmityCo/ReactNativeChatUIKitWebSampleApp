import React, { useEffect, useRef, useState } from 'react';
// import { Amplify } from "aws-amplify";
// import amplifyconfig from "./src/amplifyconfiguration.json";
// Amplify.configure(amplifyconfig);
import {
  AmityUiKitProvider,
  AmityUiKitSocial,
} from "@amityco/react-native-social-ui-kit";
import { ActivityIndicator, Text, View } from 'react-native'
import { StyleSheet } from 'react-native';
import { API_KEY_GAMING, API_KEY_SPORT, API_KEY_FITNESS, API_KEY_FINANCIAL, API_KEY_TRAVEL, API_KEY_DEFAULT } from '@env';



export default function Social() {



  const styles = useStyles()
  const [darkMode, setDarkMode] = useState<boolean>(false)
  const [primaryColor, setPrimaryColor] = useState<string>()
  const [textBodyColor, setTextBodyColor] = useState<string>('')
  const [textSubColor, setTextSubColor] = useState<string>('')
  const [background, setBackground] = useState<string>('#FFFFFF')
  const [apiKey, setApiKey] = useState<string>('')

  const [userId, setUserId] = useState<string>('')
  const [apiRegion, setApiRegion] = useState<string>('eu')
  const [loading, setLoading] = useState<boolean>(true)


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const darkMode = urlParams.get('darkMode');
    const primary = urlParams.get('primary');
    const userId = urlParams.get('userId');
    const background = urlParams.get('background');
    const text = urlParams.get('text');
    const subTitle = urlParams.get('subtitle');
    const category = urlParams.get('category');
    const apiKey = urlParams.get('apiKey');
    const apiRegion = urlParams.get('apiRegion');


    if (darkMode === 'true') {
      setDarkMode(true)
      setBackground('#191919')
    }
    if (primary) setPrimaryColor(`#${primary}`)
    if (userId) setUserId(userId)
    if (background) setBackground(`#${background}`)
    if (text) setTextBodyColor(`#${text}`)
    if (subTitle) setTextSubColor(`#${subTitle}`)
    if (apiKey && apiRegion) {
      setApiKey(apiKey)
      setApiRegion(apiRegion)
    } else {
      chooseCategoryApiKey(category as string)
    }

    setTimeout(() => {
      setLoading(false)
    }, 1000);
  }, [])

  const chooseCategoryApiKey = (category: string) => {
    switch (category) {
      case 'travel':
        setApiKey(API_KEY_TRAVEL)
        break;
      case 'financial':
        setApiKey(API_KEY_TRAVEL)
        break;

      case 'fitness':
        setApiKey(API_KEY_FITNESS)
        break;

      case 'sport':
        setApiKey(API_KEY_SPORT)
        break;
      case 'gaming':
        setApiKey(API_KEY_GAMING)
        break;

      default:
        setApiRegion('sg')
        setApiKey(API_KEY_DEFAULT)
        break;
    }
  }

  const myTheme = {
    primary: primaryColor, // Primary color for main elements
    background: background,
    base: textBodyColor,
    baseShade1: textSubColor,
    baseShade2: textSubColor,
    baseShade3: textSubColor,
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
