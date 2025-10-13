import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CardSkeleton from "./components/CardSkeleton";
import CategoryToolbar from "./components/CategoryToolbar";
export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-lightBg dark:bg-darkBg">
      <View className="flex-1 justify-center items-center">
        <CardSkeleton />
        {/* <DeckSwiper /> */}
      </View>
      <CategoryToolbar />
    </SafeAreaView>
  );
}
