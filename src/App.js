import "./App.css";
import "./App2.css";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "./firebase";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLoading(false);
      setLoggedIn(user !== null);
    });
    return unsubscribe;
  }, []);

  return (
    <BrowserRouter>
      <Switch>
        {loggedIn && <Route exact path="/" component={Home} />}
        {!loggedIn && <Route exact path="/login" component={Login} />}
        {!loggedIn && <Route exact path="/signup" component={SignUp} />}
        {!loggedIn && (
          <Route exact path="/loading" component={() => <p>loading...</p>} />
        )}
        <Redirect exact to={loading ? "/loading" : loggedIn ? "/" : "login"} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
