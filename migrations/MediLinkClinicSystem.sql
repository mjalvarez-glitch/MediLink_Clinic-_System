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
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    last_name VARCHAR(50) NOT NULL,
    birthdate DATE NOT NULL,
    sex VARCHAR(10) NOT NULL,
    address VARCHAR(200) NOT NULL,
    phone_no VARCHAR(11) NOT NULL,
    email VARCHAR(100)
);

CREATE TABLE emergency_contact_info (
    contact_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    patient_id INT,
    person_name VARCHAR(100) NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    phone_no VARCHAR(11) NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
);

CREATE TABLE visits (
    visit_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    visit_date DATE NOT NULL,
    reason TEXT NOT NULL,
    diagnosis TEXT NOT NULL,
    blood_pressure VARCHAR(50) NOT NULL,
    temperature FLOAT NOT NULL,
    weight_kg FLOAT NOT NULL,
    height_cm FLOAT NOT NULL,
    attended_by VARCHAR(200) NOT NULL,
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
    patient_id INT NOT NULL,
    visit_id INT NOT NULL,
    medication VARCHAR(200) NOT NULL,
    dosage VARCHAR(200) NOT NULL,
    frequency VARCHAR(200) NOT NULL,
    duration_days INT NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (visit_id) REFERENCES visits(visit_id)
);