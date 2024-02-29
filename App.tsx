import React, { useEffect, useState } from 'react';
// import { Amplify } from "aws-amplify";
// import amplifyconfig from "./src/amplifyconfiguration.json";
// Amplify.configure(amplifyconfig);
    
import {
  AmityUiKitProvider,
  AmityUiKitChat,
} from "@amityco/react-native-chat-ui-kit";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Chat from './Chat';
import Social from './Social';

export default function App() {


  return (
    <Router>

            <Routes>
              <Route path="/" element={<Navigate to="/social" replace />} />
              <Route
                path="/social"
                element={
               <Social/>
                } />
              <Route path="/chat" element={
                <Chat/>
              } />
            </Routes>

        </Router>
  );
}
