import {
	View,
	Text,
	TouchableOpacity,
	Modal,
	FlatList,
	ScrollView,
	Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus, X, Users } from "lucide-react-native";
import FormTextInput from "../../components/form-text-input";
import { useSQLiteContext } from "expo-sqlite";
import SelectionModal from "../../components/selection-modal";
import { useEmployeeStore } from "../../store/useEmployeeStore";
import { Employee } from "../../types";

const HomeTabScreen = () => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isDepartmentModalVisible, setIsDepartmentModalVisible] =
		useState(false);
	const [isJobTitleModalVisible, setIsJobTitleModalVisible] = useState(false);
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		departmentId: null,
		departmentName: "",
		jobTitleId: null,
		jobTitleName: "",
		salary: "",
		statusId: 1,
	});
	const [selectedDepartment, setSelectedDepartment] = useState<number | null>(
		null
	);

	const db = useSQLiteContext();
	const {
		addEmployee,
		loadEmployees,
		loadDepartments,
		loadEmploymentStatuses,
		loadJobTitles,
		employees,
		departments,
		employmentStatuses,
		jobTitles,
		deleteEmployee,
	} = useEmployeeStore();

	useEffect(() => {
		loadEmployees(db);
		loadDepartments(db);
		loadEmploymentStatuses(db);
		loadJobTitles(db);
	}, [
		db,
		loadEmployees,
		loadDepartments,
		loadEmploymentStatuses,
		loadJobTitles,
	]);

	const handleSaveEmployee = async () => {
		if (
			!formData.firstName ||
			!formData.lastName ||
			!formData.departmentId ||
			!formData.jobTitleId ||
			!formData.salary
		) {
			return;
		}

		const newEmployee = {
			...formData,
			salary: parseFloat(formData.salary),
		};

		await addEmployee(newEmployee, db);
		setIsModalVisible(false);
		setFormData({
			firstName: "",
			lastName: "",
			departmentId: null,
			departmentName: "",
			jobTitleId: null,
			jobTitleName: "",
			salary: "",
			statusId: 1,
		});
	};

	const handleLongPress = (employee: Employee) => {
		Alert.alert(
			"Delete Employee",
			`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`,
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Delete",
					style: "destructive",
					onPress: () => deleteEmployee(employee.id!, db),
				},
			]
		);
	};

	const renderEmployee = ({ item }: { item: Employee }) => (
		<TouchableOpacity
			onLongPress={() => handleLongPress(item)}
			delayLongPress={500}
		>
			<View className="bg-gray-800 p-4 mb-2 rounded-lg shadow">
				<Text className="text-lg font-bold text-white">
					{item.firstName} {item.lastName}
				</Text>
				<Text className="text-gray-300">{item.jobTitleName}</Text>
				<View className="flex-row justify-between mt-1">
					<Text className="text-gray-400">{item.departmentName}</Text>
					<Text className="text-gray-400">
						${item.salary.toLocaleString()}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);

	const filteredEmployees = selectedDepartment
		? employees.filter((emp) => emp.departmentId === selectedDepartment)
		: employees;

	const renderDepartmentChip = ({
		item,
	}: {
		item: { id: number | null; name: string };
	}) => (
		<TouchableOpacity
			onPress={() => setSelectedDepartment(item.id)}
			className={`px-4 py-3 rounded-lg mr-2 border ${
				selectedDepartment === item.id
					? "bg-indigo-600 border-indigo-500"
					: "bg-gray-800 border-gray-700"
			}`}
		>
			<Text
				className={`text-sm ${
					selectedDepartment === item.id
						? "text-white font-medium"
						: "text-gray-400"
				}`}
			>
				{item.name}
			</Text>
		</TouchableOpacity>
	);

	const EmptyState = () => (
		<View className="flex-1 items-center justify-center">
			<Users size={64} color="#6366F1" className="mb-4" />
			<Text className="text-xl font-semibold text-gray-300 text-center">
				No Employees Found
			</Text>
			<Text className="text-gray-400 text-center mt-2">
				Add your first employee by tapping the plus button below
			</Text>
		</View>
	);

	return (
		<SafeAreaView className="flex-1 p-4 bg-gray-900">
			<Text className="text-2xl font-bold mb-4 text-white">
				Employees
			</Text>

			<View className="flex-1">
				<View>
					<FlatList
						horizontal
						showsHorizontalScrollIndicator={false}
						data={[{ id: null, name: "All" }, ...departments]}
						renderItem={renderDepartmentChip}
						keyExtractor={(item) => item.id?.toString() || "all"}
						className="mb-4"
						contentContainerStyle={{ paddingVertical: 4 }}
					/>
				</View>

				<View className="flex-1">
					<FlatList
						data={filteredEmployees}
						renderItem={renderEmployee}
						keyExtractor={(item) => item.id?.toString() || ""}
						className="flex-1"
						contentContainerStyle={[
							{ flexGrow: 1 },
							employees.length === 0 && { flex: 1 },
						]}
						showsVerticalScrollIndicator={false}
						ListEmptyComponent={EmptyState}
					/>
				</View>
			</View>

			<TouchableOpacity
				className="absolute bottom-6 right-6 bg-indigo-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
				onPress={() => setIsModalVisible(true)}
			>
				<Plus size={24} color="white" />
			</TouchableOpacity>

			<Modal
				animationType="slide"
				transparent={true}
				visible={isModalVisible}
				onRequestClose={() => {
					setIsModalVisible(!isModalVisible);
				}}
			>
				<View className="flex-1 justify-end bg-black/50">
					<View className="bg-gray-800 rounded-t-3xl p-6 h-4/5 w-full">
						<View className="flex-row justify-between items-center mb-6">
							<Text className="text-2xl font-bold text-white">
								Add Employee
							</Text>
							<TouchableOpacity
								onPress={() => setIsModalVisible(false)}
							>
								<X size={24} color="#9CA3AF" />
							</TouchableOpacity>
						</View>

						<ScrollView
							className="flex-1 px-2"
							showsVerticalScrollIndicator={false}
						>
							<FormTextInput
								label="First Name"
								placeholder="Enter first name"
								value={formData.firstName}
								onChangeText={(text) =>
									setFormData((prev) => ({
										...prev,
										firstName: text,
									}))
								}
							/>

							<FormTextInput
								label="Last Name"
								placeholder="Enter last name"
								value={formData.lastName}
								onChangeText={(text) =>
									setFormData((prev) => ({
										...prev,
										lastName: text,
									}))
								}
							/>

							<View className="mb-4">
								<Text className="text-sm font-medium mb-1 text-gray-300">
									Department
								</Text>
								<TouchableOpacity
									className="border border-gray-600 bg-gray-700 rounded-lg p-4"
									onPress={() =>
										setIsDepartmentModalVisible(true)
									}
								>
									<Text className="text-gray-300">
										{formData.departmentName ||
											"Select Department"}
									</Text>
								</TouchableOpacity>
							</View>

							<View className="mb-4">
								<Text className="text-sm font-medium mb-1 text-gray-300">
									Job Title
								</Text>
								<TouchableOpacity
									className="border border-gray-600 bg-gray-700 rounded-lg p-4"
									onPress={() =>
										setIsJobTitleModalVisible(true)
									}
								>
									<Text className="text-gray-300">
										{formData.jobTitleName ||
											"Select Job Title"}
									</Text>
								</TouchableOpacity>
							</View>

							<FormTextInput
								label="Salary"
								placeholder="Enter salary"
								keyboardType="numeric"
								value={formData.salary}
								onChangeText={(text) =>
									setFormData((prev) => ({
										...prev,
										salary: text,
									}))
								}
							/>

							<TouchableOpacity
								className="bg-indigo-600 h-14 items-center justify-center rounded-lg mt-4"
								onPress={handleSaveEmployee}
							>
								<Text className="text-center text-white">
									Save
								</Text>
							</TouchableOpacity>
						</ScrollView>
					</View>
				</View>
			</Modal>

			<SelectionModal
				visible={isDepartmentModalVisible}
				onClose={() => setIsDepartmentModalVisible(false)}
				data={departments}
				title="Select Department"
				onSelect={(item) =>
					setFormData((prev) => ({
						...prev,
						departmentId: item.id,
						departmentName: item.name,
					}))
				}
			/>

			<SelectionModal
				visible={isJobTitleModalVisible}
				onClose={() => setIsJobTitleModalVisible(false)}
				data={jobTitles}
				title="Select Job Title"
				onSelect={(item) =>
					setFormData((prev) => ({
						...prev,
						jobTitleId: item.id,
						jobTitleName: item.name,
					}))
				}
			/>
		</SafeAreaView>
	);
};

export default HomeTabScreen;
