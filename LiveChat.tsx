import "@amityco/ui-kit/dist/index.css";
import React, { useEffect, useState } from "react";
import { AmityUiKitProvider, AmityLiveChatPage } from "@amityco/ui-kit";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import {
  API_KEY_GAMING,
  API_KEY_SPORT,
  API_KEY_FITNESS,
  API_KEY_FINANCIAL,
  API_KEY_TRAVEL,
  API_KEY_DEFAULT,
  API_KEY_AUTOMOTIVE,
} from "@env";
import config from "./uikit.config.json";

export default function LiveChat() {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const styles = useStyles();

  const [primaryColor, setPrimaryColor] = useState<string>();
  const [apiKey, setApiKey] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [apiRegion, setApiRegion] = useState<string>("eu");
  const [loading, setLoading] = useState<boolean>(true);
  const [channelId, setChannelId] = useState<string>(
    "6672911bf26ca561a56cc334"
  );
  const [uiKitConfig, setUIKitConfig] = useState({ ...config });
  const [displayName, setDisplayName] = useState<string>("");

  useEffect(() => {
    const handleMessage = (event: { data: { payload: any } }) => {
      console.log("Message event received:", event);
      // if (event.origin !== 'http://localhost:3000') { // Match this to the parent origin
      //   console.log('Origin mismatch, message ignored.');
      //   return;
      // }
      const data = event.data.payload;
      if (data.type === "theme") {
        if (data.value === "dark") {
          setUIKitConfig((prevConfig) => ({
            ...prevConfig,
            preferred_theme: "dark",
          }));
          setDarkMode(true);
        } else {
          setUIKitConfig((prevConfig) => ({
            ...prevConfig,
            preferred_theme: "light",
          }));
          setDarkMode(false);
        }
        // Handle theme change
      }
      if (data.type === "saveTheme") {
        if (darkMode) {
          setUIKitConfig((prevConfig) => ({
            ...prevConfig,
            theme: {
              ...prevConfig.theme,
              dark: {
                ...prevConfig.theme.dark,
                primary_color: data.value.primary,
              },
            },
          }));
        } else {
          setUIKitConfig((prevConfig) => ({
            ...prevConfig,
            theme: {
              ...prevConfig.theme,
              light: {
                ...prevConfig.theme.light,
                primary_color: data.value.primary,
              },
            },
          }));
        }
      }
      console.log(
        "Message received from parent playground:",
        event.data.payload
      );
    };

    window.addEventListener("message", handleMessage, false);

    return () => {
      window.removeEventListener("message", handleMessage, false);
    };
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");
    const userId = urlParams.get("userId");
    const displayName = urlParams.get("displayName");
    if (category) {
      chooseCategoryApiKey(category);
    } else {
      chooseCategoryApiKey("travel");
    }
    if (userId) setUserId(userId);
    if (displayName) setDisplayName(displayName);
  }, []);

  const chooseCategoryApiKey = (category: string) => {
    switch (category) {
      case "travel":
        setApiKey(API_KEY_TRAVEL);
        setChannelId("667292f74cf3400e79df2c4a");
        break;
      case "financial":
        setApiKey(API_KEY_FINANCIAL);
        setChannelId("6672911bf26ca561a56cc334");
        break;
      case "fitness":
        setApiKey(API_KEY_FITNESS);
        setChannelId("6672931a4a838d00b7c4ebcc");
        break;

      case "sport":
        setApiKey(API_KEY_SPORT);
        setChannelId("6672933894b6605ada7ccfc3");
        break;
      case "gaming":
        setApiKey(API_KEY_GAMING);
        setChannelId("6672935eeeedd308c849b655");
        break;
      case "automotive":
        setApiKey(API_KEY_AUTOMOTIVE);
        setChannelId("66729381022a6665fcf6931d");
        break;
      default:
        setApiRegion("sg");
        setApiKey(API_KEY_DEFAULT);
        break;
    }
  };

  useEffect(() => {
    if (apiKey && userId && apiRegion && channelId && displayName) {
      autoJoinUser();
    }
  }, [apiKey, userId, apiRegion, channelId, displayName, uiKitConfig]);

  const joinUserToChannel = async (channelId: string, accessToken: string) => {
    try {
      const response = await fetch(
        `https://apix.${apiRegion}.amity.co/api/v3/channels/${channelId}/join`,
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

      setLoading(false);
      const data = await response.json();
      if (data) return true;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const autoJoinUser = async () => {
    try {
      const response = await fetch(
        `https://apix.${apiRegion}.amity.co/api/v4/sessions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
          },
          body: JSON.stringify({ userId: userId, deviceId: userId }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const { accessToken } = await response.json();
      if (accessToken) await joinUserToChannel(channelId, accessToken);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    apiKey &&
    userId && (
      <AmityUiKitProvider
        apiKey={apiKey}
        apiRegion={apiRegion}
        userId={userId}
        displayName={displayName}
        theme={uiKitConfig}
      >
        {loading ? (
          <View style={loading ? styles.loadingContainer : styles.hide}>
            <ActivityIndicator color={primaryColor} size="large" />
          </View>
        ) : (
          <AmityLiveChatPage channelId={channelId} />
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
