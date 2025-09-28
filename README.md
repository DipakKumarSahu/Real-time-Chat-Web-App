# 💬 RealChat – Your Modern Real-Time Chat Application

<div align="center">

[![Spring Boot](https://img.shields.io/badge/SpringBoot-3.x-brightgreen?style=for-the-badge&logo=spring&logoColor=white)](https://spring.io/)
[![React](https://img.shields.io/badge/React-17-blue?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-2.2.19-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![WebSocket](https://img.shields.io/badge/WebSocket-Enabled-orange?style=for-the-badge&logo=websocket&logoColor=white)]()
[![H2 Database](https://img.shields.io/badge/Database-H2-lightgrey?style=for-the-badge&logo=database&logoColor=white)]()
[![JWT](https://img.shields.io/badge/Auth-JWT-yellow?style=for-the-badge&logo=jsonwebtokens&logoColor=black)]()
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge&logo=opensource&logoColor=white)]()

*A feature-rich, real-time messaging platform built with modern web technologies*



</div>

---

## 🎯 About RealChat

**RealChat** is more than just another chat application – it's your **secure, modern, and lightning-fast messaging platform** designed for the real world. Whether you're coordinating with your team, catching up with friends, or managing group projects, RealChat delivers a seamless communication experience with enterprise-grade security.

> 🌟 **Why Choose RealChat?** Imagine logging in after a busy day and seeing all your messages waiting for you, complete with online status indicators and smart notification badges. No more missed conversations, no more wondering who's available – just pure, uninterrupted communication.

---

## ✨ Key Highlights

<table>
<tr>
<td>🚀</td>
<td><strong>Instant Messaging</strong><br/>Messages appear in real-time without any page refresh</td>
</tr>
<tr>
<td>🔒</td>
<td><strong>Bank-Level Security</strong><br/>JWT authentication with Spring Security integration</td>
</tr>
<tr>
<td>📱</td>
<td><strong>Responsive Design</strong><br/>Perfect experience on desktop, tablet, and mobile</td>
</tr>
<tr>
<td>🔔</td>
<td><strong>Smart Notifications</strong><br/>Never miss important messages with intelligent badge counters</td>
</tr>
<tr>
<td>⚡</td>
<td><strong>Lightning Fast</strong><br/>WebSocket technology ensures zero-latency communication</td>
</tr>
<tr>
<td>💾</td>
<td><strong>Persistent Storage</strong><br/>All your conversations safely stored and retrievable</td>
</tr>
</table>

---

## 🌟 Features Deep Dive

### 🔐 **Authentication & Security**
- **JWT Token-Based Authentication**: Secure, stateless authentication system
- **Spring Security Integration**: Enterprise-grade security implementation  
- **Session Management**: Automatic token refresh and secure logout

### 💬 **Messaging Capabilities**
- **Private Chat**: Secure 1-to-1 conversations with end-users
- **Group Chat**: Multi-participant conversations with real-time updates
- **Message History**: Complete conversation history with pagination
- **Message Status**: Delivery and read receipts for better communication
- **Typing Indicators**: See when someone is typing in real-time

### 🔔 **Smart Notifications**
- **Unseen Message Counter**: Red badge indicators for unread messages
- **Online/Offline Status**: Real-time user presence indicators
- **Message Timestamps**: Precise timing for all communications
- **Active User List**: See who's currently online and available

### 🎨 **User Experience**
- **Modern UI/UX**: Clean, intuitive interface built with Tailwind CSS
- **Responsive Design**: Seamless experience across all device sizes
- **Emoji Support**: Express yourself with a full range of emojis


---

## 🛠 Tech Stack

<div align="center">

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

### Backend
![Spring Boot](https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot)
![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=Spring-Security&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-010101?style=for-the-badge&logo=socketdotio&logoColor=white)

### Database & Storage
![H2](https://img.shields.io/badge/H2-31A8FF?style=for-the-badge&logo=h2&logoColor=white)
![JPA](https://img.shields.io/badge/JPA-59666C?style=for-the-badge&logo=hibernate&logoColor=white)

### Tools & Deployment
![Maven](https://img.shields.io/badge/Apache%20Maven-C71A36?style=for-the-badge&logo=Apache%20Maven&logoColor=white)
![Git](https://img.shields.io/badge/GIT-E44C30?style=for-the-badge&logo=git&logoColor=white)

</div>

---

## 📸 Screenshots & Demo Images

<div align="center">

### 🏠 Home Page
*Welcome page with navigation to login and signup*
<br/>
![Home Page](https://github.com/user-attachments/assets/3e31b927-76a8-4abe-85db-01517ac60d38)
![home2](https://github.com/user-attachments/assets/3a96d559-300d-4be3-9281-13702ea1ca83)



### ✍️ Signup Page
*User registration with validation and secure input*
<br/>
![signup](https://github.com/user-attachments/assets/9b297a42-47ab-4342-90c6-204bdc88e01b)


### 🔐 Login Page
*Secure login using JWT authentication*
<br/>
![login](https://github.com/user-attachments/assets/dc8c7e3d-a665-4102-9727-d296d1f1c635)


### 👥 Group Chat
*Multi-participant chat with real-time messaging and online status*
<br/>
![groupchat](https://github.com/user-attachments/assets/f146682f-1f42-4628-8029-24bb18877836)


### 💬 Private Chat
*Direct 1-to-1 messaging with typing indicators*
<br/>
![private chat](https://github.com/user-attachments/assets/33d48e60-3cd8-41d7-9e56-9d6a4916524e)


### 🔔 Unseen Message Count
*Red badge showing number of unread messages*
<br/>
![unseen_count](https://github.com/user-attachments/assets/c6fb5e84-2352-4bd5-920b-d96741d6fa68)


</div>

---


## 🏗 System Architecture

```
┌─────────────────┐    ┌───────────────────┐    ┌─────────────────┐
│   React Client  │    │   Spring Boot     │    │   H2            │
│                 │    │   Application     │    │   Database      │
├─────────────────┤    ├───────────────────┤    ├─────────────────┤
│ • Tailwind CSS  │◄──►│ • JWT Auth        │◄──►│ • User Data     │
│ • WebSocket     │    │ • WebSocket       │    │ • Messages      │
│ • State Mgmt    │    │ • REST APIs       │    │ • Chat History  │
│ • Responsive UI │    │ • Spring Security │    │                 │
└─────────────────┘    └───────────────────┘    └─────────────────┘
```

### 🔄 **Real-time Communication Flow**
1. **Authentication**: User logs in → JWT token issued
2. **Connection**: WebSocket connection established with token validation
3. **Messaging**: Real-time message exchange through STOMP protocol
4. **Persistence**: Messages stored in database for history
5. **Notifications**: Unseen message counters updated instantly

---

## ⚙️ Installation & Setup

### 📋 Prerequisites
- **Java 17+** (JDK)
- **Node.js 16+** and npm
- **Git** for version control
- **Maven 3.8+** for backend build


### 👤 **User Registration & Login**
1. Navigate to the registration page
2. Create your account with username, email, and password
3. Login with your credentials to receive a JWT token
4. Start chatting immediately!

### 💬 **Starting a Chat**
- **Private Chat**: Click on any user from the online users list
- **Group Chat**: Create a new group and add participants
- **Message Features**: Send text, emojis, and see real-time typing indicators

### 🔔 **Managing Notifications**
- Red badges show unseen message counts
- Click on any chat to mark messages as read
- Online/offline status updates automatically

## 📸 Screenshots

<div align="center">

### 🔐 Authentication
*Secure login with modern UI design*

### 💬 Private Chat
*Clean, intuitive chat interface with real-time messaging*

### 👥 Group Chat
*Multi-participant conversations with online status*

### 📱 Mobile Responsive
*Perfect mobile experience with touch-optimized controls*

</div>

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:


## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### ⭐ **Show Your Support**
If you find RealChat useful, please consider:
- ⭐ Starring this repository
- 🐦 Following us on social media
- 📢 Sharing with your friends and colleagues
- 💝 Contributing to the project

---

<div align="center">

### 🎉 **Built with ❤️ by the RealChat Team**

*Making real-time communication accessible, secure, and enjoyable for everyone.*

[![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge)]()
[![Open Source](https://img.shields.io/badge/Open%20Source-💚-green?style=for-the-badge)]()

</div>
