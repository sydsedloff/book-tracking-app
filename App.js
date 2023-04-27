import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useState, useCallback, useEffect, useLayoutEffect } from "react";
import { FlatList, Image, Text, TextInput } from "react-native";
import { Button, ButtonGroup } from "@rneui/base";
import {
  NavigationContainer,
  useFocusEffect,
  useRoute,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

let favoriteBooks = [
  {
    title: "Babel",
    author: "R.F. Kuang",
    genre: "Fantasy",
    notes: "",
  },
  {
    title: "The Way of Kings",
    author: "Brandon Sanderson",
    genre: "Fantasy",
    notes: "",
  },
  {
    title: "A Little Life",
    author: "Hanya Yanigahara",
    genre: "Fiction",
    notes: "",
  },
  {
    title: "Wisdom of Crowds",
    author: "Joe Abercrombie",
    genre: "Fantasy",
    notes: "",
  },
];

const excitedToReadBooks = [
  {
    title: "Empire of Silence",
    author: "Christopher Ruocchio",
    genre: "Sci-fi",
    notes: "",
  },
  {
    title: "Jade City",
    author: "Fonda Lee",
    genre: "Fantasy",
    notes: "",
  },
  {
    title: "Yellowface",
    author: "R.F Kuang",
    genre: "Fiction",
    notes: "",
  },
];

const worstBooks = [
  {
    title: "Emma",
    author: "Jane Austen",
    genre: "Classics",
    notes: "",
  },
  {
    title: "Fight or Flight",
    author: "Samantha Young",
    genre: "Romance",
    notes: "",
  },
  {
    title: "Hounded",
    author: "Kevin Hearne",
    genre: "Fantasy",
    notes: "",
  },
];

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CollectionsScreen">
        <Stack.Screen name="CollectionsScreen" component={CollectionsScreen} />
        <Stack.Screen name="BooksScreen" component={BooksScreen} />
        <Stack.Screen name="BookInfoScreen" component={BookInfoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const collections = [
  {
    title: "Favorite Books",
    data: favoriteBooks,
  },
  {
    title: "Excited to Read",
    data: excitedToReadBooks,
  },
  {
    title: "Worst Books",
    data: worstBooks,
  },
];

//show all collections
function CollectionsScreen({ navigation }) {
  const [collectionsArray, setNewCollectionsArray] = useState(collections);
  const [newCollectionName, setNewCollectionName] = useState("");

  const handlePress = (collection) => {
    navigation.navigate("BooksScreen", { collection });
  };

  const addNewCollection = useCallback(() => {
    if (newCollectionName) {
      const newCollection = {
        title: newCollectionName,
        data: [],
      };
      collections.push(newCollection); // Add the new collection to the collections array
      setNewCollectionsArray([...collections]); // Update the state variable with the new array
      setNewCollectionName("");
    }
  }, [newCollectionName]);

  return (
    <View style={[styles.container]}>
      <FlatList
        data={collections}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handlePress({ title: item.title, data: item.data })}
          >
            <View>
              <Text style={[styles.bookLists]}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <View style={[styles.horizontal]}>
        <TextInput
          style={[styles.input]}
          value={newCollectionName}
          onChangeText={setNewCollectionName}
        />
        <Button style={[styles.button]} onPress={addNewCollection}>
          Add New Collection
        </Button>
      </View>
    </View>
  );
}

//books in each collection
function BooksScreen({ navigation, route, newBook }) {
  const collection = route.params.collection;
  const [books, setVisibleBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [notes, setNotes] = useState("");

  useFocusEffect(
    useCallback(() => {
      // show books based on collection
      switch (collection.title) {
        case "Favorite Books":
          setVisibleBooks(favoriteBooks);
          break;
        case "Excited to Read":
          setVisibleBooks(excitedToReadBooks);
          break;
        case "Worst Books":
          setVisibleBooks(worstBooks);
          break;
        default:
          setVisibleBooks([]);
          break;
      }
    }, [collection, newBook])
  );

  function createBook(title, author, genre, notes) {
    const newBook = { title, author, genre, notes };
    switch (collection.title) {
      case "Favorite Books":
        favoriteBooks.push(newBook);
        setVisibleBooks([...favoriteBooks]);
        break;
      case "Excited to Read":
        excitedToReadBooks.push(newBook);
        setVisibleBooks([...excitedToReadBooks]);
        break;
      case "Worst Books":
        worstBooks.push(newBook);
        setVisibleBooks([...worstBooks]);
        break;
      default:
        setVisibleBooks([]);
        break;
    }
  }

  function handlePress(book) {
    navigation.navigate("BookInfoScreen", { book });
  }
  return (
    <View style={[styles.container]}>
      <FlatList
        data={books}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item)}>
            <View>
              <Text style={[styles.bookLists]}>
                {item.title} by {item.author}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <View style={[styles.container]}>
        <View style={[styles.horizontal]}>
          <Text>Title:</Text>
          <TextInput
            style={[styles.input]}
            placeholder="Title"
            onChangeText={setTitle}
          ></TextInput>
        </View>
        <View style={[styles.horizontal]}>
          <Text>Author:</Text>
          <TextInput
            style={[styles.input]}
            placeholder="Author"
            onChangeText={setAuthor}
          ></TextInput>
        </View>
        <View style={[styles.horizontal]}>
          <Text>Genre:</Text>
          <TextInput
            style={[styles.input]}
            placeholder="Genre"
            onChangeText={setGenre}
          ></TextInput>
        </View>
        <View style={[styles.horizontal]}>
          <Text>Other notes:</Text>
          <TextInput
            style={[styles.input]}
            placeholder="Personal notes about the book"
            onChangeText={setNotes}
          ></TextInput>
        </View>
      </View>
      <Button
        style={[styles.button]}
        title="Create Book"
        onPress={() => createBook(title, author, genre, notes)}
      >
        Create Book
      </Button>
    </View>
  );
}

