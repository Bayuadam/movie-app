import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MovieDetail from "../screens/MovieDetail";
import MovieCategory from "../components/movies/MovieCategory";
import Search from "../screens/Search";
const Stack = createNativeStackNavigator();

const SearchStackNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="FavStack">
      <Stack.Screen
        options={{
          title: "",
          headerShown: false,
        }}
        name="SearchStack"
        component={Search}
      />
      <Stack.Screen
        options={{
          title: "Movie Category",
        }}
        name="MovieCategory"
        component={MovieCategory}
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

export default SearchStackNavigation;
