Here's a README file based on your implementation details:  

---

# Full-Stack WebSocket Chat System  

## Overview  
This project is a real-time chat application built using WebSockets. It enables multiple users to communicate in real-time with features like connection handling, message validation, and optional private messaging.  

## Tech Stack  
- **Backend**: Node.js, Express.js, WebSocket.io, MongoDB  
- **Frontend**: React.js, Context API, WebSocket API, TailwindCSS  

## Features  
✅ Real-time messaging via WebSockets  
✅ Broadcast messages to all connected clients  
✅ User-friendly chat UI with message display  
✅ Connection handling (disconnect, reconnect)  
✅ Input validation to prevent empty messages  
✅ Private messaging (Bonus Feature)  
✅ Chat history stored in MongoDB (Bonus Feature)  

## Project Structure  
### Backend (`chat-live-backend`)  
- `server.js` – WebSocket server with Express  
- `models/Message.js` – Mongoose schema for storing messages  
- `routes/chat.js` – API endpoints for retrieving chat history  

### Frontend (`chat-live-frontend`)  
- `components/Chat.js` – Chat UI component  
- `context/ChatContext.js` – WebSocket connection management  
- `pages/index.js` – Main chat page  

## Setup Instructions  
### Backend  
1. Clone the repository:  
   ```bash
   git clone https://github.com/mathiyazhagan-d/chat-live-backend.git
   cd chat-live-backend
   ```  
2. Install dependencies:  
   ```bash
   npm install
   ```  
3. Start the server:  
   ```bash
   node server.js
   ```  
4. The WebSocket server will run on `ws://localhost:5000`  

### Frontend  
1. Clone the repository:  
   ```bash
   git clone https://github.com/mathiyazhagan-d/chat-live-frontend.git
   cd chat-live-frontend
   ```  
2. Install dependencies:  
   ```bash
   npm install
   ```  
3. Start the frontend:  
   ```bash
   npm run dev
   ```  
4. Open `http://localhost:3000` in the browser  

## Screenshots  
(Add the 6 screenshots you took here)  

## Additional Notes  
- Implemented **context API** to manage WebSocket connections globally.  
- Used **MongoDB** for chat history storage with a simple REST API.  
- Improved UI/UX with **TailwindCSS** for responsiveness.  
- Handled edge cases: empty messages, connection loss, auto-reconnect.  

login
<img src="./public/screenshot/img (1).png" alt="ans-1">

signup
<img src="./public/screenshot/img (2).png" alt="ans-2">


<img src="./public/screenshot/img (3).png" alt="ans-3">
<img src="./public/screenshot/img (4).png" alt="ans-4">
<img src="./public/screenshot/img (5).png" alt="ans-5">
<img src="./public/screenshot/img (6).png" alt="ans-6">

## Author  
👨‍💻 **Mathiyazhagan D**  

