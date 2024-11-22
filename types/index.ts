export interface Employee {
    id?: number;
    firstName: string;
    lastName: string;
    departmentId: number | null;
    departmentName: string;
    jobTitleId: number | null;
    jobTitleName: string;
    salary: number;
    statusId: number | null;
    statusName?: string;
    createdAt?: string;
}


export interface Department {
    id: number;
    name: string;
}

export interface EmploymentStatus {
    id: number;
    name: string;
}


export interface JobTitle {
    id: number;
    name: string;
}