# 🏛️ JanSamvaad (Public Dialogue)

**Empowering Citizens, Connecting Leaders.**
A next-generation civic grievance platform that bridges the gap between citizens and their elected representatives (MLAs & MPs) using AI technology.

![Status](https://img.shields.io/badge/Status-Active-success)
![Tech](https://img.shields.io/badge/Stack-MERN%20%2B%20Firebase-blue)

## 🌟 Overview
**JanSamvaad** solves the disconnect between voters and their constituencies. Instead of navigating complex government portals, citizens simply:
1.  **Enter their PIN Code** 📍 (Auto-detects Constituency, MLA, and MP).
2.  **File a Grievance** 📝 (AI-validated for clarity and category).
3.  **Track Progress** 📊 (Real-time dashboard with active/resolved stats).

It features a **Premium UI**, **AI Chatbot Assistant**, and a **Secure MongoDB Backend**.

## ✨ Key Features
*   **📍 Smart Constituency Locator:** Enter a 6-digit PIN, and get instant details of your assembly and parliamentary constituency.
*   **🤖 AI-Powered Validation:** OpenAI integrates to validate complaints, suggest categories (Water, Roads, Education), and filter spam before submission.
*   **💬 JanSamvaad Sahayak (Chatbot):** A context-aware AI assistant that guides users through the civic process in natural language.
*   **📊 Live Dashboard:** Real-time statistics showing active vs. resolved cases specific to the user's locality.
*   **🔐 Secure Authentication:** Powered by Firebase Auth for robust login/signup.
*   **📁 Evidence Upload:** Support for image/document attachments with grievances.

## 🛠️ Tech Stack
*   **Frontend:** React.js, Vite, CSS Modules (Glassmorphism Design).
*   **Backend:** Node.js, Express.js.
*   **Database:** MongoDB Atlas (for Grievances & Stats).
*   **Auth:** Firebase Authentication.
*   **AI:** OpenAI API (GPT-4o-mini).
*   **Icons:** Lucide React.

## 🚀 Getting Started

### Prerequisites
*   Node.js installed.
*   MongoDB Atlas connection string.
*   Firebase Project (for Auth).
*   OpenAI API Key.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/jansamvaad.git
    cd jansamvaad
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables:**
    Create a `.env` file in the root:
    ```env
    VITE_FIREBASE_API_KEY=your_key
    VITE_OPENAI_API_KEY=your_key
    MONGODB_URI=your_mongo_connection_string
    ```

4.  **Run Locally:**
    ```bash
    # Start Backend
    node server/index.js

    # Start Frontend (in a new terminal)
    npm run dev
    ```

## 🤝 Contribution
Built for the **Buildathon**. Contributions are welcome!

## 📄 License
MIT
