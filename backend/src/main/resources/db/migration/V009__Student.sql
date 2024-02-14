CREATE TABLE student_details (
    id BINARY(16) PRIMARY KEY,
	university_id VARCHAR(256),
    gpa DECIMAL(4, 3),
    description VARCHAR(256),
	graduation_year TIMESTAMP,
	start_date TIMESTAMP,
    year_level ENUM('Freshman', 'Sophomore', 'Junior', 'Senior')
);

/* CREATE TABLE job(
    id BINARY(16) PRIMARY KEY,
    studentID VARCHAR(256),
    jobName VARCHAR(256),
    location VARCHAR(256),
    description TEXT,
    startDate DATE,
    endDate DATE,
    isCoop BOOLEAN,
    FOREIGN KEY (studentID) REFERENCES student_details (id)
);

CREATE TABLE project(
    projectID INT AUTO_INCREMENT PRIMARY KEY,
    studentID VARCHAR(256),
    projectName VARCHAR(256),
    description TEXT,
    startDate DATE,
    endDate DATE,
    FOREIGN KEY (studentID) REFERENCES student_details (id)
); */

CREATE TABLE skill(
    id BINARY(16) PRIMARY KEY,
    studentID BINARY(16),
    skillName VARCHAR(256),
    isLanguage BOOLEAN,
    FOREIGN KEY (studentID) REFERENCES student_details (id)
);

/* CREATE TABLE degreeProgram(
    programID INT AUTO_INCREMENT PRIMARY KEY,
    studentID INT,
    programName VARCHAR(256),
    isMinor BOOLEAN,
    FOREIGN KEY (studentID) REFERENCES student (studentID)
); */

-- CREATE TABLE club(
--     clubID INT AUTO_INCREMENT PRIMARY KEY,
--     studentID INT,
--     clubName VARCHAR(256),
--     startDate DATE,
--     endDate DATE,
--     FOREIGN KEY (studentID) REFERENCES student (studentID)
-- );