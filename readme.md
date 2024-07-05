# Company task management

## Functional specification

Company Task Management is a web app that allows team managers and their team members to create and manage tasks. The app is designed to help individuals and teams stay organized and on track with their daily tasks and projects.

Manager can register an account

Managers can invite new team members to the project. Each user provides a name, an email, and a password to create an account. Team members cannot register by themselves but need a manager's email invitation to set up their accounts.

After joining, users can manage their profiles, view and manage tasks, receive notifications, and collaborate with team members.

## User Stories

### Manager

- [ ] As a manager, I want to be able to invite new team members to set up their accounts with their provided information (email, name).
- [ ] As a manager, I want to be able to create a Project that will include task further
- [ ] As a manager, I want to be able to add or invite user to team Members of the project
- [ ] As a manager, I want to be able to create and assign tasks to specific team members .
- [ ] As a manager, I want to be able to provide descriptions, set priorities, and deadlines for each task.
- [ ] As a manager, I want to be able to create projects that group related tasks together.
- [ ] As a manager, I want to be able to view my team's tasks by assignee, status, project, and priority.
- [ ] As a manager, I want to be able to monitor task progress and update tasks as needed.
- [ ] As a manager, I want to be able to receive notifications and reminders related to the tasks I created.

### Team Member

- [ ] As a team member, I want to be able to set up my account through an invitation.
- [ ] As a team member, I want to be able to log in and out of my account.
- [ ] As a team member, I want to be able to view my assigned tasks, deadlines, and priorities in one place.
- [ ] As a team member, I want to be able to receive notifications and reminders related to my tasks.
- [ ] As a team member, I want to be able to update the status of my tasks, mark them as complete, and provide comments or notes as necessary.
- [ ] As a team member, I want to be able to collaborate with my team members by sharing files or resources related to the tasks.

### Authentication

- [ ] As a manager, I can create an account and log in/out of the manager’s app.
- [ ] As a team member, I can set up my account through a manager’s email invitation.
- [ ] As a team member, I can log in and out of the app using my credentials.

### Task Management

- [ ] As a manager, I can create a project with a title and description, and add tasks to it.
- [ ] As a manager, I can create new tasks by entering a title, description, and selecting a project or category.
- [ ] As a manager, I can view projects and tasks in different views (by project, by assignee, by status, etc.).
- [ ] As a manager, I can assign tasks to myself or to team members by selecting from a list of users.
- [ ] As a manager, I can add priority and deadline to tasks.
- [ ] As a team member, I can view all my assigned tasks in one place.
- [ ] As a team member, I can assign tasks to myself if the created task doesn’t have an assignee.
- [ ] As a team member, I can update the status of my assigned tasks as they progress.

### Team Collaboration

- [ ] As a team member, I can view other members’ tasks.
- [ ] As a team member or manager, I can leave comments on other members' tasks.

### Reminder & Notification

- [ ] As a manager, I can receive in-app notifications about task status updates by team members.
- [ ] As a team member, I can receive in-app notifications about changes made by my manager to my tasks.

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
 * @access Public
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
- @route GET /users/me
- @description Get current user info
- @access Login required
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

```javascript
/**
- @route PUT /users/:id
- @description Update user profile (edit user profile)
- @body { name, avatarUrl, shortDescription, Phone ,Skills, Strength , Languages , jobTitle, facebookLink, instagramLink, linkedinLink, twitterLink }
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
 * @route GET /projects/:id/tasks
 * @description Get tasks of a projects
 * @access Login required
 */
```

### Task API

<!-- the actions related directly to edit, create, delete task must be handle by manager -->

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
 * @body { title, description, startdate,enddate, status, projectID, createdBy, AssignedTo ,priority }
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
 * @body {comment, commentDate, TaskID, commentUser}
 * @access Login required
 * /
```

```javascript
/**
 * @route PUT /comments/:id
 * @description edit comment
 * @body {comment, commentDate}
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

### referenceDocument API

```javascript
/**
 * @route POST /references
 * @description Save a reference document to task or comment
 * @body { targetType: 'task' or 'Comment', targetId, name, referenceDocumentUrl }
 * @access Login required
 * /
```

```javascript
/**
 * @route PUT /references/:id
 * @description edit a reference document to task or comment
 * @body {  name, referenceDocumentUrl }
 * @access Login required
 * /
```

```javascript
/**
 * @route delete /references/:id
 * @description delete a reference document of task or comment
 * @access Login required
 * /
```

```javascript
/**
 * @route Get /references/:id
 * @description get single reference
 * @access Login required
 * /
```

### notitfications

<!-- after each action above we must create a new notification  -->

```javascript
/**
 * @route POST /notifications
 * @description create new notifications
 * @body {comment, commentDate, TaskID, commentUser}
 * @access Login required
 * /
```

```javascript
/**
 * @route PUT /notifications/:id
 * @description Edit notification
 * @body {message, isRead}
 * @access Login required
 */
```

```javascript
/**
 * @route DELETE /notifications/:id
 * @description Delete notification
 * @access Login required
 */
```

```javascript
/**
 * @route GET /notifications/:id
 * @description Get details of notification
 * @access Login required
 */
```
