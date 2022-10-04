import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet } from "react-native";
import { RecoilTodoList } from "@/RecoilTest";
import { RecoilRoot } from "recoil";

import { LogBox } from "react-native";

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
      <StatusBar style="auto" translucent={false} />
    </SafeAreaView>
  );
};

export default () => {
  return (
    <RecoilRoot>
      <App />
    </RecoilRoot>
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
