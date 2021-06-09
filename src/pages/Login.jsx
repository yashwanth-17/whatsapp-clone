import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { auth} from "../firebase";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState(null);
  async function login() {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (e) {
      console.log(e);
      setError(e.message);
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
          width: "30em",
          borderRadius: 10,
          boxShadow: "2px 2px 5px grey",
          marginTop: "-3em",
          overflow: "hidden",
        }}
      >
        <div style={{ background: "#1ebea6" }}>
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
            Login to your account
          </h4>
        </div>
        <div className="my-4 mx-5">
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="mb-3">
            <input
              ref={emailRef}
              type="email"
              className="form-control"
              placeholder="Enter email address"
            />
            {/* <div id="emailHelp" class="form-text">
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
            {/* <div id="emailHelp" class="form-text">
            We'll never share your email with anyone else.
        </div> */}
          </div>
          <div className="d-flex justify-content-center">
            <button className="btn btn-success" onClick={login}>
              Login
            </button>
          </div>
          <div className="my-2">
            <Link to="/signup">
              <small>create new account</small>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
