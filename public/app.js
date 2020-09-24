const auth = firebase.auth();

const whenSignedIn = document.getElementById("whenSignedIn");
const whenSignedOut = document.getElementById("whenSignedOut");

const signInBtn = document.getElementById("signInBtn");
const signOutBtn = document.getElementById("signOutBtn");

const userDetails = document.getElementById("userDetails");

// the authentication provider
const provider = new firebase.auth.GoogleAuthProvider();

signInBtn.onclick = () => auth.signInWithPopup(provider);
signOutBtn.onclick = () => auth.signOut();

auth.onAuthStateChanged((user) => {
  if (user) {
    // console.log(user);
    whenSignedIn.hidden = false;
    whenSignedOut.hidden = true;
    userDetails.innerHTML = `<h3>Hello: ${user.displayName}!</h3> <p>User ID: ${user.uid}</p>`;
  } else {
    whenSignedIn.hidden = true;
    whenSignedOut.hidden = false;
    userDetails.innerHTML = "";
  }
});

// Configuring firestore

const db = firebase.firestore();
const createThing = document.getElementById("createThing");
const thingsList = document.getElementById("things-list");
const message = document.getElementById("message");

let thingsRef;
let unsubscribe;

auth.onAuthStateChanged((user) => {
  if (user) {
    // database reference
    thingsRef = db.collection("things");
    createThing.onclick = () => {
      console.log("clicked");
      const { serverTimestamp } = firebase.firestore.FieldValue;
      thingsRef.add({
        uid: user.uid,
        name: faker.commerce.productName(),
        createdAt: serverTimestamp(),
      });
    };

    // Query
    unsubscribe = thingsRef
      .where("uid", "==", user.uid)
    //   .orderby("createdAt")
      .onSnapshot((querySnapshot) => {
        // map results to an array of li elements
        const items = querySnapshot.docs.map((doc) => {
          return `<li>${doc.data().name}</li>`;
        });
        thingsList.innerHTML = items.join("");
      });
  } else {
    unsubscribe && unsubscribe();
    createThing.onclick = () => {
      console.log("clicked");
      message.innerHTML = "you are not logged in";

      setTimeout(() => {
        message.innerHTML = "";
      }, 1000);
    };
  }
});
