import React, { useState, useEffect } from "react";
import { FlatList } from "react-native";
import MovieItem from "./MovieItem";
import { Movie } from "../../types/app";

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

export default function MovieCategory({ route }: any): JSX.Element {
  const [movie, setMovie] = useState<Movie[]>([]);
  const { id } = route.params;
  const { name } = route.params;

  const ACCESS_TOKEN = process.env.EXPO_PUBLIC_API_ACCESS_TOKEN;
  const URL = process.env.EXPO_PUBLIC_API_URL;

  if (ACCESS_TOKEN == null || URL == null) {
    throw new Error("ENV not found");
  }

  useEffect(() => {
    searchMovie();
  });

  // Movies
  const searchMovie = () => {
    const url = `https://api.themoviedb.org/3/discover/movie?with_genres=${id}`;
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
        setMovie(response.results);
      })
      .catch((errorResponse) => {
        console.log(errorResponse);
      });
  };

  return (
    // <View style={{ display: "flex" }}>
    //   <Text style={{ fontSize: 20, margin: 10, alignSelf: "center" }}>
    //     Result of {name} Genre
    //   </Text>
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
    // </View>
  );
}
