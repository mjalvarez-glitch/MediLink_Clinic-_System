CREATE TABLE users (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100),
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Doctor', 'Nurse', 'Receptionist') NOT NULL,
    refresh_token text,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE patients (
    patient_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50),
    middle_name VARCHAR(50),
    last_name VARCHAR(50),
    birthdate DATE,
    sex VARCHAR(10),
    address VARCHAR(200),
    phone_no VARCHAR(11),
    email VARCHAR(100)
);

CREATE TABLE emergency_contact_info (
    contact_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    patient_id INT,
    person_name VARCHAR(100),
    relationship VARCHAR(50),
    phone_no VARCHAR(11),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
);

CREATE TABLE visits (
    visit_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    patient_id INT,
    visit_date DATE,
    reason TEXT,
    diagnosis TEXT,
    blood_pressure VARCHAR(50),
    temperature FLOAT,
    weight_kg FLOAT,
    height_cm FLOAT,
    attended_by VARCHAR(200),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
);

CREATE TABLE medical_history (
    history_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    patient_id INT,
    conditions VARCHAR(200),
    allergies VARCHAR(200),
    past_surgeries VARCHAR(200),
    family_history VARCHAR(200),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
);

CREATE TABLE prescriptions (
    prescription_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    patient_id INT,
    visit_id INT,
    medication VARCHAR(200),
    dosage VARCHAR(200),
    frequency VARCHAR(200),
    duration_days INT,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (visit_id) REFERENCES visits(visit_id)
);