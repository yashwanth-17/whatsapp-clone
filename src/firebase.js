import firebase from "firebase";
const firebaseConfig = {
  apiKey: "AIzaSyAmNVCVh0sUDPC-Gq56q4jeS996TdSmjj0",
  authDomain: "whatsapp-clone-dcfc3.firebaseapp.com",
  databaseURL:
    "https://whatsapp-clone-dcfc3-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "whatsapp-clone-dcfc3",
  storageBucket: "whatsapp-clone-dcfc3.appspot.com",
  messagingSenderId: "590792210418",
  appId: "1:590792210418:web:7210fca42c5c904d049d6b",
  measurementId: "G-EYGEME7K2S",
};
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();
var auth = firebase.auth();

export {firebase,auth,db};
