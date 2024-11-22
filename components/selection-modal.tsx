import { X } from "lucide-react-native";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";

interface SelectionModalProps {
	visible: boolean;
	onClose: () => void;
	data: Array<{ id?: string | number; name?: string } | string>;
	onSelect: (item: any) => void;
	title: string;
}

const SelectionModal = ({
	visible,
	onClose,
	data,
	onSelect,
	title,
}: SelectionModalProps) => (
	<Modal
		animationType="slide"
		transparent={true}
		visible={visible}
		onRequestClose={onClose}
	>
		<View className="flex-1 bg-black/50 justify-end">
			<View className="bg-gray-900 rounded-t-3xl">
				<View className="p-4 border-b border-gray-800">
					<View className="flex-row justify-between items-center">
						<Text className="text-xl font-bold text-white">
							{title}
						</Text>
						<TouchableOpacity onPress={onClose}>
							<X size={24} color="white" />
						</TouchableOpacity>
					</View>
				</View>
				<FlatList
					data={data}
					className="max-h-[70%]"
					renderItem={({ item }) => (
						<TouchableOpacity
							className="p-4 border-b border-gray-800"
							onPress={() => {
								onSelect(item);
								onClose();
							}}
						>
							<Text className="text-lg text-white">
								{typeof item === "string"
									? item
									: item.name || ""}
							</Text>
						</TouchableOpacity>
					)}
					keyExtractor={(item) =>
						typeof item === "string"
							? item
							: item.id?.toString() || ""
					}
				/>
			</View>
		</View>
	</Modal>
);

export default SelectionModal;
