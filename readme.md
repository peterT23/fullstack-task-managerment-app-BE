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
![taskmanagement app ERD image](https://github.com/peterT23/fullstack-task-managerment-app-FE/blob/main/task_me_ERD.png)

linkdemo: https://taskme-fe.netlify.app
