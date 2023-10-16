import React, { useState, useEffect } from "react";
import {
  ImageBackground,
  Text,
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Alert,
} from "react-native";
import { Col, Grid } from "react-native-easy-grid";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { MovieListProps } from "../types/app";
import MovieList from "../components/movies/MovieList";
import AsyncStorage from "@react-native-async-storage/async-storage";

type TRenderMovieDetail = {
  movieDetail: any;
  heart: any;
};

const MovieDetail = ({ route }: any): JSX.Element => {
  const { id } = route.params;

  const [movieDetail, setMovieDetail] = useState("");
  const [heart, setHeart] = useState("heart-o");
  const [isFavorite, setIsFavorite] = useState(false);

  const ACCESS_TOKEN = process.env.EXPO_PUBLIC_API_ACCESS_TOKEN;
  const URL = process.env.EXPO_PUBLIC_API_URL;

  if (ACCESS_TOKEN == null || URL == null) {
    throw new Error("ENV not found");
  }

  useEffect(() => {
    getMovieDetail();
    checkIsFavorite(id);
  }, []);

  const getMovieDetail = (): void => {
    const url = `https://api.themoviedb.org/3/movie/${id}`;
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
        setMovieDetail(response);
      })
      .catch((errorResponse) => {
        console.log(errorResponse);
      });
  };

  const renderMovieDetail = ({ movieDetail, heart }: TRenderMovieDetail) => {
    return (
      <View>
        <ImageBackground
          resizeMode="cover"
          style={[
            {
              width: "auto",
              height: 160,
            },
          ]}
          source={{
            uri: `https://image.tmdb.org/t/p/w500${movieDetail.backdrop_path}`,
          }}
        >
          <LinearGradient
            colors={["#00000000", "rgba(0, 0, 0, 0.7)"]}
            locations={[0.6, 0.8]}
            style={styles.gradientStyle}
          >
            <Text style={styles.movieTitle}>{movieDetail.title}</Text>
            <View style={styles.ratingContainer}>
              <Grid>
                <Col style={styles.ratingContainer}>
                  <FontAwesome name="star" size={16} color="yellow" />
                  <Text style={styles.rating}>
                    {movieDetail.vote_average?.toFixed(1)}
                  </Text>
                </Col>
                <Col style={styles.favoriteContainer}>
                  <FontAwesome
                    style={styles.favoriteContainer}
                    name={heart}
                    size={24}
                    color="pink"
                    onPress={() => {
                      if (isFavorite) {
                        removeFavorite(id);
                        setHeart("heart-o");
                      } else {
                        addFavorite(id, movieDetail);
                        setHeart("heart");
                      }
                    }}
                  />
                </Col>
              </Grid>
            </View>
          </LinearGradient>
        </ImageBackground>
        <View style={styles.overview}>
          <Text>{movieDetail.overview}</Text>
        </View>
        <Grid>
          <Col style={styles.overview}>
            <Text style={{ fontWeight: "bold" }}>Original Language</Text>
            <Text>{movieDetail.original_language}</Text>
          </Col>
          <Col style={styles.overview}>
            <Text style={{ fontWeight: "bold" }}>Popularity</Text>
            <Text>{movieDetail.popularity}</Text>
          </Col>
        </Grid>
        <Grid>
          <Col style={styles.overview}>
            <Text style={{ fontWeight: "bold" }}>Release Date</Text>
            <Text>{movieDetail.release_date}</Text>
          </Col>
          <Col style={styles.overview}>
            <Text style={{ fontWeight: "bold" }}>Vote Count</Text>
            <Text>{movieDetail.vote_count}</Text>
          </Col>
        </Grid>
        <StatusBar translucent={false} />
      </View>
    );
  };

  // Favorites
  const addFavorite = async (
    id: number,
    movieDetail: TRenderMovieDetail
  ): Promise<void> => {
    try {
      const initialData: string | null = await AsyncStorage.getItem(
        `@FavoriteList_${id}`
      );

      let favMovieList: TRenderMovieDetail[] = [];

      if (initialData !== null) {
        favMovieList = [...JSON.parse(initialData), movieDetail];
      } else {
        favMovieList = [movieDetail];
      }

      await AsyncStorage.setItem(
        `@FavoriteList_${id}`,
        JSON.stringify(favMovieList)
      );

      showAlertFav(true);
      setIsFavorite(true);
    } catch (error) {
      console.log(error);
    }
  };

  const removeFavorite = async (id: number): Promise<void> => {
    try {
      await AsyncStorage.removeItem(`@FavoriteList_${id}`);
      showAlertFav(false);
      setIsFavorite(false);
      // Tulis code untuk menghapus film dari storage
    } catch (error) {
      console.log(error);
    }
  };

  const checkIsFavorite = async (id: number): Promise<void> => {
    // Menghasilkan nilai return "true" atau "false", tergantung pada apakah data sudah tersimpan dalam storage atau belum
    try {
      const initialData: string | null = await AsyncStorage.getItem(
        `@FavoriteList_${id}`
      );
      initialData === null ? setIsFavorite(false) : setIsFavorite(true);
      initialData === null ? setHeart("heart-o") : setHeart("heart");
    } catch (error) {
      console.log(error);
    }
  };

  const showAlertFav = (status: boolean) => {
    if (status) {
      Alert.alert("Info!", "Film Ini Menjadi Favorite", [
        {
          text: "Ok",
          style: "default",
        },
      ]);
    } else {
      Alert.alert("Info!", "Film Ini Tidak Menjadi Favorite", [
        {
          text: "Ok",
          style: "default",
        },
      ]);
    }
  };

  // Recommendations
  const movieLists: MovieListProps[] = [
    {
      title: "Recommendations",
      path: `movie/${id}/recommendations?language=en-US&page=1`,
      coverType: "poster",
    },
  ];

  return (
    <ScrollView>
      {renderMovieDetail({ movieDetail, heart })}
      <View style={styles.container}>
        {movieLists.map((movieList) => (
          <MovieList
            title={movieList.title}
            path={movieList.path}
            coverType={movieList.coverType}
            key={movieList.title}
          />
        ))}
        <StatusBar translucent={false} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "900",
  },
  movieTitle: {
    color: "white",
  },
  overview: {
    alignItems: "center",
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    justifyContent: "center",
  },
  container: {
    marginTop: StatusBar.currentHeight ?? 32,
    alignItems: "center",
    justifyContent: "center",
    rowGap: 16,
  },
  gradientStyle: {
    padding: 8,
    height: "100%",
    width: "100%",
    borderRadius: 8,
    display: "flex",
    justifyContent: "flex-end",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  favoriteContainer: {
    alignSelf: "flex-end",
    flexDirection: "column-reverse",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  rating: {
    color: "yellow",
    fontWeight: "700",
  },
});

export default MovieDetail;
