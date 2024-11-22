import React from "react";
import { Stack } from "expo-router";
import { SQLiteProvider, type SQLiteDatabase } from "expo-sqlite";

import "../global.css";

const RootLayout = () => {
	return (
		<SQLiteProvider databaseName="test.db" onInit={migrateDbIfNeeded}>
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen name="index" />
			</Stack>
		</SQLiteProvider>
	);
};

async function migrateDbIfNeeded(db: SQLiteDatabase) {
	const DB_SCHEMA_VERSION = 2;

	const result = await db.getFirstAsync<{
		user_version: number;
	}>("PRAGMA user_version");

	let dbVersion = result?.user_version ?? 0;

	if (dbVersion !== DB_SCHEMA_VERSION) {
		console.log("Migrating database to version", DB_SCHEMA_VERSION);

		await db.execAsync(`
				PRAGMA journal_mode = 'wal';

				-- Drop all existing tables
				DROP TABLE IF EXISTS departments;
				DROP TABLE IF EXISTS employees;
				DROP TABLE IF EXISTS employment_statuses;
				DROP TABLE IF EXISTS job_titles;

				-- Create new tables
				CREATE TABLE IF NOT EXISTS departments (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					name TEXT UNIQUE NOT NULL,
					created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
				);

				CREATE TABLE IF NOT EXISTS job_titles (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					name TEXT UNIQUE NOT NULL,
					created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
				);

				CREATE TABLE IF NOT EXISTS employment_statuses (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					name TEXT UNIQUE NOT NULL,
					created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
				);

				CREATE TABLE IF NOT EXISTS employees (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					first_name TEXT NOT NULL,
					last_name TEXT NOT NULL,
					department_id INTEGER NOT NULL,
					job_title_id INTEGER NOT NULL,
					salary REAL NOT NULL,
					status_id INTEGER NOT NULL,
					created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
					FOREIGN KEY (department_id) REFERENCES departments (id),
					FOREIGN KEY (job_title_id) REFERENCES job_titles (id),
					FOREIGN KEY (status_id) REFERENCES employment_statuses (id)
				);

				-- Insert default departments
				INSERT INTO departments (name) VALUES 
					('IT'),
					('Sales'),
					('Finance'),
					('HR');

				-- Insert employment statuses
				INSERT INTO employment_statuses (name) VALUES 
					('Permanent'),
					('On Probation');

				-- Insert job titles
				INSERT INTO job_titles (name) VALUES 
					('Senior Engineer'),
					('Engineer'),
					('Manager'),
					('Sales Executive'),
					('Financial Analyst'),
					('HR Associate');


			`);
	}

	await db.execAsync(`PRAGMA user_version = ${DB_SCHEMA_VERSION}`);
}

export default RootLayout;
