import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CardSkeletonPager from "./components/CardSkeleton";
import CategorySkeleton from "./components/CategorySkeleton";
import TopBar from "./components/TopBar";
export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-lightBg dark:bg-darkBg">
      <TopBar />
      <View className="flex-1 justify-center items-center">
        <CardSkeletonPager />
      </View>

      <CategorySkeleton />
    </SafeAreaView>
  );
}
