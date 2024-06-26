import React, { useEffect, useRef, useState } from "react";
// import { Amplify } from "aws-amplify";
// import amplifyconfig from "./src/amplifyconfiguration.json";
// Amplify.configure(amplifyconfig);
import {
  AmityUiKitProvider,
  AmityUiKitSocial,
} from "@amityco/react-native-social-ui-kit";
import { ActivityIndicator, View } from "react-native";
import { StyleSheet } from "react-native";
import {
  API_KEY_GAMING,
  API_KEY_SPORT,
  API_KEY_FITNESS,
  API_KEY_FINANCIAL,
  API_KEY_TRAVEL,
  API_KEY_DEFAULT,
  API_KEY_AUTOMOTIVE,
} from "@env";

export default function Social() {
  const styles = useStyles();
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [primaryColor, setPrimaryColor] = useState<string>();
  const [textBodyColor, setTextBodyColor] = useState<string>("");
  const [textSubColor, setTextSubColor] = useState<string>("");
  const [border, setBorder] = useState<string>("");
  const [background, setBackground] = useState<string>("#FFFFFF");
  const [apiKey, setApiKey] = useState<string>("");

  const [userId, setUserId] = useState<string>("top");
  const [displayName, setDisplayName] = useState<string>("top");
  const [apiRegion, setApiRegion] = useState<string>("eu");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const handleMessage = (event:any) => {
      // Check the origin of the message to ensure it's from a trusted source
      // if (event.origin !== 'http://localhost:3000') { // Change this to the actual origin of your parent
      //   return;
      // }
      // Handle the received message
      if (event.data.action === 'theme') {
        if (event.data.data === 'light') {
          setDarkMode(false)
          setBackground("#FFFFFF");
          setTextBodyColor("#292b32")
          setTextSubColor("#898e9e")
        }
        else {
          setDarkMode(true)
          setBackground("#191919");
          setTextBodyColor("#FFFFFF")
          setTextSubColor("#FFFFFF")
        }
      }
      if (event.data.action === 'category') {
        chooseCategoryApiKey(event.data.data)
      }

      if (event.data.action === 'saveTheme') {
        console.log('saveTheme: ', event.data.data);
        const { primary, background, base, baseShade1, border } = event.data.data
        setPrimaryColor(primary)
        setBackground(background)
        setTextBodyColor(base)
        setTextSubColor(baseShade1)
        setBorder(border)

      }
      console.log('Message received from parent playground:', event.data);
    };

    window.addEventListener('message', handleMessage, false);

    // Send a message to the parent window


    return () => {
      window.removeEventListener('message', handleMessage, false);
    };
  }, []);
  const autoJoinUser = async () => {
    try {
      const response = await fetch("https://apix.eu.amity.co/api/v4/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({ userId: userId, deviceId: userId }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const { accessToken } = await response.json();
      if (accessToken) queryCommunities(accessToken);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const queryCommunities = async (accessToken: string) => {
    try {
      const response = await fetch(
        "https://apix.eu.amity.co/api/v3/communities?isDeleted=false",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const communityIds = data.communities.map(
        (item: { communityId: string }) => item.communityId
      );
      const joinPromises = communityIds.map((communityId: string) =>
        joinUserToCommunity(communityId, accessToken)
      );

      const results = await Promise.all(joinPromises);
      if (results.length > 0) {
        setTimeout(() => {
          setLoading(false);
        }, 200);

      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const joinUserToCommunity = async (
    communityId: string,
    accessToken: string
  ) => {
    try {
      const response = await fetch(
        `https://apix.eu.amity.co/api/v3/communities/${communityId}/join`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (data) return true;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (apiKey) autoJoinUser();
  }, [apiKey]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    // const darkMode = urlParams.get("darkMode");
    const primary = urlParams.get("primary");
    const userId = urlParams.get("userId");
    const displayName = urlParams.get("displayName");
    const background = urlParams.get("background");
    const text = urlParams.get("text");
    const subTitle = urlParams.get("subtitle");
    const category = urlParams.get("category");
    const apiKey = urlParams.get("apiKey");
    const apiRegion = urlParams.get("apiRegion");

    if (category) {
      chooseCategoryApiKey(category);
    }

    // if (darkMode === "true") {
    //   setDarkMode(true);
    //   setBackground("#191919");
    // }
    // if (primary) setPrimaryColor(`#${primary}`);
    if (userId) setUserId(userId);
    if (displayName) setDisplayName(displayName);
    // if (background) setBackground(`#${background}`);
    // if (text) setTextBodyColor(`#${text}`);
    // if (subTitle) setTextSubColor(`#${subTitle}`);
    // if (apiKey && apiRegion) {
    //   setApiKey(apiKey);
    //   setApiRegion(apiRegion);
    //   setLoading(false);
    // } else {
    // chooseCategoryApiKey('travel');
    // }
  }, []);

  const chooseCategoryApiKey = (category: string) => {
    switch (category) {
      case "travel":
        setApiKey(API_KEY_TRAVEL);
        break;
      case "financial":
        setApiKey(API_KEY_FINANCIAL);
        break;

      case "fitness":
        setApiKey(API_KEY_FITNESS);
        break;

      case "sport":
        setApiKey(API_KEY_SPORT);
        break;
      case "gaming":
        setApiKey(API_KEY_GAMING);
        break;
      case "automotive":
        setApiKey(API_KEY_AUTOMOTIVE);
        break;
      default:
        setApiRegion("sg");
        setApiKey(API_KEY_DEFAULT);
        break;
    }
  };

  const myTheme = {
    primary: primaryColor, // Primary color for main elements
    background: background,
    base: textBodyColor,
    baseShade1: textSubColor,
    baseShade2: textSubColor,
    baseShade3: textSubColor,
    border: border

  };

  return (
    apiKey && (
      <AmityUiKitProvider
        apiKey={apiKey}
        apiRegion={apiRegion}
        userId={userId}
        displayName={displayName}
        apiEndpoint={`https://api.${apiRegion}.amity.co`}
        theme={myTheme}
        darkMode={darkMode}
      >

        {loading ? (
          <View style={loading ? styles.loadingContainer : styles.hide}>
            <ActivityIndicator color={primaryColor} size="large" />
          </View>
        ) : (
          <AmityUiKitSocial />
        )}

      </AmityUiKitProvider>
    )
  );
}
const useStyles = () => {
  const styles = StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%",
    },
    hide: {
      display: "none",
    },
  });
  return styles;
};
