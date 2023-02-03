const firebaseConfig = {
  apiKey: "AIzaSyAFM_2NBmgyXgjAgcPxjwKU143X83wNipc",
  authDomain: "study-system-65ab0.firebaseapp.com",
  projectId: "study-system-65ab0",
  storageBucket: "study-system-65ab0.appspot.com",
  messagingSenderId: "501644587484",
  appId: "1:501644587484:web:152d2fa6b4699616db5f19"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore;

export default db