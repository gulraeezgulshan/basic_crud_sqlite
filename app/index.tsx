import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
	return (
		<SafeAreaView className="flex-1 items-center justify-center gap-6 p-6 bg-gray-900">
			<Text className="text-3xl font-bold text-white">
				Welcome to the app
			</Text>
			<Text className="text-gray-400 text-base text-center leading-relaxed max-w-sm">
				This app is a simple example of how to use Expo Router with
				SQLite database. In which you can add, edit and delete
				employees.
			</Text>

			<Pressable
				className="bg-blue-600 rounded-lg min-h-14 w-full p-5 items-center justify-center shadow-lg"
				onPress={() => router.push("/home")}
			>
				<Text className="text-white font-medium text-lg">
					Get Started
				</Text>
			</Pressable>
			<StatusBar style="light" />
		</SafeAreaView>
	);
}
