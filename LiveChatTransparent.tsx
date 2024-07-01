import "@amityco/ui-kit/dist/index.css";
import React, { useEffect, useRef, useState } from "react";
import {
  AmityUiKitProvider,
  AmityLiveChatPage,
  AmityLiveChatMessageList,
  AmityLiveChatMessageComposeBar,
} from "@amityco/ui-kit";
import { Client, ChannelRepository } from "@amityco/ts-sdk";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { ASC_APPLICATIONS } from "@env";
import config from "./uikit.config.json";

export default function LiveChat() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [primaryColor, setPrimaryColor] = useState<string>();
  const [apiKey, setApiKey] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [apiRegion, setApiRegion] = useState<string>("eu");
  const [loading, setLoading] = useState<boolean>(true);
  const [channelId, setChannelId] = useState<string | null>(null);
  const [videoFileId, setVideoFileId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [uiKitConfig, setUIKitConfig] = useState({ ...config });
  const [channel, setChannel] = useState<any>(undefined);
  const mentionSuggestionRef = useRef<HTMLDivElement>(null);
  const [replyMessage, setReplyMessage] = useState<Amity.Message | undefined>();
  const [mentionMessage, setMentionMessage] = useState<
    Amity.Message | undefined
  >();

  const styles = useStyles();
  const sessionHandler: Amity.SessionHandler = {
    sessionWillRenewAccessToken(renewal: Amity.AccessTokenRenewal) {
      // for details on other renewal methods check session handler
      renewal.renew();
    },
  };
  useEffect(() => {
    const handleMessage = (event: {
      data: { payload: { type: any; value: any } };
    }) => {
      const { type, value } = event.data.payload;
      //console.log("Message event received:", event.data.payload);

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
            [`*/message_composer/*`]: {
              ...prevConfig.customizations[`*/message_composer/*`],
              preferred_theme: newTheme,
            },
            [`*/message_list/*`]: {
              ...prevConfig.customizations[`*/message_list/*`],
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
            [`*/message_composer/*`]: {
              ...prevConfig.customizations[`*/message_composer/*`],
              theme: {
                ...prevConfig.customizations[`*/message_composer/*`].theme,
                [themeDetails]: {
                  primary_color: value.primary,
                  background_color: value.background,
                  base_color: value.base,
                  base_shade1_color: value.baseShade1,
                },
              },
            },
            [`*/message_list/*`]: {
              ...prevConfig.customizations[`*/message_list/*`],
              theme: {
                ...prevConfig.customizations[`*/message_list/*`].theme,
                [themeDetails]: {
                  base_inverse_color: value.primary,
                  base_shade4_color: value.background,
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
  }, [darkMode, primaryColor]);

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
      Client.createClient(apiKey, apiRegion);
      (async () => {
        const isConnected = await Client.login(
          {
            userId: userId,
            displayName: displayName, // optional
            authToken: userId, // only required if using secure mode
          },
          sessionHandler
        );
        if (isConnected) {
          ChannelRepository.getChannel(
            channelId,
            ({ data: channel, loading, error }) => {
              if (channel) {
                console.log("channel", JSON.stringify(channel));
                setChannel(channel);
              }
              if (error) {
                console.log(error);
              }
            }
          );
        }
      })();
      autoJoinUser();
    }
  }, [apiKey, userId, apiRegion, channelId, displayName]);

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
        <div ref={mentionSuggestionRef}>
          {/* User suggestion panel will render here */}
        </div>
        {loading ? (
          <View style={loading ? styles.loadingContainer : styles.hide}>
            <ActivityIndicator color={primaryColor} size="large" />
          </View>
        ) : (
          <View style={styles.container}>
            <video
              src={`https://api.eu.amity.co/api/v3/files/be2ed99ad7bf485797a260e157d526e9/download?size=full`}
              muted={true}
              loop={true}
              autoPlay={true}
              style={styles.videoPlayer}
            />
            {channel && channelId && (
              <View style={styles.chatContainer}>
                {/* {<AmityLiveChatPage channelId={channelId} />} */}
                <AmityLiveChatMessageList
                  channel={channel} // channel model
                  replyMessage={setReplyMessage} // function to set reply message
                />
                <AmityLiveChatMessageComposeBar
                  channel={channel}
                  suggestionRef={mentionSuggestionRef}
                  composeAction={{
                    replyMessage,
                    mentionMessage,
                    clearReplyMessage: () => setReplyMessage(undefined),
                    clearMention: () => setMentionMessage(undefined),
                  }}
                />
              </View>
            )}
          </View>
        )}
      </AmityUiKitProvider>
    )
  );
}
const useStyles = () => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      position: "relative", // Ensures that the container can hold absolute children
      maxWidth: 600,
      alignSelf: "center",
      width: "100%",
      height: "100%",
    },
    videoPlayer: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%", // Ensures that the video covers the entire container
      height: "100%", // Covers the full height of the container
      objectFit: "cover", // Ensures video covers the available space without distortion
    },
    chatContainer: {
      position: "absolute", // Allows the chat to float over the video
      bottom: 0,
      left: 0,
      width: "100%",
      height: "60%",
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
