import React from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useParams } from "react-router-dom";

export const RoomPage = () => {
  const { roomId } = useParams();

  const myMeeting = async () => {
    const appId = "";
    const serverSecret = "";
  };

  return <div className="room-page">{roomId}</div>;
};
