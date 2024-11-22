import { create } from 'zustand';
import { SQLiteDatabase } from 'expo-sqlite';
import { Employee, Department, EmploymentStatus, JobTitle } from '../types';


// Agreement
interface EmployeeStore {

    //State Variables
    employees: Employee[];
    departments: Department[];
    employmentStatuses: EmploymentStatus[];
    jobTitles: JobTitle[];

    //State Functions
    addEmployee: (employee: Employee, db: SQLiteDatabase) => Promise<void>;
    loadEmployees: (db: SQLiteDatabase) => Promise<void>;
    loadDepartments: (db: SQLiteDatabase) => Promise<void>;
    loadEmploymentStatuses: (db: SQLiteDatabase) => Promise<void>;
    loadJobTitles: (db: SQLiteDatabase) => Promise<void>;
    deleteEmployee: (employeeId: number, db: SQLiteDatabase) => Promise<void>;
}

export const useEmployeeStore = create<EmployeeStore>((set) => ({

    //Initially all collection are an empty arrays
    employees: [],
    departments: [],
    employmentStatuses: [],
    jobTitles: [],

    addEmployee: async (employee: Employee, db: SQLiteDatabase) => {
        try {
            const result = await db.runAsync(
                `INSERT INTO employees (
                    first_name, 
                    last_name, 
                    department_id, 
                    job_title_id, 
                    salary, 
                    status_id
                ) VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    employee.firstName,
                    employee.lastName,
                    employee.departmentId,
                    employee.jobTitleId,
                    employee.salary,
                    employee.statusId
                ]
            );

            const newEmployee = { ...employee, id: result.lastInsertRowId }; //Creating a new employee with newly created employeed ID
            set((state) => ({ employees: [...state.employees, newEmployee] })); // setting new Employee object to employees state variable

        } catch (error) {
            console.error('Error adding employee:', error);
        }
    },

    loadEmployees: async (db: SQLiteDatabase) => {
        try {
            const result = await db.getAllAsync<Employee>(
                `SELECT 
                    e.id,
                    e.first_name as firstName,
                    e.last_name as lastName,
                    e.department_id as departmentId,
                    d.name as departmentName,
                    e.job_title_id as jobTitleId,
                    j.name as jobTitleName,
                    e.salary,
                    e.status_id as statusId,
                    s.name as statusName,
                    e.created_at as createdAt
                FROM employees e
                LEFT JOIN departments d ON e.department_id = d.id
                LEFT JOIN job_titles j ON e.job_title_id = j.id
                LEFT JOIN employment_statuses s ON e.status_id = s.id`
            );

            set({ employees: result });
        } catch (error) {
            console.error('Error loading employees:', error);
        }
    },

    loadDepartments: async (db: SQLiteDatabase) => {
        try {
            const result = await db.getAllAsync<Department>(
                'SELECT * FROM departments ORDER BY name'
            );

            const departments = result.map(row => ({
                id: row.id,
                name: row.name
            }));

            set({ departments });
        } catch (error) {
            console.error('Error loading departments:', error);
        }
    },

    loadEmploymentStatuses: async (db: SQLiteDatabase) => {
        try {
            const result = await db.getAllAsync<EmploymentStatus>(
                'SELECT * FROM employment_statuses ORDER BY name'
            );

            const employmentStatuses = result.map(row => ({
                id: row.id,
                name: row.name
            }));

            set({ employmentStatuses });
        } catch (error) {
            console.error('Error loading employment statuses:', error);
        }
    },

    loadJobTitles: async (db: SQLiteDatabase) => {
        try {
            const result = await db.getAllAsync<JobTitle>(
                'SELECT * FROM job_titles ORDER BY name'
            );

            const jobTitles = result.map(row => ({
                id: row.id,
                name: row.name
            }));

            set({ jobTitles });
        } catch (error) {
            console.error('Error loading job titles:', error);
        }
    },

    deleteEmployee: async (employeeId: number, db: SQLiteDatabase) => {
        try {
            await db.runAsync(
                'DELETE FROM employees WHERE id = ?',
                [employeeId]
            );

            set((state) => ({
                employees: state.employees.filter(emp => emp.id !== employeeId)
            }));
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    },
}));