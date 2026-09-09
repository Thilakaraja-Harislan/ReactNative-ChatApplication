## Project Title:
ReactNative-ChatApplication

## Purpose:
The purpose of this project is to develop a simple React Native mobile chat application to understand mobile application development, navigation, authentication, state management, API integration, database communication, and real-time messaging.

The application will first be developed for mobile devices and later extended to support web browsers using React Native Web.

## MVP Features

1. User Registration
2. User Login
3. View Registered Users
4. Select a User
5. Send One-to-One Text Messages
6. Receive Messages
7. View Previous Messages
8. Logout

## Functional Requirements

FR01 - A new user should be able to register.
FR02 - A registered user should be able to log in.
FR03 - A logged-in user should be able to view other registered users.
FR04 - A user should be able to select another user to start a conversation.
FR05 - A user should be able to send text messages.
FR06 - A user should be able to receive text messages.
FR07 - A user should be able to view previous conversation history.
FR08 - A user should be able to log out.
FR09 - Messages should later be updated in real time.
FR10 - The application should later support web browsers.

## Non-Functional Requirements

NFR01 - The user interface should be simple and mobile-friendly.
NFR02 - Passwords must not be stored as plain text.
NFR03 - Protected application features must require authentication.
NFR04 - User input must be validated.
NFR05 - The system should handle failed requests properly.
NFR06 - Messages must be stored persistently.
NFR07 - The initial application should support Android.
NFR08 - The architecture should support later web extension.

## Technology Stack

Frontend:
- React Native
- Expo
- Expo Router
- TypeScript

State Management:
- React Context API
- Custom Hooks

Forms:
- React Hook Form
- Yup

Backend:
- Node.js
- Express.js

Database:
- MySQL

Authentication:
- JWT
- bcrypt

Real-Time Communication:
- Socket.IO

Web:
- React Native Web

Development Tools:
- VS Code
- Postman
- Git
- GitHub

## Simple database design:
users
-----
id
name
email
password_hash
created_at

messages
--------
id
sender_id
receiver_id
message
created_at