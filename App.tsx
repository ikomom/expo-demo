import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet } from "react-native";
import { RecoilTodoList } from "@Views/RecoilTest";

import { LogBox } from "react-native";
import { Provider } from "@ant-design/react-native";

// @ts-ignore
if (process.env.NODE_ENV === "development") {
  LogBox.ignoreLogs([
    "Duplicate atom key",
    "Remote debugger is in a background",
  ]);
}

const App = () => {
  console.log("App render");
  return (
    <SafeAreaView style={styles.container}>
      <RecoilTodoList />
      <StatusBar style="auto" backgroundColor={"#fff"} translucent={false} />
    </SafeAreaView>
  );
};

export default () => {
  return (
    <Provider>
      <App />
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
  },
  btnWrap: {
    flexDirection: "row",
    borderWidth: 1,
    width: "100%",
    justifyContent: "center",
  },
});
