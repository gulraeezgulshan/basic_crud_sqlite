import React from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";

interface FormTextInputProps extends TextInputProps {
	label: string;
	error?: string;
}

const FormTextInput = ({ label, error, ...props }: FormTextInputProps) => {
	return (
		<View className="mb-4">
			<Text className="text-white text-sm font-semibold mb-2">
				{label}
			</Text>
			<View className="w-full h-14 border border-gray-600 rounded-lg overflow-hidden bg-gray-800/50">
				<TextInput
					className="flex-1 px-4 text-base text-white"
					placeholderTextColor="#9CA3AF"
					{...props}
				/>
			</View>
			{error && (
				<Text className="text-red-500 text-sm mt-2">{error}</Text>
			)}
		</View>
	);
};

export default FormTextInput;
