# Company task management

## Functional specification

Company Task Management is a web app that allows team managers and their team members to create and manage tasks. The app is designed to help individuals and teams stay organized and on track with their daily tasks and projects.

Manager can register an account

Managers can invite new team members to the project. Each user provides a name, an email, and a password to create an account. Team members cannot register by themselves but need a manager's email invitation to set up their accounts.

After joining, users can manage their profiles, view and manage tasks, receive notifications, and collaborate with team members.

## User Stories

### Manager

- [ ] As a manager, I want to be able to invite new team members and set up their accounts with their provided information (email, name).
- [ ] As a manager, I want to be able to create a Project that will include task further
- [ ] As a manager, I want to be able to add or invite user to team Members of the project
- [ ] As a manager, I want to be able to create and assign and unassign tasks to specific team members .
- [ ] As a manager, I want to be able to provide descriptions, set priorities, and deadlines for each project.
- [ ] As a manager, I want to be able to provide descriptions, set priorities, and deadlines for each task.
- [ ] As a manager, I want to be able to create projects that group related tasks together.
- [ ] As a manager, I want to be able to view my team's tasks by assignee, status, project, and priority.
- [ ] As a manager, I want to be able to monitor task progress and update tasks as needed.

### Team Member

- [ ] As a team member, I want to be able to login and edit my account profile.
- [ ] As a team member, I want to be able to log in and out of my account.
- [ ] As a team member, I want to be able to view my assigned tasks, deadlines, and priorities in one place.
- [ ] As a team member, I want to be able to create the comment to the tasks, mark them as complete.
- [ ] As a team member, I want to be able to collaborate with my team members by sharing files or resources related to the tasks.

### Authentication

- [ ] As a manager, I can create an account and log in/out of the manager’s app.
- [ ] As a manager, I can create member account.
- [ ] As a team member, I can login my account through a created account by manager
- [ ] As a team member, I can log in and out of the app using my credentials.

### Project and Management

- [ ] As a manager, I can create a project with a title and description, and add tasks to it.
- [ ] As a manager, I can create new tasks by entering a title, description, and selecting a project or category.
- [ ] As a manager, I can view projects and tasks in different views.
- [ ] As a manager, I can assign tasks to myself or to team members by selecting from a list of users.
- [ ] As a manager, I can add priority and deadline to tasks.
- [ ] As a team member, I can view all my assigned tasks in one place.
- [ ] As a team member, I can update the status of my assigned tasks as their progress.

### Team Collaboration

- [ ] As a team member, I can view other members’ tasks.
- [ ] As a team member or manager, I can leave comments on other members' tasks.
- [ ] As a team member or manager, I can share reference document on other members' tasks or my task.

## Endpoint APIs

### Auth APIs

```javascript
/**
 * @route POST /auth/login
 * @description Log in with email and password as manager or teamMember
 * @body {email, password, role}
 * @access Public
 */
```

### Me APIs

```javascript
/**
- @route GET /me
- @description Get current user info
- @access Login required
*/
```

```javascript
/**
- @route PUT /me
- @description UPDATE USER PROFILE
- @access Login required
- @body { name, avatarUrl, shortDescription, Phone , Languages , jobTitle, facebookLink, instagramLink, linkedinLink, twitterLink }
*/
```

### User APIs

```javascript
/**
 * @route POST /users
 * @description Register new user as Manager
 * @body {name, email, password, role}
 * @access Public
 */
```

```javascript
/**
 * @route POST /users/member
 * @description Register new user for team member. only manager can do
 * @body {name, email, password, role}
 * @access manager login required
 */
```

```javascript
/**
 * @route GET /users?page=1&limit=10
 * @description Get user with page and limit and search by name
 * @access Login required
 */
```

```javascript
/**

- @route GET /users/:id
- @description Get a user profile
- @access Login required
*/
```

```javascript
/**

- @route Delete /users/:id
- @description delete user(member) 
- @access Login required
*/
```

<!-- the actions related directly to edit, create, delete must be handle by manager -->

### Project API

```javascript
/**
- @route GET /projects?page=1&limit=10
- @description Get all projects with pagination 
- @access Login required
*/
```

```javascript
/**
 * @route POST /projects
 * @description Create a new project
 * @body { title, description,Budget, startDate,enddate , createdBy, priority, status }
 * @access login required
 */
```

<!-- project should be updated by manager -->

```javascript
/**
 * @route PUT /projects/:id
 * @description Update project/ edit project
 * @body { title, description,Budget, startDate, priority, status}
 * @access login required
 */
```

```javascript
/**
 * @route DELETE /projects/:id
 * @description Delete a project
 * @access login required
 */
```

```javascript
/**
 * @route GET /projects/:id
 * @description Get detail of single project
 * @access Login required
 */
```

```javascript
/**
 * @route put /projects/:id/assign
 * @description // Assign project to user by ID
 * @access Login required
 */
```

```javascript
/**
 * @route put /projects/:id/assignees
 * @description // Assign project to users by ID
 * @access Login required
 */
```

```javascript
/**
 * @route put /projects/:id/unassign
 * @description // unAssign project from user by ID
 * @access Login required
 */
```

