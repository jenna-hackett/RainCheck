import { useSettings } from "@/src/contexts/settingsContext";
import { weatherThemes } from "@/src/theme/theme";
import Entypo from "@expo/vector-icons/Entypo";
import Octicons from "@expo/vector-icons/Octicons";
import { useRouter } from "expo-router";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function About() {
  const router = useRouter();
  const { weatherCondition } = useSettings();
  const theme = weatherThemes[weatherCondition];
  return (
    <SafeAreaView style={[styles.page, { backgroundColor: theme.background }]}>
      <View>
        {/*whole page*/}
        <View>
          <Pressable onPress={() => router.back()} style={styles.header}>
            <Entypo name="chevron-small-left" size={44} color="black" />
            <Text style={styles.title}>About Us</Text>
          </Pressable>
        </View>
        <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.cardText, { color: theme.text }]}>
            RainCheck is made by the {"<div>as"}, a team consisting of Aurora
            Choban, Jenna Hackett and Verity Boyd.{"\n\n"}
            This app was made as the final project of our CPRG-303 course in
            Mobile Application Development.
            {"\n\n"}See more of our work:
            {"\n"}
            <Octicons name="dot-fill" size={14} color="black" /> Aurora Choban:{" "}
            <Text
              style={styles.link}
              onPress={() => Linking.openURL("https://github.com/aurorachoban")}
            >
              GitHub
            </Text>
            {"\n"}
            <Octicons name="dot-fill" size={14} color="black" /> Jenna Hackett:{" "}
            <Text
              style={styles.link}
              onPress={() =>
                Linking.openURL("https://github.com/jenna-hackett")
              }
            >
              GitHub
            </Text>
            {"\n"}
            <Octicons name="dot-fill" size={14} color="black" /> Verity Boyd:{" "}
            <Text
              style={styles.link}
              onPress={() => Linking.openURL("https://github.com/verityboyd")}
            >
              GitHub
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 20,
    paddingHorizontal: 20,
    flexDirection: "column",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 35,
    paddingLeft: 5,
  },
  card: {
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 5,
  },
  cardText: {
    fontSize: 18,
    lineHeight: 26,
  },
  link: {
    fontWeight: 500,
    color: "blue",
  },
});
