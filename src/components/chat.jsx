import React, { useState, useRef, useEffect } from "react";
import {
    FaComments,
    FaCamera,
    FaEllipsisV,
    FaSearch,
    FaCommentDots,
    FaPhone,
    FaVideo,
    FaImage,
    FaMicrophone,
    FaStop,
    FaPaperPlane,
} from "react-icons/fa";


function Chat() {

    const [mobileChatOpen, setMobileChatOpen] = useState(false);
    const [messageText, setMessageText] = useState("");
    const [recording, setRecording] = useState(false);

    const [showAddChat, setShowAddChat] = useState(false);
    const [newChatName, setNewChatName] = useState("");

    const mediaRecorder = useRef(null);



    // Load chats from localStorage

    const [chats, setChats] = useState(() => {

        const savedChats =
            localStorage.getItem("myChats");


        return savedChats

            ?

            JSON.parse(savedChats)

            :

            [
                {
                    id: 1,
                    name: "John",
                    messages: [
                        {
                            type: "text",
                            content: "Hello",
                            sender: "chat"
                        }
                    ]
                },

                {
                    id: 2,
                    name: "Mary",
                    messages: []
                }
            ];

    });


    // Save chats automatically

    useEffect(() => {

        localStorage.setItem(
            "myChats",
            JSON.stringify(chats)
        );

    }, [chats]);



    // Selected chat saved

    const [selectedChat, setSelectedChat] = useState(() => {

        const saved =
            localStorage.getItem("selectedChat");


        return saved
            ?
            JSON.parse(saved)
            :
            null;

    });


    useEffect(() => {


        if (selectedChat) {

            localStorage.setItem(
                "selectedChat",
                JSON.stringify(selectedChat)
            );

        }


    }, [selectedChat]);


    // Add new chat

    const addChat = () => {


        if (newChatName.trim()) {


            const newChat = {

                id: Date.now(),

                name: newChatName,

                messages: []

            };



            setChats([
                ...chats,
                newChat
            ]);



            setNewChatName("");

            setShowAddChat(false);


        }

    };


    // Update selected chat messages

    const updateChatMessages = (newMessage) => {


        const updatedChats = chats.map(chat => {


            if (chat.id === selectedChat.id) {


                return {

                    ...chat,

                    messages: [

                        ...chat.messages,

                        newMessage

                    ]

                };


            }


            return chat;


        });


        setChats(updatedChats);


        const currentChat =
            updatedChats.find(
                chat => chat.id === selectedChat.id
            );



        setSelectedChat(currentChat);


    };


    // Send text

    const sendMessage = () => {


        if (messageText.trim() && selectedChat) {


            updateChatMessages({

                type: "text",

                content: messageText,

                sender: "me"

            });


            setMessageText("");


        }


    };



    // Send image

    const sendImage = (e) => {


        const file = e.target.files[0];



        if (file && selectedChat) {


            const imageURL =
                URL.createObjectURL(file);



            updateChatMessages({

                type: "image",

                content: imageURL,

                sender: "me"

            });


        }


    };



    // Start audio recording

    const startRecording = async () => {


        const stream =
            await navigator.mediaDevices.getUserMedia({

                audio: true

            });



        mediaRecorder.current =
            new MediaRecorder(stream);



        let audioChunks = [];



        mediaRecorder.current.ondataavailable = (e) => {

            audioChunks.push(e.data);

        };

        mediaRecorder.current.onstop = () => {


            const audioBlob =
                new Blob(
                    audioChunks,
                    {
                        type: "audio/mp3"
                    }
                );



            const audioURL =
                URL.createObjectURL(audioBlob);



            updateChatMessages({

                type: "audio",

                content: audioURL,

                sender: "me"

            });


        };

        mediaRecorder.current.start();

        setRecording(true);

    };


    const stopRecording = () => {


        if (mediaRecorder.current) {


            mediaRecorder.current.stop();


            setRecording(false);


        }

    };


    return (


        <div className={`chat-page ${mobileChatOpen ? "mobile-open" : ""}`}>

            {/* CHAT SECTION */}

            <div className="chat">


                <header className="chat-container">

                    <div className="header-top">

                        <FaComments className="icon" />


                        <div className="header-right">


                            <label>

                                <FaCamera className="icon" />

                                <input

                                    hidden

                                    type="file"

                                    accept="image/*"

                                    capture="environment"

                                    onChange={sendImage}

                                />

                            </label>



                            <FaEllipsisV className="icon" />


                        </div>


                    </div>


                    <div className="search-box">


                        <FaSearch />


                        <input

                            placeholder="Search chats..."


                        />


                    </div>


                </header>


                <div className="chat-list">


                    {

                        chats.map(chat => (


                            <div

                                className="chat-item"

                                key={chat.id}


                                onClick={() => {

                                    setSelectedChat(chat);

                                    setMobileChatOpen(true);

                                    localStorage.setItem(
                                        "selectedChat",
                                        JSON.stringify(chat)
                                    );

                                }}

                            >


                                <h3>

                                    {chat.name}

                                </h3>


                                <p>

                                    {

                                        chat.messages.length

                                            ?

                                            chat.messages[
                                                chat.messages.length - 1
                                            ].content

                                            :

                                            "Start chatting"

                                    }


                                </p>


                            </div>


                        ))


                    }


                </div>


                <button

                    className="message-btn"

                    onClick={() => setShowAddChat(true)}

                >

                    <FaCommentDots />

                </button>

                {

                    showAddChat &&


                    <div className="add-chat-box">


                        <h3>Add Chat</h3>


                        <input

                            value={newChatName}

                            onChange={
                                e => setNewChatName(e.target.value)
                            }

                            placeholder="Person name"

                        />


                        <button onClick={addChat}>

                            Add

                        </button>



                        <button

                            onClick={() => setShowAddChat(false)}

                        >

                            Cancel

                        </button>



                    </div>


                }


            </div>

            {/* MESSAGE SECTION */}

            <main className="message">


                {

                    selectedChat ?


                        <>


                            <div className="message-header">
                                <div>

                                    <button
                                        className="back-btn"
                                        onClick={() => setMobileChatOpen(false)}
                                    >
                                        ←
                                    </button>


                                    <h3>

                                        {selectedChat.name}

                                    </h3>
                                </div>

                                <div className="message-actions">


                                    <FaVideo className="icon" />

                                    <FaPhone className="icon" />

                                    <FaEllipsisV className="icon" />


                                </div>


                            </div>


                            <div className="messages">

                                {

                                    selectedChat.messages.map((msg, index) => (


                                        <div

                                            key={index}

                                            className={
                                                msg.sender === "me"
                                                    ?
                                                    "single-message my-message"
                                                    :
                                                    "single-message chat-message"
                                            }

                                        >


                                            {

                                                msg.type === "text" &&

                                                <p>

                                                    {msg.content}

                                                </p>

                                            }

                                            {

                                                msg.type === "image" &&

                                                <img

                                                    src={msg.content}

                                                    alt="sent"

                                                />

                                            }


                                            {

                                                msg.type === "audio" &&

                                                <audio

                                                    controls

                                                    src={msg.content}

                                                />

                                            }



                                        </div>


                                    ))


                                }

                            </div>


                            <div className="keyboard">


                                <label className="keyboard-btn">


                                    <FaImage />


                                    <input

                                        hidden

                                        type="file"

                                        accept="image/*"

                                        onChange={sendImage}

                                    />


                                </label>


                                <input

                                    className="message-input"

                                    value={messageText}

                                    onChange={
                                        e => setMessageText(e.target.value)
                                    }

                                    placeholder="Type message..."

                                />

                                <button

                                    className="keyboard-btn audio"

                                    onMouseDown={startRecording}

                                    onMouseUp={stopRecording}

                                    onTouchStart={startRecording}

                                    onTouchEnd={stopRecording}

                                >

                                    {

                                        recording

                                            ?

                                            <FaStop />

                                            :

                                            <FaMicrophone />

                                    }

                                </button>


                                <button

                                    className="keyboard-btn send"

                                    onClick={sendMessage}

                                >

                                    <FaPaperPlane />

                                </button>

                            </div>


                        </>

                        :

                        <div className="empty-message">

                            Select a chat to start messaging

                        </div>


                }


            </main>



        </div>


    );


}


export default Chat;