```javascript
/**
 * @route GET /projects/:id/tasks
 * @description Get tasks of a projects
 * @access Login required
 */
```

```javascript
/**
 * @route GET /projects/:id/tasks/status
 * @description Get tasks of a projects by status
 * @access Login required
 */
```

```javascript
/**
 * @route GET /projects/:id/tasks/status
 * @description Get tasks of a projects by status
 * @access Login required
 */
```

```javascript
/**
 * @route PUT /projects/:id/tasks/reorder
 * @description update  task order, task status  of a projects by drag and drop feature
 * @access Login required
 */
```

### Task API

<!-- the actions related directly to edit, create, delete task must be handle by manager -->

```javascript
/**
 * @route GET /tasks?page=1&limit=10
 * @description Get tasks
 * @access Login required
 */
```

```javascript
/**
 * @route GET /tasks/:id
 * @description Get details of a task
 * @access Login require
 */
```

```javascript
/**
 * @route POST /tasks
 * @description create a new task
 * @body { title, description, startdate,enddate, status, projectID, createdBy, assignees ,priority }
 * @access Login required
 * /
```

```javascript
/**
 * @route PUT /tasks/:id
 * @description Update a task/edit task
 *{ title, description, startdate,enddate, status, createdBy, AssignedTo , priority}
 * @access Login required
 * /
```

```javascript
/**
 * @route put /tasks/:id/assign
 * @description // Assign task to user by ID
 * @access Login required
 */
```

```javascript
/**
 * @route put /projects/:id/unassign
 * @description // unAssign task from user by ID
 * @access Login required
 */
```

```javascript
/**
 * @route DELETE /tasks/:id
 * @description Delete a task
 * @access Login required
 * /
```

```javascript
/**
 * @route GET /tasks/:id/comments
 * @description get comments of a task
 * @access Login required
 * /
```

### comment APis

```javascript
/**
 * @route POST /comments
 * @description create new comments
 * @body {comment, TaskID, commentUser,referenceDocument}
 * @access Login required
 * /
```

```javascript
/**
 * @route PUT /comments/:id
 * @description edit comment
 * @body {comment}
 * @access Login required
 * /
```

```javascript
/**
 * @route DELETE /comments/:id
 * @description delete comment
 * @access Login required
 * /
```

```javascript
/**
 * @route GET /comments/:id
 * @description get details of comment
 * @access Login required
 * /
```
## TASK ME ERD diagram
![taskme ERD image](https://github.com/peterT23/fullstack-task-managerment-app-FE/blob/main/task_me_ERD.png)

## Image of Project
<img width="1440" alt="Screenshot 2024-08-12 at 22 37 17" src="https://github.com/user-attachments/assets/21a938c1-f850-42a1-9a0e-8de503218a73">
<img width="1440" alt="Screenshot 2024-08-12 at 22 37 11" src="https://github.com/user-attachments/assets/4d2e27db-a746-4f45-961e-b9e669cbfab0">
<img width="1440" alt="Screenshot 2024-08-12 at 22 37 02" src="https://github.com/user-attachments/assets/71a2c538-1eeb-4ff8-aa28-6ace428dc600">
<img width="1440" alt="Screenshot 2024-08-12 at 22 36 54" src="https://github.com/user-attachments/assets/723894a1-0c65-4b46-801a-0bb412a9a004">
<img width="1440" alt="Screenshot 2024-08-12 at 22 36 47" src="https://github.com/user-attachments/assets/3ececd1f-dd9a-4026-a956-d8873f1afbab">
<img width="1440" alt="Screenshot 2024-08-12 at 22 36 37" src="https://github.com/user-attachments/assets/dfa563c4-6def-480c-8145-44fcb8cdc94e">

## Tech stacks

## Tech Stack

### Frontend
- ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) **ReactJS**: A JavaScript library for building user interfaces.
- ![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white) **React Hook Form**: For handling form inputs with minimal re-renders.
- ![React Router](https://img.shields.io/badge/React%20Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white) **React Router DOM**: For routing and navigation between views.
- ![Yup](https://img.shields.io/badge/Yup-ffac45?style=for-the-badge) **Yup Validator**: For schema validation and form data validation.
- ![Redux](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white) **Redux Toolkit**: For efficient state management.
- ![DnD Kit](https://img.shields.io/badge/DnD%20Kit-4B0082?style=for-the-badge&logo=html5&logoColor=white) **DnD Kit**: For drag-and-drop functionality.
- ![Material-UI](https://img.shields.io/badge/Material%20UI-0081CB?style=for-the-badge&logo=mui&logoColor=white) **Material-UI**: For sleek, responsive UI components.

### Backend
- ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node-dot-js&logoColor=white) **Node.js**: For running JavaScript on the server.
- ![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge) **Express.js**: A web application framework for Node.js.
- ![Express Validator](https://img.shields.io/badge/Express%20Validator-ff6347?style=for-the-badge) **Express Validator**: For validating and sanitizing form data.
- ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white) **MongoDB**: A NoSQL database for storing application data.

These technologies together provide a robust foundation for building a fully-featured task management application.




linkDemo : [https://taskme-fe.netlify.app](https://taskme-fullstack.netlify.app/)
I am using render.com to upload my free Back-end server so it takes time to load everything on screen. please wait for it!
