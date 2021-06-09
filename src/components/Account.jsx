import React, { useState, useRef } from "react";
import { MdClose, MdEdit } from "react-icons/md";
import { db } from "../firebase";
import { IoCamera } from "react-icons/io5";

export default function Account({ show, close,user,setUser }) {
  const [ddtoggle, setddtoggle] = useState(false);
  const [editname, setEditname] = useState(false);
  const [editbio, setEditbio] = useState(false);
  const hiddenFileInput = useRef(null);
  const [name, setName] = useState(user.name);
  const wref = useRef(null);
  const fref = useRef(null);
  const handleClick = () => {
    hiddenFileInput.current.click();
    setddtoggle(false);
  };
  const handleChange = (event) => {
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = function (e) {
      setUser((p)=>{
        let u={...p,img:reader.result}
        updateDb(u)
        return u
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
  function updateDb(user) {
    console.log(user)
    db.collection("users")
      .doc(user.id)
      .update({
        name:user.name,
        bio:user.bio,
        img:user.img
      })
  }
  function handleSubmit(e, changefield) {
    e.preventDefault();
    if (changefield === "name") {
      if (name === "") {
        setName(user.name);
        setEditname(false);
      } else {
        setUser({ ...user, name: name });
        updateDb({ ...user, name: name });
        setEditname(false);
      }
    } else {
      setEditbio(false);
      updateDb(user);
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
              name="editname"
              className="editgname"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </form>
        </div>
      );
    } else if (changefield === "bio") {
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
              name="editbio"
              className="editgdesc"
              value={user.bio}
              onChange={(e) => setUser({ ...user, bio: e.target.value })}
            />
          </form>
        </div>
      );
    }
  }

  return (
    <>
      {user && (
        <div className={`account ${show ? "shown" : ""}`}>
          <div className="header">
            <p className="fs-large ml-1 my-0">Account</p>
            <MdClose className="close-icon mr-1" onClick={close} />
          </div>
          <div className="infodp">
            {user.img !== "" ? (
              <img
                src={user.img}
                alt="dp"
                className="account-img"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <img
                src="https://picsum.photos/1000/1000"
                alt="dp"
                className="account-img"
                style={{ objectFit: "cover" }}
              />
            )}
            <div className="dphover" onClick={() => setddtoggle(true)}>
              <div>
                <IoCamera className="camicon" />
              </div>
              <div className="changedp">CHANGE DP</div>
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
          <div className="info">
            <div className="info-box">
              <span>Your Name</span>
              <div className="info-content">
                <p className="m-0">
                  {editname ? (
                    <Edit changefield={"name"} value={user.name} />
                  ) : (
                    user.name
                  )}
                </p>
                <span
                  className="editicon"
                  onClick={() => {
                    setEditname(!editname);
                  }}
                >
                  {!editname ? <MdEdit className="icon" /> : <></>}
                </span>
              </div>
            </div>
            <div className="info-box">
              <span>Your Bio</span>
              <div className="info-content">
                <p className="m-0">
                  {editbio ? (
                    <Edit changefield={"bio"} value={user.bio} />
                  ) : user.bio === "" ? (
                    "Write something about yourself."
                  ) : (
                    <div className="agdesc">{user.bio}</div>
                  )}
                </p>
                <span
                  className="editicon"
                  onClick={() => {
                    setEditbio(!editbio);
                  }}
                >
                  {!editbio ? <MdEdit className="icon" /> : <></>}
                </span>
              </div>
            </div>
            <div className="info-box">
              <span>Your Email</span>
              <div className="info-content">
                <p className="m-0">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
