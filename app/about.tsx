import { useSettings } from "@/src/contexts/settingsContext";
import { weatherThemes } from "@/src/theme/theme";
import Entypo from "@expo/vector-icons/Entypo";
import { useRouter } from "expo-router";
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TEAM = [
  {
    name: "Aurora Choban",
    github: "https://github.com/aurorachoban",
    initials: "AC",
  },
  {
    name: "Jenna Hackett",
    github: "https://github.com/jenna-hackett",
    initials: "JH",
  },
  {
    name: "Verity Boyd",
    github: "https://github.com/verityboyd",
    initials: "VB",
  },
];

export default function About() {
  const router = useRouter();
  const { weatherCondition } = useSettings();
  const theme = weatherThemes[weatherCondition];

  return (
    <SafeAreaView
      edges={["bottom", "left", "right"]}
      style={[styles.page, { backgroundColor: theme.background }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop:
              Platform.OS === "android"
                ? (StatusBar.currentHeight ?? 24) + 16
                : 16,
          },
        ]}
      >
        {/* Header */}
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Entypo name="chevron-small-left" size={28} color={theme.subtext} />
          <Text style={[styles.backText, { color: theme.subtext }]}>
            Settings
          </Text>
        </Pressable>

        <Text style={[styles.title, { color: theme.text }]}>About Us</Text>

        {/* App description */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.appName, { color: theme.text }]}>RainCheck</Text>
          <Text style={[styles.appDesc, { color: theme.subtext }]}>
            Made by the &lt;div&gt;as — a team of three students in the CPRG-303
            Mobile Application Development course.
          </Text>
        </View>

        {/* Team section */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          The Team
        </Text>
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.border,
            },
          ]}
        >
          {TEAM.map((member, index) => (
            <View key={member.name}>
              <View style={styles.memberRow}>
                <View
                  style={[styles.avatar, { backgroundColor: theme.background }]}
                >
                  <Text style={[styles.avatarText, { color: theme.subtext }]}>
                    {member.initials}
                  </Text>
                </View>
                <View style={styles.memberInfo}>
                  <Text style={[styles.memberName, { color: theme.text }]}>
                    {member.name}
                  </Text>
                  <Pressable onPress={() => Linking.openURL(member.github)}>
                    <Text style={[styles.link, { color: theme.subtext }]}>
                      GitHub →
                    </Text>
                  </Pressable>
                </View>
              </View>
              {index < TEAM.length - 1 && (
                <View
                  style={[styles.divider, { backgroundColor: theme.border }]}
                />
              )}
            </View>
          ))}
        </View>

        {/* Course info */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Course</Text>
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.subtext }]}>
              Course
            </Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>
              CPRG-303
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.subtext }]}>
              Program
            </Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>
              Mobile Application Development
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.subtext }]}>
              School
            </Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>SAIT</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: -6,
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: -0.5,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    opacity: 0.6,
    marginBottom: 8,
    marginTop: 24,
    marginLeft: 4,
  },
  card: {
    borderRadius: 16,
    borderWidth: 0.5,
    overflow: "hidden",
  },
  appName: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  appDesc: {
    fontSize: 14,
    lineHeight: 22,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 13,
    fontWeight: "600",
  },
  memberInfo: {
    flex: 1,
    gap: 2,
  },
  memberName: {
    fontSize: 15,
    fontWeight: "500",
  },
  link: {
    fontSize: 13,
  },
  divider: {
    height: 0.5,
    marginLeft: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  infoLabel: {
    fontSize: 15,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "500",
    textAlign: "right",
    flex: 1,
    paddingLeft: 16,
  },
});
