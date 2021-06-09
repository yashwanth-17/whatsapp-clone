import React, { useState, useEffect, useRef } from "react";
import { AiOutlineSearch, AiOutlinePaperClip } from "react-icons/ai";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { CgSmileMouthOpen } from "react-icons/cg";
import { MdMic, MdDelete } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { db, firebase, auth } from "../firebase";
export default function ChatSection({ setinfoOpen, width, group, setGroup }) {
  const userID = auth.currentUser.uid;
  const [messages, setMessages] = useState([]);
  const [usernames, setUsernames] = useState([]);

  useEffect(() => {
    db.collection("groups/" + group.id + "/messages")
      .orderBy("time")
      .onSnapshot((snapshot) => {
        console.log(group.id);
        setMessages(
          snapshot.docs.map((doc) => {
            return {
              id: doc.id,
              ...doc.data(),
            };
          })
        );
      });
  }, [group]);
  useEffect(() => {
    let snaps = group.users.map((userid) => {
      let snap = db.collection("users").doc(userid).get();
      return snap;
    });
    Promise.all(snaps).then((docs) => {
      setUsernames(
        docs.map((doc) => {
          console.log(doc.data());
          return { id: doc.id, name: doc.data().name };
        })
      );
    });
  }, [group]);

  function sendMessage(message) {
    db.collection("groups/" + group.id + "/messages")
      .add(message)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  }
  return (
    <div className="chat" style={{ width: width }}>
      <TopBar
        name={group.name}
        usernames={usernames}
        img={group.img}
        setinfoOpen={setinfoOpen}
        group={group}
        setGroup={setGroup}
      />
      <MessageSection
        messages={messages}
        userID={userID}
        setMessages={setMessages}
        usernames={usernames}
        groupID={group.id}
      />
      <SendBar sendMessage={sendMessage} userID={userID} />
    </div>
  );
}

function useOutsideAlerter(ref, setddtoggle, ddtoggle) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setddtoggle(!ddtoggle);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, ddtoggle]);
}

