
------------------------------------------------------------------------------
create Database TaskManagerDB ; 

--  Roles
CREATE TABLE Roles (
  id SERIAL PRIMARY KEY,
  role VARCHAR(255) NOT NULL
);

--  Permissions
CREATE TABLE Permissions (
  id SERIAL PRIMARY KEY,
  permission VARCHAR(255) NOT NULL
);

--  RolePermission
CREATE TABLE RolePermission (
  id SERIAL PRIMARY KEY,
  role_id INTEGER, -- FK Roles
  permission_id INTEGER, -- FK Permissions
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (permission_id) REFERENCES permissions(id)
);


--  Users
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    photo TEXT,
    department VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    role_id INTEGER,  -- FK Roles
    IsActive BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (role_id) REFERENCES Roles(id)
);

--  Tasks
CREATE TABLE Tasks (
    id SERIAL PRIMARY KEY,
    task_name VARCHAR(255),
    user_id INTEGER,  -- FK Users
    description TEXT,
    assigned_date DATE,
    due_date DATE,
    status VARCHAR(50),
    priority VARCHAR(50),
    IsActive BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- Task Progress
CREATE TABLE Task_Progress (
    id SERIAL PRIMARY KEY,
    task_id INTEGER,  -- FK Tasks
    employee_id INTEGER,  -- FK  Users
    progress_percentage INTEGER,
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (task_id) REFERENCES Tasks(id),
    FOREIGN KEY (employee_id) REFERENCES Users(id) 
);