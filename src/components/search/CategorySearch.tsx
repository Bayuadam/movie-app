import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Button } from "@rneui/themed";
import { StackActions, useNavigation } from "@react-navigation/native";

export default function CategorySearch(): JSX.Element {
  const [genre, setGenre] = useState("");
  const [selectedGenre, setselectedGenre] = useState<string>();
  const [selectedGenreName, setSelectedGenreName] = useState<string>();

  useEffect(() => {
    getGenre();
  });

  const getGenre = async () => {
    const url = `https://api.themoviedb.org/3/genre/movie/list?language=en`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    };

    fetch(url, options)
      .then(async (response) => await response.json())
      .then((response) => {
        setGenre(response.genres);
      })
      .catch((errorResponse) => {
        console.log(errorResponse);
      });
  };

  const ACCESS_TOKEN = process.env.EXPO_PUBLIC_API_ACCESS_TOKEN;
  const URL = process.env.EXPO_PUBLIC_API_URL;

  if (ACCESS_TOKEN == null || URL == null) {
    throw new Error("ENV not found");
  }
  const navigation = useNavigation<any>();
  const pushAction = StackActions.push("MovieCategory", {
    id: selectedGenre,
    name: selectedGenreName,
  });

  // Alert
  const alert = () => {
    Alert.alert("Info!", "Silahkan Pilih Kategori Terlebih Dahulu", [
      {
        text: "Ok",
        style: "default",
      },
    ]);
  };

  return (
    <View>
      <FlatList
        style={{ marginBottom: 10 }}
        data={genre}
        renderItem={({ item }: any) => {
          return (
            <View style={styles.topBarContainer}>
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.9}
                style={{
                  ...styles.topBar,
                  backgroundColor:
                    item.id === selectedGenre ? "#007bff" : "#00a6ff",
                  borderTopLeftRadius: 10,
                  borderBottomLeftRadius: 10,
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                }}
                onPress={() => {
                  setselectedGenre(item.id);
                  setSelectedGenreName(item.name);
                }}
              >
                <Text style={styles.topBarLabel}>{item.name}</Text>
              </TouchableOpacity>
            </View>
          );
        }}
        columnWrapperStyle={{
          justifyContent: "space-between",
          borderRadius: 4,
        }}
        numColumns={2}
        keyExtractor={(item: any) => item.id.toString()}
      />
      <Button
        // type="outline"
        title="Search"
        color="primary"
        radius={20}
        icon={{
          name: "search",
          size: 15,
          color: "white",
        }}
        onPress={() => {
          selectedGenre !== undefined
            ? navigation.dispatch(pushAction)
            : alert();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  topBarContainer: {
    marginTop: 10,
    width: "48%",
  },
  topBar: {
    alignItems: "center",
    justifyContent: "center",
    height: 45,
  },
  topBarLabel: {
    color: "white",
    fontSize: 15,
    fontWeight: "400",
    textTransform: "capitalize",
  },
});
