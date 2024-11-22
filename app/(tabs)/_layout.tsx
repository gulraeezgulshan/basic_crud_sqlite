import React from "react";
import { Tabs } from "expo-router";
import { HomeIcon } from "lucide-react-native";

const TabsLayout = () => {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					backgroundColor: "#1a1a1a",
					borderTopWidth: 0,
					elevation: 0,
					shadowOpacity: 0,
					height: 60,
					paddingBottom: 8,
				},
				tabBarActiveTintColor: "#ffffff",
				tabBarInactiveTintColor: "#666666",
			}}
		>
			<Tabs.Screen
				name="home"
				options={{
					title: "Home",
					tabBarIcon: ({ color }) => (
						<HomeIcon size={24} color={color} />
					),
				}}
			/>
		</Tabs>
	);
};

export default TabsLayout;
