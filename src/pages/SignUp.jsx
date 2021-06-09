import { useState, useRef } from "react";
import { auth, db } from "../firebase";

export default function SignUp() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const cpasswordRef = useRef();
  const [error, setError] = useState(null);
  async function signUp() {
    const name = nameRef.current.value;
    if (name.trim() === "") setError("Name is a required field");
    else {
      const email = emailRef.current.value;
      const password = passwordRef.current.value;
      const cpassword = cpasswordRef.current.value;
      if (password === cpassword) {
        try {
          await auth
            .createUserWithEmailAndPassword(email, password)
            .then(({user}) => {
              console.log(user.uid)
              db.collection("users").doc(user.uid).set({name:name,email:email,Groups:[],img:"",bio:""})
                .then((docRef) => {
                  console.log("Document written with ID: ", docRef.id);
                })
                .catch((error) => {
                  console.error("Error adding document: ", error);
                });
            });
          await auth.currentUser.updateProfile({ displayName: name });
        } catch (e) {
          console.log(e);
          setError(e.message);
        }
      } else setError("passwords didn't match");
    }
  }
  return (
    <div
      style={{
        background: "#ddd",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ background: "teal", width: "100vw", height: "8em" }}></div>
      <div
        style={{
          background: "#eee",
          width: "50em",
          height: "30em",
          borderRadius: 10,
          boxShadow: "2px 2px 5px grey",
          marginTop: "-3em",
          overflow: "hidden",
          display: "flex",
        }}
      >
        <div style={{ background: "#1ebea6", width: "50%" }}>
          <img
            style={{ width: "100%" }}
            src="https://th.bing.com/th/id/Rc1610aaa87c61a8102270333758e7d8c?rik=GiHz7sNbhAPT1Q&riu=http%3a%2f%2fonlinestory.in%2fwp-content%2fuploads%2f2019%2f07%2fwhatsapp-logo.jpg&ehk=RQB7ex32h0dGXKqbgEqVniJcsAVQPvEtWFj7gmqb5Qo%3d&risl=&pid=ImgRaw"
            alt="."
          />
          <h4
            style={{
              fontWeight: "normal",
              textAlign: "center",
              marginTop: "-1.5em",
              color: "#fff",
            }}
          >
            Create new account
          </h4>
        </div>
        <div className="my-5 mx-5" style={{ width: "50%" }}>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="mb-3">
            <input
              ref={nameRef}
              className="form-control"
              placeholder="Enter your name"
            />
            {/* <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
          </div> */}
          </div>
          <div className="mb-3">
            <input
              ref={emailRef}
              type="email"
              className="form-control"
              placeholder="Enter email address"
            />
            {/* <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
          </div> */}
          </div>
          <div className="mb-3">
            <input
              ref={passwordRef}
              type="password"
              className="form-control"
              placeholder="Enter password"
            />
            {/* <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
          </div> */}
          </div>
          <div className="mb-3">
            <input
              ref={cpasswordRef}
              type="password"
              className="form-control"
              placeholder="Confirm password"
            />
            {/* <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
          </div> */}
          </div>
          <div className="d-flex justify-content-center">
            <button className="btn btn-success text-center" onClick={signUp}>
              Signup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
