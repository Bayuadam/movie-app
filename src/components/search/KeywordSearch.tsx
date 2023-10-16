import React, { useState } from "react";
import { SearchBar } from "@rneui/themed";
import { View, FlatList, Text, ActivityIndicator } from "react-native";
import MovieItem from "../movies/MovieItem";

const coverImageSize = {
  backdrop: {
    width: 280,
    height: 160,
  },
  poster: {
    width: 100,
    height: 160,
  },
};

export default function KeywordSearch(): JSX.Element {
  const [keyword, setKeyword] = useState("");
  const [movie, setMovie] = useState([]);
  const [status, setStatus] = useState("");

  const ACCESS_TOKEN = process.env.EXPO_PUBLIC_API_ACCESS_TOKEN;
  const URL = process.env.EXPO_PUBLIC_API_URL;

  if (ACCESS_TOKEN == null || URL == null) {
    throw new Error("ENV not found");
  }

  const searchMovie = () => {
    setStatus("loading");
    const url = `https://api.themoviedb.org/3/search/movie?query=${keyword}&include_adult=false&language=en-US&page=1`;
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
        setStatus("success");
        setMovie(response.results);
      })
      .catch((errorResponse) => {
        setStatus("error");
        console.log(errorResponse);
      });
  };

  const renderComponent = ({ movie, status }: any) => {
    switch (status) {
      case "loading":
        return <ActivityIndicator size="large" />;
      case "success":
        return (
          <FlatList
            data={movie}
            renderItem={({ item }) => {
              return (
                <MovieItem
                  movie={item}
                  size={coverImageSize["poster"]}
                  coverType="poster"
                />
              );
            }}
            columnWrapperStyle={{
              justifyContent: "space-evenly",
              marginBottom: 10,
              borderRadius: 4,
              margin: 18,
            }}
            numColumns={3}
            keyExtractor={(item) => item.id.toString()}
          />
        );
      case "error":
        return <Text>Something went wrong. Please try again.</Text>;
      default:
        return;
    }
  };

  return (
    <View>
      <SearchBar
        containerStyle={{
          backgroundColor: "transparent",
          borderBlockColor: "transparent",
        }}
        placeholder="Input title movie here..."
        onChangeText={setKeyword}
        value={keyword}
        lightTheme={true}
        round={true}
        onClear={() => {
          setStatus("");
        }}
        onSubmitEditing={searchMovie}
      />
      {renderComponent({ movie, status })}
    </View>
  );
}
