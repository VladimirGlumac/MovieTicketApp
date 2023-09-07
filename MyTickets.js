import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionic from "react-native-vector-icons/Ionicons";

export default function MyTickets({ navigation }) {
  const [moviesData, setMoviesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsub = navigation.addListener("focus", () => {
      getTicketsDataFromStorage();
    });
  }, [navigation]);

  //save id of the ticket
  const getTicketsDataFromStorage = async () => {
    setIsLoading(true);
    let items = await AsyncStorage.getItem("tickets");
    items = JSON.parse(items);
    let movies = [];

    if (items) {
      for (let index = 0; index < items?.length; index++) {
        await axios
          .get(
            `https://api.themoviedb.org/3/movie/${items[index]}?api_key=7255e1d3d730e222bd33be1a53b9b70f`
          )
          .then((movie) => {
            movies.push(movie.data);
          })
          .catch((err) => console.log(err));
      }
      setMoviesData(movies);
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#1A1A23",
        paddingVertical: 20,
        position: "relative",
      }}
    >
      <FlatList
        data={moviesData}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingBottom: 70,
          justifyContent: "center",
          zIndex: 1,
          position: "relative",
          alignItems: "center",
        }}
        ListHeaderComponent={() => {
          return (
            <View
              style={{
                flexDirection: "row",
                marginBottom: 20,
                position: "relative",
              }}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 30,
                  fontWeight: "bold",
                  marginRight: 10,
                }}
              >
                My
              </Text>
              <Text
                style={{ color: "#ffffff", fontSize: 30, fontWeight: "300" }}
              >
                Tickets
              </Text>
            </View>
          );
        }}
        ListFooterComponent={() => {
          return (
            <>
              {isLoading && (
                <View
                  style={{
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 40,
                  }}
                >
                  <ActivityIndicator size="small" color="#ffffff20" />
                </View>
              )}
            </>
          );
        }}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("MovieDetails", { movieId: item.id })
              }
              activeOpacity={0.6}
              style={{
                backgroundColor: "transparent",
                width: "80%",
                aspectRatio: 3.5 / 2,
                marginVertical: 20,
                marginRight: 6,
              }}
            >
              <LinearGradient
                colors={["#23252f", "#13141B"]}
                style={{
                  width: "100%",
                  height: "100%",
                  paddin: 14,
                  elevation: 1,
                  shadowColor: "#ffffff",
                  position: "relative",
                  flexDirection: "row",
                  borderRadius: 30,
                }}
              >
                <Image
                  source={{
                    uri: "https://image.tmdb.org/t/p/w500" + item?.poster_path,
                  }}
                  style={{
                    height: "100%",
                    aspectRatio: 2 / 3,
                    backgroundColor: "gray",
                    borderRadius: 15,
                    marginRight: 20,
                  }}
                />
                <View style={{ flex: 1, justifyContent: "space-around" }}>
                  <Text
                    style={{
                      color: "#ffffff",
                      fontSize: 19,
                      maxHeight: 64,
                      overflow: "hidden",
                    }}
                  >
                    {item.original_title}
                  </Text>
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <Ionic
                        name="star"
                        style={{ color: "#F9AC28", marginRight: 6 }}
                      />
                      <Text style={{ color: "#F9AC28", fontSize: 12 }}>
                        {item?.vote_count?.toString()}
                      </Text>
                    </View>
                    <Text
                      style={{
                        color: "#ffffff",
                        opacity: 0.4,
                        fontSize: 12,
                        maxHeight: 20,
                        overflow: "hidden",
                      }}
                    >
                      {item.release_date}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: "#F9AC2B",
                      borderRadius: 100,
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      position: "absolute",
                      bottom: 26,
                      right: -34,
                    }}
                  >
                    <Text style={{ color: "#000000", fontWeight: "500" }}>
                      IMDb {item?.vote_average?.toString().slice(0, 3)}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}
