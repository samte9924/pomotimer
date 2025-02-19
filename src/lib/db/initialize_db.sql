CREATE DATABASE IF NOT EXISTS pomotimer;
USE pomotimer;

CREATE TABLE IF NOT EXISTS Tasks (
	task_id INT PRIMARY KEY AUTO_INCREMENT,
    task_name VARCHAR(255) NOT NULL,
    task_description TEXT
);

CREATE TABLE IF NOT EXISTS Sessions (
	session_id INT PRIMARY KEY AUTO_INCREMENT,
    task_id INT,
    session_start_time DATETIME NOT NULL,
    session_end_time DATETIME NOT NULL,
    session_duration INT CHECK (session_duration >= 0),
    FOREIGN KEY (task_id) REFERENCES Tasks(task_id) ON DELETE CASCADE,
    CHECK (session_end_time >= session_start_time)
);