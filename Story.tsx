import "@amityco/ui-kit-open-source/dist/index.css";
import React, { useEffect, useRef, useState } from "react";
import {
  AmityUiKitProvider,
  AmityLiveChatPage,
  AmityLiveChatMessageList,
  AmityLiveChatMessageComposeBar,
  AmityStoryTabComponent,
  AmityViewStoryPage,
} from "@amityco/ui-kit-open-source";
import { Client, ChannelRepository } from "@amityco/ts-sdk";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { ASC_APPLICATIONS } from "@env";
import config from "./uikit.config.json";

export default function Story() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [primaryColor, setPrimaryColor] = useState<string>();
  const [apiKey, setApiKey] = useState<string>("b3babb0b3a89f4341d31dc1a01091edcd70f8de7b23d697f");
  const [userId, setUserId] = useState<string>("");
  const [apiRegion, setApiRegion] = useState<string>("sg");
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
    // setApiRegion(applicatons[category].region);
    // setApiKey(applicatons[category].apiKey);
    setChannelId(applicatons[category].channelId);
    setVideoFileId(applicatons[category].videoFileId);
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
     
        <AmityStoryTabComponent type="globalFeed" />
   


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
