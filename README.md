# VHF Bank - AI Loan Assistant

An intelligent, full-stack banking assistant application that streamlines the loan inquiry and verification process. It features a modern Glassmorphism frontend, a Spring Boot backend integrated with Large Language Models (via OpenRouter), and Aadhaar eKYC XML verification.

---

## 📁 Project Structure

The project is organized into dedicated directories for the backend, frontend, and database:

```text
loanassistant_v3/
├── backend/                      # Spring Boot (Java 17+) Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/harsha/loanassistant/
│   │   │   │   ├── controller/   # REST API Controllers (Auth, Chatbot)
│   │   │   │   ├── entity/       # JPA Entities (Chat, User, KYC, Q&A)
│   │   │   │   ├── repository/   # Spring Data Repositories
│   │   │   │   └── service/      # Services (LLM inference, KYC, CSV loader)
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── Q&A.csv       # Banking FAQ knowledge base
│   │   └── test/
│   ├── pom.xml                   # Maven dependencies & build config
│   ├── mvnw / mvnw.cmd           # Maven wrapper
│   └── .env.example              # Backend environment template
│
├── frontend/                     # React 18 + Vite + TypeScript Frontend
│   ├── src/
│   │   ├── components/           # UI and Chat components
│   │   ├── pages/                # Index, Dashboard, AuthPage
│   │   └── ...
│   ├── public/                   # Static assets & icons
│   ├── package.json              # NPM dependencies & scripts
│   ├── vite.config.ts            # Vite build configuration (proxies /api to :8080)
│   └── tailwind.config.ts        # Tailwind CSS theme configuration
│
├── database/                     # Database Setup & Scripts
│   ├── schema.sql                # Complete MySQL DDL table creation script
│   └── README.md                 # Database setup instructions
│
├── .env.example                  # Root template for environment credentials
├── .gitignore                    # Comprehensive ignore rules
├── run-loan-assistant.bat        # Windows one-click launcher for all services
└── README.md                     # Project documentation
```

---

## 🏗️ Tech Stack

- **Backend**: Java 17+, Spring Boot 3.3.4, Spring Data JPA, Hibernate, MySQL, OpenRouter AI, Zip4j, OpenCSV.
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide Icons.
- **Database**: MySQL 8.0+ (`loanbot`).

---

## 📋 Prerequisites

Ensure you have the following installed:

1. **Java Development Kit (JDK 17 or higher)**
   - Verify: `java -version`
2. **Node.js (v18 or higher) and npm**
   - Verify: `node -v` and `npm -v`
3. **MySQL Server** (running locally on port `3306`)
4. **OpenRouter API Key** (from [openrouter.ai](https://openrouter.ai/))

---

## ⚙️ Configuration & Setup

### 1. Database Setup
Ensure MySQL is running, then create the database:
```sql
CREATE DATABASE loanbot;
```
*(Spring Boot automatically generates the tables upon startup, or you can run `database/schema.sql` manually).*

### 2. Environment Variables Configuration
In the project root, create your `.env` file from `.env.example`:

**Windows:**
```powershell
copy .env.example .env
```

**Linux / macOS:**
```bash
cp .env.example .env
```

Open `.env` and configure your credentials:
```properties
# OpenRouter API Key
OPENROUTER_API_KEY=your_actual_openrouter_api_key_here

# OpenRouter Model
OPENROUTER_MODEL=liquid/lfm-2.5-2.6b:free

# MySQL Credentials
DB_USER=root
DB_PASS=your_actual_mysql_password
```

> [!WARNING]
> Never commit your real `.env` file to Git. It is excluded via `.gitignore`.

---

## 🚀 Running the Project

### Option A: One-Click Launch (Windows)
Double-click or execute the root batch script:
```cmd
run-loan-assistant.bat
```
This starts both the backend (`http://localhost:8080`) and frontend (`http://localhost:5173`) in two dedicated windows.

---

### Option B: Manual Startup

#### Step 1: Start the Backend
```bash
cd backend

# Windows
.\mvnw spring-boot:run

# Linux / macOS
./mvnw spring-boot:run
```
- The backend will start on **`http://localhost:8080`**.

#### Step 2: Start the Frontend
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
- The frontend will start on **`http://localhost:5173`**.
- Open your browser to **`http://localhost:5173`**.

---

## 🚢 Pushing to GitHub

```bash
# 1. Initialize git
git init

# 2. Stage all categorized files
git add .

# 3. Confirm that secrets (.env) and node_modules are NOT staged
git status

# 4. Commit files
git commit -m "feat: restructure into backend, frontend, and database directories"

# 5. Connect and push to GitHub
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY_NAME>.git
git push -u origin main
```