function TopBar({ name, usernames, img, setinfoOpen, group, setGroup }) {
  const [ddtoggle, setddtoggle] = useState(false);
  const [modaltoggle, setModalToggle] = useState(false);
  const [addemail, setAddEmail] = useState();
  const wref = useRef(null);
  useOutsideAlerter(wref, setddtoggle, ddtoggle);

  function UserNamesList() {
    let dummynames = [];
    for (var i = 0; i < usernames.length - 1; i++) {
      dummynames.push(Object.values(usernames[i])[1]);
      dummynames.push(", ");
    }
    dummynames.push(Object.values(usernames[i])[1]);
    return <>{dummynames}</>;
  }
  function addmember(id) {
    db.collection("groups")
      .doc(group.id)
      .update({
        users: firebase.firestore.FieldValue.arrayUnion(id),
      });
    console.log(group.id);
    db.collection("users")
      .doc(id)
      .update({
        Groups: firebase.firestore.FieldValue.arrayUnion(group.id),
      });
  }
  function handleSubmit(e) {
    e.preventDefault();
    setModalToggle(false);
    db.collection("users")
      .where("email", "==", addemail)
      .get()
      .then((snap) => {
        snap.forEach((doc) => {
          addmember(doc.id);
        });
      });
  }
  function Modal() {
    return (
      <div className="modalBack">
        <div className="addmodal">
          <form autoComplete="off" onSubmit={(e) => handleSubmit(e)}>
            <div className="modalTitle">Enter Contact's email</div>
            <div className="modalForm">
              <input
                type="email"
                autoFocus="autoFocus"
                name="addemail"
                className="addemail"
                value={addemail}
                onChange={(e) => setAddEmail(e.target.value)}
              />
            </div>
            <div className="modalbuttons">
              <div
                className="cancelbutton"
                onClick={() => {
                  setModalToggle(false);
                  setAddEmail("");
                }}
              >
                CANCEL
              </div>
              <div
                className="deletebutton"
                onClick={(e) => {
                  setModalToggle(false);
                  handleSubmit(e);
                }}
              >
                ADD
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
  function DropDown() {
    return (
      <div ref={wref} className="ddMenu">
        <span
          className="ddItem"
          onClick={() => {
            setinfoOpen(true);
            setddtoggle(!ddtoggle);
          }}
        >
          Contact info
        </span>
        <span className="ddItem">Select Messages</span>
        <span
          className="ddItem"
          onClick={() => {
            setModalToggle(true);
            setddtoggle(false);
          }}
        >
          Add Participant
        </span>
        <span className="ddItem">Delete Chat</span>
      </div>
    );
  }
  return (
    <div className="topBar">
      <div onClick={() => setinfoOpen(true)}>
        {img !== "" ? (
          <img
            className="dp"
            src={img}
            alt="dp"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <img
            className="dp"
            src="https://lh3.googleusercontent.com/ABlX4ekWIQimPjZ1HlsMLYXibPo2xiWnZ2iny1clXQm2IQTcU2RG0-4S1srWsBQmGAo=s300"
            alt="dp"
            style={{ objectFit: "cover" }}
          />
        )}
      </div>
      <div
        className="details"
        onClick={() => {
          setinfoOpen(true);
        }}
      >
        <section className="gName">
          <span>{name}</span>
        </section>
        <section className="gMembers">
          {usernames.length !== 0 ? <UserNamesList /> : ""}
        </section>
      </div>
      <div className="icons">
        <AiOutlineSearch onClick={() => alert("Search Clicked")} />
        <BiDotsVerticalRounded
          role="button"
          onClick={() => setddtoggle(!ddtoggle)}
        />
      </div>
      {ddtoggle && <DropDown />}
      {modaltoggle && <Modal />}
    </div>
  );
}

function MessageSection({ messages, userID, setMessages, usernames, groupID }) {
  const color = "#029d00";
  useEffect(() => {
    messages.sort(function (a, b) {
      return new Date(b.time.seconds * 1000) - new Date(a.time.seconds * 1000);
    });
  }, []);
  const [showdeletemodal, setShowDeleteModal] = useState(false);
  const [showImgmodal, setShowImgModal] = useState(false);
  const [selectedmessageId, setSelectedMessageId] = useState("");
  const [selectedImgSrc, setSelectedImgSrc] = useState("");
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView();
  };

  useEffect(scrollToBottom, [messages]);
  function deletemsg() {
    setMessages(messages.filter((msg) => msg.id !== selectedmessageId));
    console.log(selectedmessageId);
    db.collection("groups/" + groupID + "/messages")
      .doc(selectedmessageId)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  }

  function DeleteModal({ type }) {
    return (
      <div className="modalBack">
        <div className="ownmodal">
          <div className="modalTitle">Delete {type}?</div>
          <div className="modalbuttons">
            <div
              className="cancelbutton"
              onClick={() => {
                setShowDeleteModal(false);
              }}
            >
              CANCEL
            </div>
            <div
              className="deletebutton"
              onClick={() => {
                setShowDeleteModal(false);
                deletemsg();
              }}
            >
              DELETE
            </div>
          </div>
        </div>
      </div>
    );
  }
  function ImgModal() {
    return (
      <div className="imgmodal">
        <span className="closebutton">
          <IoMdClose
            onClick={() => {
              setShowImgModal(!showImgmodal);
            }}
          />
        </span>
        <img src={selectedImgSrc} alt="selectedimg" />
      </div>
    );
  }
  function Sent({ message }) {
    var d = new Date(message.time);
    let time = d.toTimeString().split(" ")[0];
    let [h, m,] = time.split(":");
    let hm = h + ":" + m;
    return (
      <>
        <div className="sent">
          <span className="msg">{message.message}</span>
          <button className="dd">
            <MdDelete
              className="ddIcon"
              onClick={() => {
                setSelectedMessageId(message.id);
                setShowDeleteModal(true);
              }}
            />
          </button>
          <span className="time">{hm}</span>
        </div>
        {showdeletemodal && <DeleteModal type={"Message"} />}
      </>
    );
  }
  function Received({ message }) {
    var d = new Date(message.time);
    let time = d.toTimeString().split(" ")[0];
    let [h, m] = time.split(":");
    let hm = h + ":" + m;
    let name = "";
    for (let n of usernames) {
      if (n.id === message.sender) {
        name = n.name;
      }
    }
    return (
      <>
        <div className="received">
          <span className="name" style={{ color: color }}>
            {name}
          </span>
          <span className="msg">{message.message}</span>
          <span className="time">{hm}</span>
        </div>
        {showdeletemodal && <DeleteModal />}
      </>
    );
  }
  const ImgSent = ({ message }) => {
    var d = new Date(message.time);
    let time = d.toTimeString().split(" ")[0];
    let [h, m] = time.split(":");
    let hm = h + ":" + m;
    return (
      <>
        <div className="imgsent">
          <button className="dd">
            <MdDelete
              className="ddIcon"
              onClick={() => {
                setSelectedMessageId(message.id);
                setShowDeleteModal(true);
              }}
            />
          </button>
          <span className="img">
            <img
              src={message.imglink}
              style={{ objectFit: "cover" }}
              onClick={() => {
                setShowImgModal(true);
                setSelectedImgSrc(message.imglink);
              }}
              alt="img"
            />
          </span>
          <span className="time">{hm}</span>
        </div>
        {showdeletemodal && <DeleteModal type={"Image"} />}
        {showImgmodal && <ImgModal />}
      </>
    );
  };
  const ImgReceived = ({ message }) => {
    var d = new Date(message.time);
    let time = d.toTimeString().split(" ")[0];
    let [h, m,] = time.split(":");
    let hm = h + ":" + m;
    let name = "";
    for (let n of usernames) {
      if (n.id === message.sender) {
        name = n.name;
      }
    }
    return (
      <>
        <div className="imgreceived">
          <span className="name" style={{ color: color }}>
            {name}
          </span>
          <span className="img">
            <img
              src={message.imglink}
              alt="messageimg"
              onClick={() => {
                setShowImgModal(true);
                setSelectedImgSrc(message.imglink);
              }}
            />
          </span>
          <span className="time">{hm}</span>
        </div>
        {showdeletemodal && <DeleteModal />}
        {showImgmodal && <ImgModal />}
      </>
    );
  };
  return (
    <div className="messageSection">
      <div className="message">
        {messages.map((message) =>
          !message.type ? (
            message.message !== "" ? (
              message.sender === userID ? (
                <Sent message={message} />
              ) : (
                <Received message={message} />
              )
            ) : null
          ) : message.sender === userID ? (
            <ImgSent message={message} />
          ) : (
            <ImgReceived message={message} />
          )
        )}
        <div ref={messagesEndRef} style={{padding:10}}/>
      </div>
    </div>
  );
}

function SendBar({ sendMessage, userID }) {
  const [message, setMessage] = useState({
    sender: "",
    message: "",
    time: null,
  });
  function handleSubmit(e) {
    sendMessage({
      ...message,
      message: message.message,
      sender: userID,
      time: Date.now(),
    });
    setMessage({
      sender: "",
      message: "",
      time: null,
    });
    e.preventDefault();
  }
  const hiddenFileInput = useRef(null);
  const handleClick = () => {
    hiddenFileInput.current.click();
  };
  const handleChange = (event) => {
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = function (e) {
      sendMessage({
        ...message,
        type: "img",
        imglink: reader.result,
        sender: userID,
        time: Date.now(),
      });
    };
  };

  return (
    <div className="sendBar">
      <div className="botIcons">
        <CgSmileMouthOpen className="boticon" />
        <AiOutlinePaperClip className="boticon" onClick={handleClick} />
        <input
          type="file"
          ref={hiddenFileInput}
          onChange={handleChange}
          style={{ display: "none" }}
        />
      </div>
      <div className="form">
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
          autoComplete="off"
        >
          <input
            type="text"
            name="message"
            className="messageField"
            value={message.message}
            placeholder="Type a message"
            onChange={(e) =>
              setMessage({ ...message, message: e.target.value })
            }
          />
        </form>
      </div>
      <div className="micIcon">
        <MdMic />
      </div>
    </div>
  );
}
