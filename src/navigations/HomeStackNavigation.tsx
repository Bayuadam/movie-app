import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/Home";
import MovieDetail from "../screens/MovieDetail";
const Stack = createNativeStackNavigator();

const HomeStackNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          title: "Movie",
        }}
        name="HomeStack"
        component={Home}
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

export default HomeStackNavigation;
