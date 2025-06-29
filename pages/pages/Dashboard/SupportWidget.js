import React, { useEffect, useRef, useState } from "react";
import {
  Widget,
  addResponseMessage,
  addUserMessage,
  deleteMessages,
} from "react-chat-widget";

import { useSelector } from "react-redux";
import { brandColor } from "../../data/constants";
import { getPartner, selectUser } from "../../redux/auth/selectors";
import ChatService from "../../service/ChatService";

const SupportWidget = () => {
  const partner = useSelector(getPartner);
  const user = useSelector(selectUser);
  const socket = useRef(null);
  const socketPing = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const conversationContainer = document.querySelector(".rcw-header");
    const notificationBadge = document.querySelector(
      ".rcw-launcher > .rcw-badge"
    );
    const widgetButton = document.querySelector(".rcw-launcher");

    if (conversationContainer)
      conversationContainer.style.backgroundColor =
        partner?.themeColor ?? brandColor;
    if (widgetButton) {
      widgetButton.style.height = "45px";
      widgetButton.style.width = "45px";
      widgetButton.style.backgroundColor = partner?.themeColor ?? brandColor;
      widgetButton.style.display = "flex";
      widgetButton.style.alignItems = "center";
      widgetButton.style.justifyContent = "center";
    }
    if (notificationBadge) {
      notificationBadge.style.top = "-13px";
      notificationBadge.style.right = "-9px";
    }
  }, [partner]);

  useEffect(() => {
    if (user && !loaded) {
      setLoaded(true);
      if (partner.owner === user._id) {
        ChatService.getPartnerSupportMessages().then(({ data }) => {
          for (const message of data.messages) {
            if (message.from === user._id) addUserMessage(message.text);
            else addResponseMessage(message.text);
          }
        });
      } else {
        ChatService.messages().then(({ data }) => {
          for (const message of data.messages) {
            if (message.from === user._id) addUserMessage(message.text);
            else addResponseMessage(message.text);
          }
        });
      }
    }
  }, [user, partner, loaded]);

  const handleNewUserMessage = async (newMessage) => {
    await ChatService.submitTicket({ text: newMessage });
    setTimeout(
      () =>
        socket.current.send(
          JSON.stringify({
            id: "MESSAGE",
            payload: {
              recipientId:
                user?.role === "partner"
                  ? "RECRUITER_SUPER_ADMIN"
                  : partner?.owner,
              message: newMessage,
              iNeedHelp: true,
            },
          })
        ),
      100
    );
  };

  useEffect(() => {
    if (!user) return;
    socket.current = new WebSocket(
      `wss://booklified-chat-socket.herokuapp.com`
    );
    if (!socket.current) return;

    // WebSocket event listeners
    socket.current.addEventListener("open", async () => {
      socketPing.current = setInterval(
        () => socket.current.send(JSON.stringify({ id: "PING" })),
        30000
      );
      console.log("WebSocket connection established");
      socket.current.send(
        JSON.stringify({
          id: "AUTH",
          payload: user?.role === "admin" ? "RECRUITER_SUPER_ADMIN" : user._id,
        })
      );
    });

    socket.current.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      console.log("Message Websocket!", message);
      try {
        const id = message?.id;
        console.log(message);
        switch (id) {
          case "MESSAGE": {
            document.dispatchEvent(new CustomEvent("REFRESH.CHAT"));

            if (message?.payload?.message && !message.payload?.iNeedHelp)
              addResponseMessage(message.payload.message);

            break;
          }
          case "READ": {
            deleteMessages();
            addResponseMessage("Your issue has been marked as resolved");
            break;
          }
        }
      } catch (e) {
        console.error("Websocket error: ", e);
      }
      // Process the received message as needed
    });

    socket.current.addEventListener("close", () => {
      console.log("WebSocket connection closed");
    });

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      if (socket.current) socket.current.close();
      if (socketPing.current) clearInterval(socketPing.current);
    };
  }, [user]);

  if (user?.role === "admin") return <></>;
  return (
    <>
      <Widget
        handleNewUserMessage={handleNewUserMessage}
        profileAvatar={partner?.logo ?? ""}
        profileClientAvatar={user?.avatar ?? ""}
        title={partner?.supportWidgetTitle ?? ""}
        subtitle={partner?.supportWidgetSubTitle ?? ""}
        emojis
        showCloseButton
        resizable
        handleToggle={() => {
          setTimeout(() => {
            const conversationContainer = document.querySelector(".rcw-header");

            if (conversationContainer)
              conversationContainer.style["background-color"] =
                partner?.themeColor ?? brandColor;
          }, 10);
        }}
        showTimeStamp={false}
      />
    </>
  );
};

export default SupportWidget;
