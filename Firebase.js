import { initializeApp } from "firebase/app";
import { addDoc, collection, getDocs, doc, deleteDoc, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDnFjvfdOTmU_rakzC_3xnhCEEZjVn8Zb8",
  authDomain: "quotesapp-5e668.firebaseapp.com",
  projectId: "quotesapp-5e668",
  storageBucket: "quotesapp-5e668.appspot.com",
  messagingSenderId: "380954066857",
  appId: "1:380954066857:web:b4efda8efc129926f5ceb8",
};

export default class Firebase {
  static db;
  static init() {
    const app = initializeApp(firebaseConfig);
    Firebase.db = getFirestore(app);
  }

  static async getQuotes() {
    let quotes = [];
    const querySnapshot = await getDocs(collection(Firebase.db, "quotes"));
    querySnapshot.forEach((quote) => {
      quotes.push({
        id: quote.id,
        text: quote.data().text,
        author: quote.data().author,
      });
    });
    return quotes;
  }

  static async saveQuote(text, author) {
    const docRef = await addDoc(collection(Firebase.db, "quotes"), { text, author });
    return docRef.id;
  }

  static removeQuote(id) {
    deleteDoc(doc(Firebase.db, "quotes", id));
  }
}
