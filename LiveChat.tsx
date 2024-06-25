import "@amityco/ui-kit/dist/index.css";
import React, { useEffect, useState } from "react";
import { AmityUiKitProvider, AmityLiveChatPage } from "@amityco/ui-kit";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { ASC_APPLICATIONS } from "@env";
import config from "./uikit.config.json";

export default function LiveChat() {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [primaryColor, setPrimaryColor] = useState<string>();
  const [apiKey, setApiKey] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [apiRegion, setApiRegion] = useState<string>("eu");
  const [loading, setLoading] = useState<boolean>(true);
  const [channelId, setChannelId] = useState<string | null>(null);
  const [videoFileId, setVideoFileId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [uiKitConfig, setUIKitConfig] = useState({ ...config });

  const styles = useStyles(
    darkMode
      ? uiKitConfig.customizations["live_chat/*/*"].theme.dark.background_color
      : uiKitConfig.customizations["live_chat/*/*"].theme.light.background_color
  );

  useEffect(() => {
    const handleMessage = (event: {
      data: { payload: { type: any; value: any } };
    }) => {
      const { type, value } = event.data.payload;
      console.log("Message event received:", event.data.payload);

      if (type === "theme") {
        const themeKey = `live_chat/*/*`;
        const newTheme = value === "dark" ? "dark" : "light";
        setUIKitConfig((prevConfig) => ({
          ...prevConfig,
          customizations: {
            ...prevConfig.customizations,
            [themeKey]: {
              ...prevConfig.customizations[themeKey],
              preferred_theme: newTheme,
            },
          },
        }));
        setDarkMode(newTheme === "dark");
      } else if (type === "saveTheme") {
        const themeDetails = darkMode ? "dark" : "light";
        setUIKitConfig((prevConfig) => ({
          ...prevConfig,
          customizations: {
            ...prevConfig.customizations,
            [`live_chat/*/*`]: {
              ...prevConfig.customizations[`live_chat/*/*`],
              theme: {
                ...prevConfig.customizations[`live_chat/*/*`].theme,
                [themeDetails]: {
                  primary_color: value.primary,
                  background_color: value.background,
                  base_color: value.base,
                  base_shade1_color: value.baseShade1,
                },
              },
            },
          },
        }));
        setPrimaryColor(value.primary);
      }
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
    if (!category) return;
    const applicatons = JSON.parse(ASC_APPLICATIONS);
    setApiRegion(applicatons[category].region);
    setApiKey(applicatons[category].apiKey);
    setChannelId(applicatons[category].channelId);
    setVideoFileId(applicatons[category].videoFileId);
  };

  useEffect(() => {
    if (apiKey && userId && apiRegion && channelId && displayName) {
      autoJoinUser();
    }
  }, [apiKey, userId, apiRegion, channelId, displayName]);

  useEffect(() => {
    console.log(uiKitConfig);
  }, [uiKitConfig]);

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
      if (accessToken && channelId)
        await joinUserToChannel(channelId, accessToken);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    apiKey &&
    userId &&
    displayName && (
      <AmityUiKitProvider
        apiKey={apiKey}
        apiRegion={apiRegion}
        userId={userId}
        displayName={displayName}
        configs={uiKitConfig as any}
      >
        {loading ? (
          <View style={loading ? styles.loadingContainer : styles.hide}>
            <ActivityIndicator color={primaryColor} size="large" />
          </View>
        ) : (
          <View style={styles.container}>
            <View style={styles.videoPlayer}>
              <video
                src={`https://api.${apiRegion}.amity.co/api/v3/files/${videoFileId}/download?size=medium`}
                muted={true}
                loop={true}
                autoPlay={true}
              />
            </View>
            <View style={styles.chatContainer}>
              <AmityLiveChatPage channelId={channelId} />
            </View>
          </View>
        )}
      </AmityUiKitProvider>
    )
  );
}

const useStyles = (bgColor: string) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      backgroundColor: "#000",
      alignItems: "center",
      justifyContent: "space-between",
      maxWidth: 600,
      alignSelf: "center",
      width: "100%",
      height: "100%",
      elevation: 10, // Use elevation for shadow on Android
      shadowColor: "#000", // Shadow properties for iOS
      shadowOffset: { width: 0, height: 0 },
      gap: 10,
    },
    videoPlayer: {
      width: "100%", // Responsive video width
      height: "30%", // Responsive video height
      aspectRatio: 16 / 9, // Maintain aspect ratio of 16:9
      backgroundColor: bgColor || "#000",
      objectFit: "cover", // Cover the video player
    },
    chatContainer: {
      width: "100%",
      height: "70%",
    },
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
