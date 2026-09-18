# VHF Bank - AI Loan Assistant

An intelligent, full-stack banking assistant application that streamlines the loan inquiry and verification process. It features a modern Glassmorphism frontend and a Spring Boot backend integrated with Large Language Models (via OpenRouter) and Aadhaar eKYC XML verification.

---

## 🏗️ Architecture & Tech Stack

- **Backend**:
  - Java 17+
  - Spring Boot 3.3.4 (Spring Web, Spring Data JPA)
  - MySQL Database (`loanbot`)
  - OpenRouter AI API (LLM inference)
  - Zip4j & OpenCSV
- **Frontend (`loan-buddy-frontend`)**:
  - React 18 & TypeScript
  - Vite
  - Tailwind CSS & PostCSS
  - Framer Motion & Lucide Icons

---

## 📋 Prerequisites

Before running the application, ensure you have the following installed:

1. **Java Development Kit (JDK 17 or higher)**
   - Verify with: `java -version`
2. **Node.js (v18 or higher) and npm**
   - Verify with: `node -v` and `npm -v`
3. **MySQL Server** (running locally on port `3306`)
4. **OpenRouter API Key** (sign up and obtain a key from [openrouter.ai](https://openrouter.ai/))

---

## ⚙️ Configuration & Setup

### 1. Database Setup
Log in to your MySQL command line or workbench and create the database:
```sql
CREATE DATABASE loanbot;
```
*(Spring Boot's Hibernate will automatically generate the required tables upon startup).*

### 2. Configure Environment Variables
In the project root directory, copy the template `.env.example` to `.env`:

**Windows (Command Prompt / PowerShell):**
```powershell
copy .env.example .env
```

**Linux / macOS:**
```bash
cp .env.example .env
```

Open the newly created `.env` file and enter your actual credentials:
```properties
# OpenRouter API Key
OPENROUTER_API_KEY=your_actual_openrouter_api_key_here

# OpenRouter Model (e.g., liquid/lfm-2.5-2.6b:free, google/gemini-2.5-pro, etc.)
OPENROUTER_MODEL=liquid/lfm-2.5-2.6b:free

# MySQL Credentials
DB_USER=root
DB_PASS=your_actual_mysql_password
```

> [!WARNING]
> Never commit your `.env` file to version control. It is already included in `.gitignore`.

---

## 🚀 Running the Project

### Option A: One-Click Launch (Windows)
Run the automated batch script from the root folder:
```cmd
run-loan-assistant.bat
```
This will automatically launch the Spring Boot backend and the Vite frontend in separate terminal windows.

---

### Option B: Manual Startup

#### Step 1: Start the Backend (Spring Boot)
From the project root:
```bash
# Windows
.\mvnw spring-boot:run

# Linux / macOS
./mvnw spring-boot:run
```
- The backend will start on **`http://localhost:8080`**.

#### Step 2: Start the Frontend (React + Vite)
Open a new terminal window, navigate into the frontend directory, install dependencies, and start the development server:
```bash
cd loan-buddy-frontend
npm install
npm run dev
```
- The frontend will start on **`http://localhost:5173`**.
- Open your browser and navigate to **`http://localhost:5173`**.

---

## 📁 Project Structure

```text
loanassistant_v3/
├── .env.example               # Template for environment variables
├── .gitignore                 # Git ignore rules for backend, frontend & secrets
├── pom.xml                    # Maven configuration and dependencies
├── mvnw / mvnw.cmd            # Maven wrapper scripts
├── run-loan-assistant.bat     # Windows one-click start script
├── src/                       # Spring Boot source code
│   └── main/
│       ├── java/com/harsha/loanassistant/
│       │   ├── controller/    # REST API Endpoints
│       │   ├── entity/        # JPA Database Entities
│       │   ├── repository/    # Spring Data Repositories
│       │   └── service/       # Business logic & LLM service
│       └── resources/
│           └── application.properties
└── loan-buddy-frontend/       # React + Vite frontend
    ├── src/                   # React components, pages, hooks
    ├── public/                # Static assets
    ├── package.json           # Frontend dependencies & scripts
    ├── vite.config.ts         # Vite build configuration (API proxy to :8080)
    └── tailwind.config.ts     # Tailwind CSS design system tokens
```

---

## 🚢 Pushing to GitHub

To push this repository to GitHub safely:

```bash
# 1. Initialize git (if not already done)
git init

# 2. Stage files
git add .

# 3. Verify that .env and node_modules are NOT staged
git status

# 4. Commit files
git commit -m "Initial commit: Loan Assistant fullstack application"

# 5. Connect and push to your GitHub repo
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY_NAME>.git
git push -u origin main
```
