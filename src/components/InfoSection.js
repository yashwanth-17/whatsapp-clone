import React, { useState, useEffect, useRef } from "react";
import { IoMdClose, IoMdThumbsDown } from "react-icons/io";
import { IoExitOutline, IoCamera } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { db, firebase, auth } from "../firebase";

export default function InfoSection({ setinfoOpen, group, setGroup }) {
  const userID = auth.currentUser.uid;
  const [ddtoggle, setddtoggle] = useState(false);
  const [editgname, setEditgname] = useState(false);
  const [editgdesc, setEditgdesc] = useState(false);
  const [showexitmodal, setShowExitModal] = useState(false);
  const wref = useRef(null);
  const fref = useRef(null);
  const [gname, setGname] = useState();
  useEffect(() => {
    updateDb(group);
    setGroup(group);
    setGname(group.name);
  }, [group]);
  function useOutsideAlerter(ref) {
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
  useOutsideAlerter(wref);
  const hiddenFileInput = useRef(null);
  const handleClick = () => {
    hiddenFileInput.current.click();
    setddtoggle(false);
  };
  const handleChange = (event) => {
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = function (e) {
      setGroup({
        ...group,
        img: reader.result,
      });
    };
  };
  function DropDown() {
    return (
      <div ref={wref} className="dpdd">
        <span className="dpddItem" onClick={handleClick}>
          Upload Photo
        </span>
      </div>
    );
  }
  function updateDb(group) {
    db.collection("groups")
      .doc(group.id)
      .set(group)
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  }
  function handleSubmit(e, changefield) {
    e.preventDefault();
    if (changefield === "name") {
      if (gname === "") {
        setGname(group.name);
        setEditgname(false);
      } else {
        setGroup({ ...group, name: gname });
        updateDb({ ...group, name: gname });
        setEditgname(false);
      }
    } else {
      setEditgdesc(false);
      updateDb(group);
    }
  }
  function Edit({ value, changefield }) {
    if (changefield === "name") {
      return (
        <div className="editform">
          <form
            ref={fref}
            autoComplete="off"
            onSubmit={(e) => handleSubmit(e, changefield)}
          >
            <input
              type="text"
              maxLength="15"
              autoFocus="autoFocus"
              spellCheck="false"
              name="editgname"
              className="editgname"
              value={gname}
              onChange={(e) => setGname(e.target.value)}
            />
          </form>
        </div>
      );
    } else if (changefield === "desc") {
      return (
        <div className="editform">
          <form
            autoComplete="off"
            onSubmit={(e) => handleSubmit(e, changefield)}
          >
            <input
              type="text"
              autoFocus="autoFocus"
              spellCheck="false"
              name="editgdesc"
              className="editgdesc"
              value={value}
              onChange={(e) => setGroup({ ...group, desc: e.target.value })}
            />
          </form>
        </div>
      );
    }
  }
  function exitgrp() {
    db.collection("groups")
      .doc(group.id)
      .update({
        users: firebase.firestore.FieldValue.arrayRemove(userID),
      });
    db.collection("users")
      .doc(userID)
      .update({
        Groups: firebase.firestore.FieldValue.arrayRemove(group.id),
      });
  }
  function ExitModal() {
    return (
      <div className="modalBack">
        <div className="ownmodal">
          <div className="modalTitle">Exit Group?</div>
          <div className="modalbuttons">
            <div
              className="cancelbutton"
              onClick={() => {
                setShowExitModal(false);
              }}
            >
              CANCEL
            </div>
            <div
              className="deletebutton"
              onClick={() => {
                setShowExitModal(false);
                exitgrp();
                setGroup();
              }}
            >
              EXIT
            </div>
          </div>
        </div>
      </div>
    );
  }
  function GetCreatedAt({ cgroup }) {
    var d = new Date(cgroup.createdAt);
    let time = d.toTimeString().split(" ")[0];
    let [h, m,] = time.split(":");
    var hm = h + ":" + m;
    console.log(cgroup.createdAt);
    var dt = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
    console.log(dt);
    return (
      <>
        Created on {dt} at {hm}
      </>
    );
  }
  return (
    <>
      <div className="info">
        <div className="infoTop">
          <span className="closeIcon">
            <IoMdClose onClick={() => setinfoOpen(false)} />
          </span>
          <span className="grpinfo">Group Info</span>
        </div>
        <div className="infoRest">
          <div className="infodetails">
            <div className="infodp">
              {group.img !== "" ? (
                <img src={group.img} alt="dp" style={{ objectFit: "cover" }} />
              ) : (
                <img
                  src="https://lh3.googleusercontent.com/ABlX4ekWIQimPjZ1HlsMLYXibPo2xiWnZ2iny1clXQm2IQTcU2RG0-4S1srWsBQmGAo=s300"
                  alt="dp"
                  style={{ objectFit: "cover" }}
                />
              )}
              <div className="dphover" onClick={() => setddtoggle(true)}>
                <div>
                  <IoCamera className="camicon" />
                </div>
                <div className="changedp">CHANGE GROUP</div>
                <div className="changedp">ICON</div>
              </div>
            </div>
            <input
              type="file"
              ref={hiddenFileInput}
              onChange={(e) => {
                handleChange(e);
              }}
              style={{ display: "none" }}
            />
            {ddtoggle && <DropDown />}
            <div className="infomain">
              <div className="infogname">
                <span className="infoname">
                  {editgname ? (
                    <Edit changefield={"name"} value={group.name} />
                  ) : (
                    group.name
                  )}
                </span>
                <span className="infodate">
                  {group && <GetCreatedAt cgroup={group} />}
                </span>
              </div>
              <span
                className="editicon"
                onClick={() => {
                  setEditgname(!editgname);
                }}
              >
                {!editgname ? <MdEdit /> : <></>}
              </span>
            </div>
          </div>
          <div className="infoDesc">
            <div className="infoadesc">
              <span className="desc">Description</span>
              <span className="gdesc">
                {editgdesc ? (
                  <Edit changefield={"desc"} value={group.desc} />
                ) : group.desc === "" ? (
                  "Add group description"
                ) : (
                  <div className="agdesc">{group.desc}</div>
                )}
              </span>
            </div>
            <span
              className="editicon"
              onClick={() => {
                setEditgdesc(!editgdesc);
              }}
            >
              {!editgdesc ? <MdEdit /> : <></>}
            </span>
          </div>
          <div className="infoFooter">
            <div className="exitbutton">
              <span className="exiticon">
                <IoExitOutline />
              </span>
              <span
                className="exit"
                onClick={() => {
                  setShowExitModal(true);
                }}
              >
                Exit group
              </span>
            </div>
            <div className="reportbutton">
              <span className="reporticon">
                <IoMdThumbsDown />
              </span>
              <span className="report"> Report group</span>
            </div>
          </div>
        </div>
      </div>
      {showexitmodal && <ExitModal />}
    </>
  );
}
