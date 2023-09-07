import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  Dimensions,
  Animated,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Ionic from "react-native-vector-icons/Ionicons";

export default function Home({ navigation }) {
  const WIDTH = Dimensions.get("screen").width;
  const ITEM_WIDTH = WIDTH * 0.72;
  const MOVIE_SPACER_WIDTH = (WIDTH - ITEM_WIDTH) / 2;
  const scrollx = useRef(new Animated.Value(0)).current;

  const [moviesData, setMoviesData] = useState([]);

  //Potrebno da bi dodali stranu
  const [page, setPage] = useState(1);

  //Za loading ikonice iznad postera
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getMoviesDataFromDB(page);
  }, [page]);

  const getMoviesDataFromDB = async (page) => {
    setIsLoading(true);
    await axios
      .get(
        `https://api.themoviedb.org/3/movie/popular?api_key=7255e1d3d730e222bd33be1a53b9b70f&page=${page}`
      )
      .then((res) => setMoviesData([...moviesData, ...res.data.results]))
      .catch((err) => console.log(err));
    setIsLoading(false);
  };

  const handleOnEnd = () => {
    setIsLoading(true);
    setPage(page + 1);
  };
  return (
    <SafeAreaView
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#1c1c1c",
        padding: 0,
        position: "relative",
      }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1c1c1c" />
      <View
        style={{
          width: "100%",
          padding: 20,
          marginBottom: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                color: "#ff5722",
                fontSize: 30,
                fontWeight: "bold",
                marginRight: 10,
              }}
            >
              Hello
            </Text>
            <Text style={{ color: "#ffffff", fontSize: 30, fontWeight: "300" }}>
              User
            </Text>
          </View>
          <Text
            style={{
              color: "#ffffff",
              fontSize: 16,
              fontWeight: "300",
              opacity: 0.4,
            }}
          >
            Watch your favorite movies
          </Text>
        </View>
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 100,
            backgroundColor: "#ffffff30",
          }}
        >
          <Image
            source={require("../../assets/images/Profile.jpg")}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 100,
              borderWidth: 1,
              borderColor: "#ff5722",
            }}
          />
        </View>
      </View>
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "90%",
            paddingHorizontal: 20,
            height: 50,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#393e46",
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#ff5722",
          }}
        >
          <TextInput
            style={{ width: "70%", color: "#eeeeee" }}
            placeholder="Search"
            placeholderTextColor="#70717A"
          />
          <TouchableOpacity
            style={{
              width: "20%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              borderLeftWidth: 1,
              borderLeftColor: "#ff5722",
            }}
          >
            <Ionic
              name="search-outline"
              style={{
                fontSize: 18,
                color: "#ffffff",
                opacity: 0.4,
                paddingLeft: 20,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          padding: 20,
          marginBottom: 20,
          marginTop: 10,
        }}
      >
        <Text
          style={{
            color: "#ff5722",
            fontSize: 16,
            marginRight: 8,
            fontWeight: "bold",
          }}
        >
          Latest
        </Text>
        <Text
          style={{
            color: "#ffffff",
            fontSize: 16,
            marginRight: 8,
            fontWeight: "300",
          }}
        >
          Movies
        </Text>
      </View>

      {isLoading && (
        <View
          style={{
            position: "absolute",
            right: 10,
            top: "60%",
            height: 20,
            zIndex: 1,
          }}
        >
          <ActivityIndicator size="small" color="#ffffff" />
        </View>
      )}

      <FlatList
        data={moviesData}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollx } } }],
          { useNativeDriver: false }
        )}
        contentContainerStyle={{
          justifyContent: "center",
          position: "relative",
          paddingBottom: 70,
          zIndex: 1,
        }}
        snapToInterval={ITEM_WIDTH}
        snapToAlignment="start"
        decelerationRate={0.6}
        scrollEventThrottle={64}
        onEndReached={handleOnEnd}
        ListHeaderComponent={() => {
          return (
            <View style={{ width: MOVIE_SPACER_WIDTH, height: 300 }}></View>
          );
        }}
        ListFooterComponent={() => {
          return (
            <View style={{ width: MOVIE_SPACER_WIDTH, height: 300 }}></View>
          );
        }}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * ITEM_WIDTH,
            index * ITEM_WIDTH,
            (index + 1) * ITEM_WIDTH,
          ];

          const translateY = scrollx.interpolate({
            inputRange,
            outputRange: [50, 0, 50],
          });
          const opacity = scrollx.interpolate({
            inputRange,
            outputRange: [0, 1, 0],
          });
          const elevationX = scrollx.interpolate({
            inputRange,
            outputRange: [0, 28, 0],
          });

          return (
            <Animated.View
              style={{
                width: ITEM_WIDTH,
                position: "relative",
                paddingHorizontal: 24,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate("MovieDetails", { movieId: item.id })
                }
                style={{ backgroundColor: "transparent" }}
              >
                <Animated.View
                  style={{
                    marginHorizontal: 0,
                    height: 300,
                    elevation: elevationX,
                    borderRadius: 34,
                    shadowColor: "#ffffff80",
                    backgroundColor: "transparent",
                  }}
                >
                  <Image
                    source={{
                      uri: "https://image.tmdb.org/t/p/w500" + item.poster_path,
                    }}
                    style={{ height: "100%", width: "100%", borderRadius: 34 }}
                  />
                </Animated.View>
                <Animated.Text
                  style={{
                    color: "#ffffff",
                    marginTop: 20,
                    fontSize: 20,
                    letterSpacing: 2,
                    fontWeight: "bold",
                    textAlign: "center",
                    opacity: opacity,
                  }}
                >
                  {item.original_name
                    ? item.original_name
                    : item.original_title}
                </Animated.Text>
                <Animated.Text
                  style={{
                    color: "white",
                    marginTop: 10,
                    fontSize: 14,
                    letterSpacing: 2,
                    textAlign: "center",
                    fontWeight: "bold",
                    opacity: 0.2,
                  }}
                >
                  {item.release_date?.toString().slice(0, 4)}
                </Animated.Text>
              </TouchableOpacity>
            </Animated.View>
          );
        }}
      />
    </SafeAreaView>
  );
}
