import React, { useState, useEffect } from "react";
import { FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MovieItem from "../components/movies/MovieItem";
import { Movie } from "../types/app";

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

export default function Favorite({ navigation }: any): JSX.Element {
  const [favorite, setFavorite] = useState<Movie[]>([]);

  useEffect(() => {
    const refresh = navigation.addListener("focus", () => {
      getFavorite();
    });

    return () => {
      refresh;
    };
  }, [navigation]);

  // Favorites
  const getFavorite = async () => {
    try {
      let keys: any = [];
      keys = await AsyncStorage.getAllKeys();
      const arrFav: any = [];
      keys.map(async (key: any) => {
        const initialData: any | null = await AsyncStorage.getItem(key);
        arrFav.push(JSON.parse(initialData)[0]);
      });
      setFavorite(arrFav);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <FlatList
      data={favorite}
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
}