function BookInfoScreen({ navigation, route }) {
  const book = route.params.book;
  const collection = route.params.collection;
  const [updatedBooks, setUpdatedBooks] = useState([]);
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [genre, setGenre] = useState(book.genre);
  const [notes, setNotes] = useState(book.notes);
  const [collectionsArray, setNewCollectionsArray] = useState(collections);

  function saveChanges(title, author, genre, notes) {
    const newBook = { title, author, genre, notes };
    const updatedBooksCopy = [...updatedBooks];
    const bookIndex = updatedBooksCopy.findIndex(
      (b) => b.title === book.title && b.author === book.author
    );
    if (bookIndex >= 0) {
      updatedBooksCopy[bookIndex].push(newBook);
    } else {
      updatedBooksCopy.push(newBook);
    }
    setUpdatedBooks(updatedBooksCopy);
    console.log("saved");
    console.log(updatedBooksCopy);
    console.log(newBook);

    navigation.goBack(newBook);
  }

  return (
    <View style={[styles.container]}>
      {/* insert text with title of the book here */}
      <Text>Info for {book.title}</Text>
      <View>
        <View style={[styles.horizontal]}>
          <Text>Title:</Text>
          <TextInput
            style={[styles.input]}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          ></TextInput>
        </View>
        <View style={[styles.horizontal]}>
          <Text>Author:</Text>
          <TextInput
            style={[styles.input]}
            placeholder="Author"
            value={author}
            onChangeText={setAuthor}
          ></TextInput>
        </View>
        <View style={[styles.horizontal]}>
          <Text>Genre:</Text>
          <TextInput
            style={[styles.input]}
            placeholder="Genre"
            value={genre}
            onChangeText={setGenre}
          ></TextInput>
        </View>
        <View>
          <Text>Other notes:</Text>
          <TextInput
            style={[styles.input]}
            placeholder="Personal notes about the book"
            value={notes}
            onChangeText={setNotes}
          ></TextInput>
        </View>
      </View>
      <Button
        style={[styles.button]}
        title="Save Changes"
        onPress={() => saveChanges(title, author, genre, notes)}
      >
        Save Changes
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D1D5DE",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 10,
    lineHeight: 50,
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    textAlign: "center",
    padding: 10,
    fontSize: 50,
  },
  button: {
    alignItems: "center",
    backgroundColor: "837569",
    padding: 10,
    fontSize: 30,
  },
  input: {
    borderColor: "#837569",
    borderWidth: 1,
    width: 300,
  },
  bookLists: {
    fontSize: 40,
    borderWidth: 1,
    borderColor: "#837569",
    marginTop: 15,
    backgroundColor: "#B7B6C2",
  },
});
