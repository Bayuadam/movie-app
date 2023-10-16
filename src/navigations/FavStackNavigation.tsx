import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MovieDetail from "../screens/MovieDetail";
import Favorite from "../screens/Favorite";
const Stack = createNativeStackNavigator();

const FavStackNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="FavStack">
      <Stack.Screen
        options={{
          title: "Favorite",
        }}
        name="FavoriteStack"
        component={Favorite}
      />
      <Stack.Screen
        options={{
          title: "Movie Detail",
        }}
        name="MovieDetail"
        component={MovieDetail}
      />
    </Stack.Navigator>
  );
};

export default FavStackNavigation;
