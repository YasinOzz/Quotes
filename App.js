// 1) import-Anweisung
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import BigButton from "./components/BigButton";
import IconButton from "./components/IconButton";
import Quote from "./components/Quote";
import NewQuote from "./components/NewQuote";
import Firebase from "./Firebase";

// 2) unsere UI-Komponente deklarieren (UI = user interface)
export default function App() {
  const [index, setIndex] = useState(0);
  const [quotes, setQuotes] = useState([]);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    Firebase.init();
    loadQuotes();
  }, []);

  function addQuoteToList(text, author) {
    setShowNewDialog(false);
    const newQuotes = [...quotes, { text, author }];
    setQuotes(newQuotes);
    setIndex(newQuotes.length - 1);
    saveQuotes(text, author, newQuotes);
  }

  function removeQuoteFromList() {
    const newQuotes = [...quotes];
    const id = quotes[index].id;
    newQuotes.splice(index, 1);
    setIndex(0);
    setQuotes(newQuotes);
    Firebase.removeQuote(id);
  }

  function deleteQuote() {
    Alert.alert("Zitat Löschen", "Soll das Zitat wirklich gelöscht werdem?", [
      { text: "Abbrechen", style: "cancel" },
      { text: "Bestätigen", style: "destructive", onPress: removeQuoteFromList },
    ]);
  }

  async function saveQuotes(text, author, newQuotes) {
    const id = await Firebase.saveQuote(text, author);
    newQuotes[newQuotes.length - 1].id = result.insertId;
    setQuotes(newQuotes);
  }

  async function loadQuotes() {
    const quotesFromDB = await Firebase.getQuotes();
    setQuotes(quotesFromDB);
    setLoading(false);
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="darkslateblue" />
      </View>
    );
  }

  let content = <Text style={styles.noQuotes}>Keine Zitate</Text>;
  if (quotes.length > 0) {
    const quote = quotes[index];
    content = <Quote text={quote.text} author={quote.author}></Quote>;
  }

  return (
    <View style={styles.container}>
      {quotes.length === 0 ? null : <IconButton onPress={() => deleteQuote()} icon="delete" style={styles.delete} />}
      <IconButton onPress={() => setShowNewDialog(true)} icon="add-circle" style={styles.new} />
      <NewQuote visible={showNewDialog} onCancel={() => setShowNewDialog(false)} onSave={addQuoteToList}></NewQuote>
      {content}
      {quotes.length < 2 ? null : (
        <BigButton style={styles.next} title="Nächstes Zitat" onPress={() => setIndex((index + 1) % quotes.length)} />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

// 3) benötigte Styles definieren = Aussehen und Layout
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // CSS: background-color, in REACT camelcase
    alignItems: "center",
    justifyContent: "center",
  },
  next: {
    position: "absolute",
    bottom: 60,
  },
  new: {
    position: "absolute",
    top: 60,
    right: 30,
  },
  delete: {
    position: "absolute",
    top: 60,
    left: 30,
  },
  noQuotes: {
    fontSize: 36,
    fontWeight: "bold",
  },
});
