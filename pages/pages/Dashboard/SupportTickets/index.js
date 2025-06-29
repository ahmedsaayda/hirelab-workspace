import { UsersIcon } from "@heroicons/react/24/outline";
import { Button, Popconfirm, Skeleton } from "antd";
import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/auth/selectors";
import ChatService from "../../../service/ChatService";

const getPartner = (partner, user) =>
  partner.one?._id === user?._id ? partner.two : partner.one;

const PAGE_LIMIT = 10;

const SupportTickets = () => {
  const user = useSelector(selectUser);
  const [chatPartners, setChatPartners] = useState([]);
  const [currentChatPartner, setCurrentChatPartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [page, setPage] = useState(1);
  const [pageM, setPageM] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [hasMorePartners, setHasMorePartners] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingPartners, setLoadingPartners] = useState(false);
  const [mobileToggle, setMobileToggle] = useState(false);
  const socket = useRef(null);
  const socketPing = useRef(null);

  const messagesEndRef = useRef(null);

  // Load chat partner
  const loadChatPartners = useCallback(
    async (alternativePage, refresh = false) => {
      if (!refresh) setLoadingPartners(true);
      try {
        const response = await ChatService.getLatestChatPartners(
          alternativePage ?? page,
          PAGE_LIMIT
        );
        if (response.data) {
          setChatPartners((prevChatPartners) => [
            ...(refresh ? [] : prevChatPartners),
            ...response.data.chatPartners,
          ]);

          setHasMorePartners(
            !(response.data.total <= PAGE_LIMIT * (alternativePage ?? page))
          );
          setPage((p) => (alternativePage ?? p) + 1);
          if (!refresh && response.data.chatPartners?.[0])
            setCurrentChatPartner(response.data.chatPartners?.[0]);
        }
      } finally {
        setLoadingPartners(false);
      }
    },
    [page]
  );

  useEffect(() => {
    loadChatPartners(1);
  }, []);

  // Load messages for the current chat partner
  const loadMessages = useCallback(
    async (currentChatPartner, alternativePage, refresh = false) => {
      if (!currentChatPartner) return;

      const opponentId =
        currentChatPartner?.one === user._id
          ? currentChatPartner.two
          : currentChatPartner.one;
      if (!opponentId._id) return;

      if (!refresh) setLoadingMessages(true);
      try {
        const response = await ChatService.messages(
          opponentId._id,
          alternativePage ?? pageM,
          PAGE_LIMIT
        );

        if (response.data) {
          setMessages((prevMessages) => [
            ...response.data.messages,
            ...(refresh ? [] : prevMessages),
          ]);
          setPageM((prevPage) => (alternativePage ?? prevPage) + 1);

          setHasMoreMessages(
            !(response.data.total <= PAGE_LIMIT * (alternativePage ?? pageM))
          );
        }
      } finally {
        setLoadingMessages(false);
      }
    },
    [pageM, user]
  );

  useEffect(() => {
    if (!messagesEndRef.current) return;
    if (!currentChatPartner) return;

    setMessages([]);
    setPageM(1);
    setMessageText("");
    setMobileToggle(false);

    loadMessages(currentChatPartner, 1).then(() => {
      setTimeout(
        () =>
          (messagesEndRef.current.scrollTop =
            messagesEndRef.current.scrollHeight),
        10
      );
    });
  }, [messagesEndRef, currentChatPartner]);

  useEffect(() => {
    if (loadingMessages) return;
    if (!messagesEndRef.current) return;
    const handleScroll = () => {
      if (messagesEndRef.current && messagesEndRef.current.scrollTop < 50) {
        loadMessages(currentChatPartner);
      }
    };

    messagesEndRef.current.addEventListener("scroll", handleScroll);

    return () => {
      if (messagesEndRef.current)
        messagesEndRef.current.removeEventListener("scroll", handleScroll);
    };
  }, [loadingMessages, loadMessages, messagesEndRef, currentChatPartner]);

  // Function to handle sending a new message
  const handleSendMessage = useCallback(async () => {
    if (!currentChatPartner || !messageText) return;

    setMessageText("");
    // Send the message using ChatService
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        from: user._id,
        to: getPartner(currentChatPartner, user)?._id,
        text: messageText,
      },
    ]);
    setTimeout(
      () =>
        (messagesEndRef.current.scrollTop =
          messagesEndRef.current.scrollHeight),
      10
    );
    await ChatService.postChat({
      to:
        currentChatPartner.one === user._id
          ? currentChatPartner.two
          : currentChatPartner.one,
      text: messageText,
    });
    document.dispatchEvent(new CustomEvent("REFRESH.TICKETNUM"));

    setTimeout(
      () =>
        socket.current.send(
          JSON.stringify({
            id: "MESSAGE",
            payload: {
              recipientId:
                currentChatPartner.one === user._id
                  ? currentChatPartner.two?._id
                  : currentChatPartner.one?._id,
              message: messageText,
              iNeedHelp: false,
            },
          })
        ),
      100
    );
  }, [currentChatPartner, user, messageText, socket]);

  // Function to close a chat ticket
  const handleMarkTicketAsSolved = useCallback(
    async (fromId) => {
      await ChatService.closeTicket(fromId);
      setPageM(1);
      setPage(1);
      setMessages([]);
      setCurrentChatPartner(null);
      loadChatPartners(1, true);
      setMessageText("");
      const sender =
        currentChatPartner.one === user._id
          ? currentChatPartner.two?._id
          : currentChatPartner.one?._id;
      setTimeout(
        () =>
          socket.current.send(
            JSON.stringify({
              id: "READ",
              payload: {
                sender,
              },
            })
          ),
        100
      );
      document.dispatchEvent(new CustomEvent("REFRESH.CHAT"));
    },
    [socket, currentChatPartner]
  );

  const refreshChat = useCallback(async () => {
    document.dispatchEvent(new CustomEvent("REFRESH.TICKETNUM"));
    setPageM(1);
    setPage(1);

    loadChatPartners(1, true);
    loadMessages(currentChatPartner, 1, true).then(() => {
      setTimeout(
        () =>
          (messagesEndRef.current.scrollTop =
            messagesEndRef.current.scrollHeight),
        10
      );
    });
  }, [loadMessages, currentChatPartner]);

  useEffect(() => {
    document.addEventListener("REFRESH.CHAT", refreshChat);
    return () => document.removeEventListener("REFRESH.CHAT", refreshChat);
  }, [refreshChat]);

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
          payload: user.role === "admin" ? "RECRUITER_SUPER_ADMIN" : user._id,
        })
      );
    });

    socket.current.addEventListener("close", () => {
      console.log("WebSocket connection closed");
    });

    return () => {
      if (socket.current) socket.current.close();
      if (socketPing.current) clearInterval(socketPing.current);
    };
  }, [user]);

  return (
    <>
      <div className="w-full h-screen ">
        <div className="flex ">
          <div
            className="flex-1 bg-gray-100 dark:bg-gray-900 w-full h-full"
            style={{ minHeight: 500 }}
          >
            <div className="main-body container m-auto w-11/12 h-full flex flex-col">
              <div className="py-4 flex-2 flex flex-row">
                <div className="flex-1">
                  <span
                    onClick={() => setMobileToggle((e) => !e)}
                    className="xl:hidden inline-block text-gray-700 dark:text-gray-300  hover:text-gray-900 dark:text-gray-400  align-bottom"
                  >
                    <span className="block h-6 w-6 p-1 rounded-full hover:bg-gray-400">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </span>
                  </span>
                </div>
              </div>
              <div className="main flex-1 flex flex-col h-full">
                <div className="block heading flex-2"></div>
                <div className="flex-1 flex h-full">
                  <div
                    className={`sidebar flex w-[100vw] ${
                      mobileToggle ? "" : "hidden"
                    } md:block md:w-1/3 2xl:w-1/4 md:flex-2 md:flex-col md:pr-6`}
                  >
                    {/* <div className="search flex-2 pb-6 px-2">
                      <input
                        type="text"
                        className="outline-none py-2 block w-full bg-transparent border-b-2 border-gray-200 dark:border-gray-600 "
                        placeholder="Search"
                      />
                    </div> */}
                    <div
                      className="flex-1 overflow-auto p-2 h-full"
                      style={{ height: 635 }}
                    >
                      {chatPartners.map((partner) => (
                        <div
                          key={partner._id}
                          onClick={() => {
                            setCurrentChatPartner(partner);
                          }}
                          className="entry cursor-pointer transform hover:scale-105 duration-300 transition-transform bg-white dark:bg-gray-900 mb-4 rounded p-4 flex shadow-md dark:shadow-gray-400/50 hover:shadow-gray-600/50 "
                        >
                          <div className="flex-1 ">
                            {getPartner(partner, user)?.avatar ? (
                              <div className="flex-2">
                                <div className="w-8 h-8 relative">
                                  <img
                                    className="w-8 h-8 rounded-full mx-auto"
                                    src={getPartner(partner, user)?.avatar}
                                    alt="chat-user"
                                  />
                                  <span className="absolute w-4 h-4 bg-gray-400 rounded-full right-0 bottom-0 border-2 border-white" />
                                </div>
                              </div>
                            ) : (
                              <UsersIcon className="h-8 w-8 rounded-full bg-gray-50" />
                            )}
                          </div>

                          <div className="flex-1 px-2">
                            <div className="truncate w-[100%]">
                              <span className="text-gray-800 dark:text-gray-300">
                                {getPartner(partner, user)?.firstName}{" "}
                                {getPartner(partner, user)?.lastName}
                              </span>
                            </div>
                            <div>
                              <small className="text-gray-600">
                                {partner?.lastMessage}
                              </small>{" "}
                            </div>
                          </div>
                          <div className="flex-2 text-right">
                            <div>
                              <small className="text-gray-500">
                                {moment(partner.last).format("Do MMM")}
                              </small>
                            </div>
                            {partner.numberMessages > 0 && (
                              <div>
                                <small className="text-xs bg-red-500 text-white rounded-full h-6 w-6 leading-6 text-center inline-block">
                                  {partner.numberMessages}
                                </small>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      {loadingPartners && <Skeleton active />}

                      {hasMorePartners && (
                        <Button onClick={loadChatPartners}>Load More</Button>
                      )}
                    </div>
                  </div>
                  <div
                    className={`chat-area flex-1 flex flex-col h-full ${
                      mobileToggle ? "hidden" : ""
                    } lg:block`}
                    style={{ height: 445 }}
                  >
                    <div className="flex-3">
                      {currentChatPartner ? (
                        <div className="flex items-center py-1 justify-between mb-8 border-b-2 border-gray-200 dark:border-gray-600 ">
                          <h2 className="text-xl  ">
                            Support inquiry:{" "}
                            <b>
                              {getPartner(currentChatPartner, user)?.firstName}{" "}
                              {getPartner(currentChatPartner, user)?.lastName}
                            </b>
                          </h2>

                          <Popconfirm
                            title="Are you sure to close this ticket?"
                            onConfirm={async (e) => {
                              if (currentChatPartner?._id)
                                await handleMarkTicketAsSolved(
                                  getPartner(currentChatPartner, user)?._id
                                );
                            }}
                          >
                            <button className="bg-indigo-400 px-2 py-1 text-white rounded-md inline-block">
                              <span className="inline-block align-text-bottom">
                                Solved
                              </span>
                            </button>
                          </Popconfirm>
                        </div>
                      ) : (
                        <div style={{ height: 74 }}></div>
                      )}
                    </div>
                    <div
                      className="messages flex-1 overflow-auto h-full"
                      ref={messagesEndRef}
                    >
                      {loadingMessages && <Skeleton active />}
                      {messages.map((message) => (
                        <div
                          className={`message me mb-4 flex ${
                            message.from === user._id
                              ? "text-right"
                              : "text-left"
                          }`}
                        >
                          {message.from === user._id ? (
                            <>
                              <div className="flex-1 px-2">
                                <div className="inline-block bg-indigo-600 rounded-full p-2 px-6 text-white">
                                  <span>{message.text}</span>
                                </div>
                                <div className="pr-4">
                                  <small className="text-gray-500">
                                    {moment(message.createdAt).format(
                                      "HH:mm, Do MMM"
                                    )}
                                  </small>
                                </div>
                              </div>
                              <div className="flex-2">
                                <div className="w-8 h-8 relative">
                                  {user?.avatar ? (
                                    <div className="flex-2">
                                      <div className="w-8 h-8 relative">
                                        <img
                                          className="w-8 h-8 rounded-full mx-auto"
                                          src={user?.avatar}
                                          alt="chat-user"
                                        />
                                        <span className="absolute w-4 h-4 bg-gray-400 rounded-full right-0 bottom-0 border-2 border-white" />
                                      </div>
                                    </div>
                                  ) : (
                                    <UsersIcon className="h-8 w-8 rounded-full bg-gray-50" />
                                  )}

                                  {/* <span className="absolute w-4 h-4 bg-gray-400 rounded-full right-0 bottom-0 border-2 border-white" /> */}
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex-2">
                                <div className="w-8 h-8 relative">
                                  {getPartner(currentChatPartner, user)
                                    ?.avatar ? (
                                    <div className="flex-2">
                                      <div className="w-8 h-8 relative">
                                        <img
                                          className="w-8 h-8 rounded-full mx-auto"
                                          src={
                                            getPartner(currentChatPartner, user)
                                              ?.avatar
                                          }
                                          alt="chat-user"
                                        />
                                        <span className="absolute w-4 h-4 bg-gray-400 rounded-full right-0 bottom-0 border-2 border-white" />
                                      </div>
                                    </div>
                                  ) : (
                                    <UsersIcon className="h-8 w-8 rounded-full bg-gray-50" />
                                  )}

                                  {/* <span className="absolute w-4 h-4 bg-gray-400 rounded-full right-0 bottom-0 border-2 border-white" /> */}
                                </div>
                              </div>
                              <div className="flex-1 px-2">
                                <div className="inline-block bg-gray-300 rounded-full p-2 px-6 text-gray-700  ">
                                  <span>{message.text}</span>
                                </div>
                                <div className="pl-4">
                                  <small className="text-gray-500">
                                    {moment(message.createdAt).format(
                                      "HH:mm, Do MMM"
                                    )}
                                  </small>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex-2 pt-4 pb-10">
                      <div className="write bg-white dark:bg-gray-900 shadow flex items-start gap-2 rounded-lg">
                        <div className="flex-1 pl-4">
                          <textarea
                            style={{ border: "1px transparent" }}
                            name="message"
                            className="w-full block outline-none p-1 bg-transparent "
                            placeholder="Type a message..."
                            autoFocus
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                          />
                        </div>
                        <div className="flex-2 w-16 p-2 flex content-center items-center">
                          <div className="flex-1">
                            <button
                              className="bg-indigo-400 w-10 h-10 rounded-full inline-block"
                              onClick={handleSendMessage}
                            >
                              <span className="inline-block align-text-bottom">
                                <svg
                                  fill="none"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  viewBox="0 0 24 24"
                                  className="w-4 h-4 text-white"
                                >
                                  <path d="M5 13l4 4L19 7" />
                                </svg>
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SupportTickets;
