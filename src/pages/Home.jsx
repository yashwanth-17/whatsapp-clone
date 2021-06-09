import React, { useState, useEffect } from "react";
import ChatSection from "../components/ChatSection";
import ContactsSection from "../components/ContactsSection";
import InfoSection from "../components/InfoSection";
import { db, auth } from "../firebase";
import "../App2.css";

function App() {
  const [infoOpen, setinfoOpen] = useState(false);
  const [group, setGroup] = useState();
  const [groups, setGroups] = useState([]);
  useEffect(() => {
    db.collection("users")
      .doc(auth.currentUser.uid)
      .onSnapshot((snap) => {
        if (snap.data() != null) {
          const groupIds = snap.data().Groups;
          console.log(groupIds);
          var snaps = groupIds.map((groupId) => {
            let snap = db.collection("groups").doc(groupId).get();
            return snap;
          });
        }
        Promise.all(snaps).then((docs) => {
          setGroups(
            docs.map((doc) => {
              return {
                id: doc.id,
                ...doc.data(),
              };
            })
          );
        });
      });
  }, [group]);
  return (
    <div className="page">
      <div className="top2" />
      <div className="rest" />
      <div className="owncontainer">
        <ContactsSection setGroup={setGroup} list={groups} selectedGrpId={group?.id} />
        {group && (
          <ChatSection
            setinfoOpen={setinfoOpen}
            width={infoOpen ? "40%" : "70%"}
            group={group}
            setGroup={setGroup}
          />
        )}
        {group && infoOpen && (
          <InfoSection
            setinfoOpen={setinfoOpen}
            group={group}
            setGroup={setGroup}
          />
        )}
      </div>
    </div>
  );
}

export default App;
