# 📝 Admin API Documentation

---

## 1️⃣ Login

**POST** `/admin/login`

**Headers**:  
`Content-Type: application/json`

**Body**
```json
{
  "email": "admin@mail.com",
  "password": "123456"
}

```
**Success 200**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "<jwt_token>",
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@mail.com",
    "role": "admin"
  }
}
```
---
## 2️⃣ Dashboard Overview

**GET** `/admin/dashboard`

**Headers**:  
`{
  "Authorization": "Bearer <token>"
}
`

**Required Permission: read_task**

**Success 200**
```json
{
  "totalEmployees": 15,
  "totalTasks": 48,
  "taskStatistics": {
    "completed": 20,
    "in_progress": 18,
    "overdue": 10
  }
}

```
---
## 3️⃣ Get Employees

**GET** `/admin/employees`

**Headers**:  
`{
  "Authorization": "Bearer <token>"
}
`

**Required Permission: list_users**

**Success 200**
```json
[
  {
    "id": 1,
    "name": "Laith",
    "department": "IT",
    "photo": "url.jpg",
    "completed_tasks": 5,
    "in_progress_tasks": 2,
    "overdue_tasks": 1
  }
]


```
---
## 4️⃣ Add Employee

**POST** `/admin/employees`

**Headers**:  
`
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
`

**Required Permission: create_user**

**Body**
```json
{
  "name": "Laith",
  "email": "laith@mail.com",
  "password": "123456",
  "photo": "http://image.com/pic.png",
  "department": "IT"
}


```
**Success 201**
```json
{
  "message": "Employee added",
  "user": {
    "id": 5,
    "name": "Laith",
    "email": "laith@mail.com"
  }
}

```
---
## 5️⃣ Update Employee

**PUT** `/admin/employees/:id`

**Headers**:  
`
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
`

**Required Permission: update_user**

**Body**
```json
{
  "name": "Laith Updated",
  "department": "HR",
  "photo": "new.jpg",
  "email": "laith_updated@mail.com"
}



```
**Success 200**
```json
{
  "id": 1,
  "name": "Laith Updated",
  "department": "HR",
  "photo": "new.jpg",
  "email": "laith_updated@mail.com"
}
```
---
## 6️⃣ Delete Employee

**DELETE** `/admin/employees/:id`

**Headers**:  
`{
  "Authorization": "Bearer <token>"
}
`

**Required Permission: delete_user**

**Success 200**
```json
{
  "message": "Employee deleted"
}

```
---
## 7️⃣ Get All Tasks

**GET** `/admin/tasks`

**Headers**:  
`{
  "Authorization": "Bearer <token>"
}
`

**Required Permission: list_tasks**

**Success 200**
```json
[
  {
    "id": 1,
    "task_name": "Prepare Report",
    "due_date": "2025-01-15",
    "status": "in-progress",
    "priority": "high",
    "assigned_employee": "Laith"
  }
]

```
---
## 8️⃣ Add Task

**POST** `/admin/tasks`

**Headers**:  
`
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
`

**Required Permission: create_task**

**Body**
```json
{
  "task_name": "New Task",
  "description": "Task details...",
  "due_date": "2025-02-15",
  "priority": "medium",
  "status": "in-progress"
}
```
**Success 201**
```json
{
  "message": "Task created and progress initialized",
  "task": {
    "id": 10,
    "task_name": "New Task",
    "status": "in-progress",
    "priority": "medium"
  }
}
```
---
## 9️⃣ Update Task

**PUT** `/admin/tasks/:task_id`

**Headers**:  
`
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
`

**Required Permission: update_task**

**Body**
```json
{
  "status": "completed",
  "progress_percentage": 100
}
```
**Success 200**
```json
{
  "message": "Task updated"
}
```
---
## 🔟 Get Single Task Details

**GET** `/admin/task/:task_id`

**Headers**:  
`{
  "Authorization": "Bearer <token>"
}
`

**Required Permission: read_task**

**Success 200**
```json
{
  "id": 1,
  "task_name": "Prepare Report",
  "assigned_employee": "Laith",
  "progress": [
    {
      "progress_percentage": 20,
      "updated_at": "2025-01-10"
    }
  ]
}
```
---
## 1️⃣1️⃣ Delete Task

**DELETE** `/admin/tasks/:task_id`

**Headers**:  
`{
  "Authorization": "Bearer <token>"
}
`

**Required Permission: delete_task**

**Success 200**
```json
{
  "message": "Task deleted"
}
```
---
## 1️⃣2️⃣ Get Progress Overview

**GET** `/admin/progress`

**Headers**:  
`{
  "Authorization": "Bearer <token>"
}
`

**Required Permission: read_progress**

**Success 200**
```json
[
  {
    "task_name": "Prepare Report",
    "employee": "Laith",
    "progress_percentage": 80,
    "updated_at": "2025-01-11"
  }
]

```
