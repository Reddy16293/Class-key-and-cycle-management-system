use CCKM;


CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    userName VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE,
    enabled BIT(1) NOT NULL,
    supervisor_id BIGINT,
    name VARCHAR(255),
    picture VARCHAR(255),
    userRole ENUM('ADMIN', 'CR', 'NON_CR'),
    FOREIGN KEY (supervisor_id) REFERENCES users(id)
);

CREATE TABLE bicycles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    isAvailable BIT(1) NOT NULL,
    qrCode VARCHAR(255) NOT NULL UNIQUE
);


CREATE TABLE classroom_keys (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    blockName VARCHAR(255) NOT NULL,
    classroomName VARCHAR(255) NOT NULL,
    isAvailable INT NOT NULL
);

CREATE TABLE borrow_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bicycle_id BIGINT,
    borrowTime DATETIME(6) NOT NULL,
    returnTime DATETIME(6),
    student_id BIGINT NOT NULL,
    feedback VARCHAR(255),
    classroom_key_id BIGINT,
    FOREIGN KEY (bicycle_id) REFERENCES bicycles(id),
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (classroom_key_id) REFERENCES classroom_keys(id)
);

CREATE TABLE key_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    classroom_key_id BIGINT NOT NULL,
    requestTime DATETIME(6) NOT NULL,
    student_id BIGINT NOT NULL,
    status VARCHAR(255) NOT NULL,
    FOREIGN KEY (classroom_key_id) REFERENCES classroom_keys(id),
    FOREIGN KEY (student_id) REFERENCES users(id)
);






