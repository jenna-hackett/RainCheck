/*
Screens should contain almost no logic.
They should only:
- call hooks
- render components
- pass props
--- Everything else (API, storage, formatting) lives in src/.
*/

import { Text, View } from "react-native";

export default function Settings() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>VERITY SCREEN</Text>
    </View>
  );
}
