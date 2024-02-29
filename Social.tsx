import React, { useEffect, useRef, useState } from 'react';
// import { Amplify } from "aws-amplify";
// import amplifyconfig from "./src/amplifyconfiguration.json";
// Amplify.configure(amplifyconfig);
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  AmityUiKitProvider,
  AmityUiKitSocial,
} from "@amityco/react-native-social-ui-kit";
import { Text, View } from 'react-native'
import { ResizeMode, Video } from 'expo-av';
export default function Social() {
  const [darkMode, setDarkMode] = useState<boolean>(false)
  const [primaryColor, setPrimaryColor] = useState<string>()
  const [apiKey, setApiKey] = useState<string>('')
  const [userId, setUserId] = useState<string>('')
  const [apiRegion, setApiRegion] = useState<string>('sg')
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const darkMode = urlParams.get('darkMode');
    const primary = urlParams.get('primary');
    const apiKey = urlParams.get('apiKey');
    console.log('apiKey: ', apiKey);
    const userId = urlParams.get('userId');
    console.log('primary: ', primary);
    if (darkMode === 'true') {
      setDarkMode(true)
    }
    if (primary) setPrimaryColor(`#${primary}`)
    if (apiKey) setApiKey(apiKey)
    if (userId) setUserId(userId)
    if (apiRegion) setApiRegion(apiRegion)
  }, [])
  const myTheme = {
    primary: primaryColor, // Primary color for main elements
  };
  const handleVideoLoad = () => {
    setVideoReady(true);
  };

  const videoRef = useRef(null);

  useEffect(() => {
    // Load and play the video when the component mounts
    const playVideo = async () => {
      if (videoRef.current) {
        await videoRef.current.loadAsync({ uri: 'https://api.sg.amity.co/api/v3/files/65b75b03265602bce94d8d6a/download' }, {}, false);
        await videoRef.current.playAsync();
      }
    };

    playVideo();

    // Cleanup: unload the video when the component unmounts
    return () => {
      if (videoRef.current) {
        videoRef.current.unloadAsync();
      }
    };
  }, []);

  return (

    apiKey ? <AmityUiKitProvider
      apiKey={apiKey}
      apiRegion={apiRegion}
      userId={userId}
      displayName={userId}
      apiEndpoint={`https://api.${apiRegion}.amity.co`}
      theme={myTheme}
      darkMode={darkMode}
    >
      <AmityUiKitSocial />

    </AmityUiKitProvider > :<View/>
    

  );
}
