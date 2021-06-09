import React, { useState, useEffect, useRef } from "react";
import {MdSearch, MdChat, MdMoreVert } from "react-icons/md";
import { RiDonutChartLine } from "react-icons/ri";
import ChatsList from "./ChatsList";
import Account from "./Account";
import { auth, db, firebase } from "../firebase";

export default function ContactsSection({ setGroup, list,selectedGrpId }) {
  const [show, setShow] = useState(false);
  const [modaltoggle, setModalToggle] = useState(false);
  const [newgrp, setNewGrp] = useState();
  const [user, setUser] = useState();
  const wref = useRef(null);
  const [ddtoggle, setddtoggle] = useState(false);
  useEffect(() => {
    db.collection("users")
      .doc(auth.currentUser.uid)
      .get()
      .then((doc) => {
        setUser({ id: doc.id, ...doc.data() });
      });
  }, []);
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
  useOutsideAlerter(wref, setddtoggle, ddtoggle);

  async function logout() {
    await auth.signOut();
  }
  function DropDown() {
    return (
      <div ref={wref} className="moredd">
        <span
          className="moreddItem"
          onClick={() => {
            setddtoggle(!ddtoggle);
            setModalToggle(true);
          }}
        >
          Create Group
        </span>
        <span className="moreddItem" onClick={logout}>
          Logout
        </span>
      </div>
    );
  }
  function handleSubmit(e) {
    e.preventDefault();
    setModalToggle(false);
    db.collection("groups")
      .add({
        name: newgrp,
        createdAt: Date.now(),
        desc: "",
        img: "https://wallpapercave.com/wp/wp2610904.jpg",
        users: [auth.currentUser.uid],
      })
      .then((docRef) => {
        db.collection("users")
          .doc(auth.currentUser.uid)
          .update({
            Groups: firebase.firestore.FieldValue.arrayUnion(docRef.id),
          });
        db.collection("groups")
          .doc(docRef.id)
          .collection("messages")
          .add({})
          .then((subdocRef) => {
            db.collection("groups")
              .doc(docRef.id)
              .collection("messages")
              .doc(subdocRef.id)
              .delete();
          });
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  }
  function Modal() {
    return (
      <div className="modalBack">
        <div className="newgrpmodal">
          <form autoComplete="off" onSubmit={(e) => handleSubmit(e)}>
            <div className="modalTitle">Enter Group Name: </div>
            <div className="modalForm">
              <input
                type="text"
                autoFocus="autoFocus"
                name="addemail"
                className="addemail"
                value={newgrp}
                onChange={(e) => setNewGrp(e.target.value)}
              />
            </div>
            <div className="modalbuttons">
              <div
                className="cancelbutton"
                onClick={() => {
                  setModalToggle(false);
                  setNewGrp("");
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
                CREATE
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
  return (
    <div className="left">
      {user && (
        <Account
          show={show}
          close={() => setShow(false)}
          user={user}
          setUser={setUser}
        />
      )}
      {ddtoggle && <DropDown />}
      {modaltoggle && <Modal />}
      <div className="header">
        <div className="top">
          {user && user.img !== "" ? (
            <img
              src={user.img}
              alt="dp"
              className="avatar"
              style={{ objectFit: "cover" }}
              onClick={() => {
                setShow(true);
              }}
            />
          ) : (
            <img
              src="https://picsum.photos/1000/1000"
              alt="dp"
              className="avatar"
              style={{ objectFit: "cover" }}
              onClick={() => {
                setShow(true);
              }}
            />
          )}
          <div className="options">
            <RiDonutChartLine className="icon" />
            <MdChat className="icon" />
            <MdMoreVert
              style={{ cursor: "Pointer" }}
              className="icon"
              onClick={() => {
                setddtoggle(true);
              }}
            />
          </div>
        </div>
        <div className="search">
          <div className="input-box">
            <MdSearch className="search-icon" />
            <input
              // onChange={(e) => filterData(e.target.value)}
              className="input"
              placeholder="Search or start new chat"
            />
          </div>
        </div>
      </div>
      <ChatsList setGroup={setGroup} list={list} selectedGrpId={selectedGrpId} />
    </div>
  );
}
