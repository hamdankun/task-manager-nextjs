Next.js Senior Technical Test – Clean Architecture

Objective

Build a Next.js application “Task Manager” that allows collaborative task management.

The goal is to evaluate your ability to:

- Design a scalable and modular architecture.
- Properly separate Domain / Data / Presentation layers.
- Apply Clean Architecture principles (dependency rule, testability).
- Write clean, maintainable, and evolvable code.

Required Features

Authentication
- User login with email & password.
- User signup.

Task Management
- Create a task (title, description, status: “to do / in progress / done”).
- Edit / Delete a task
- List all tasks.
- Filter tasks by status

Future Scalability
- The code should be designed in a way that it can easily evolve in the future, for example:
- Support multiple projects (each containing several tasks).
- Add a notification system.

Technical Requirements

Architecture must follow Clean Architecture principles:
- Domain Layer: Entities, use cases
- Data Layer: Repositories (Use server action).
- Presentation Layer: UI + State Management
- Unit tests are required on Domain use cases.