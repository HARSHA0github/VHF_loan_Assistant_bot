# Database Configuration - Loan Assistant

This directory contains the database initialization scripts for the VHF Bank Loan Assistant application.

---

## Database Details

- **Database Name**: `loanbot`
- **Default Port**: `3306`
- **RDBMS**: MySQL 8.0+

---

## Setup Options

### Option 1: Automatic Table Creation (Recommended)
Spring Boot is configured with `spring.jpa.hibernate.ddl-auto=update`. 

You only need to ensure the database exists in MySQL:
```sql
CREATE DATABASE loanbot;
```
Once the Spring Boot backend starts up, it will automatically create all tables and indexes.

---

### Option 2: Manual Import via Schema Script
You can manually run the `schema.sql` script into your MySQL instance:

**Via MySQL CLI:**
```bash
mysql -u root -p < schema.sql
```

**Via MySQL Workbench / DBeaver / phpMyAdmin:**
1. Open `schema.sql` in your SQL editor.
2. Execute all statements to create the `loanbot` database and its tables.

---

## Tables Overview

| Table Name | Description |
| :--- | :--- |
| `user_accounts` | User login credentials and registration timestamps |
| `user_profile` | Income, CIBIL score, and loan eligibility evaluations |
| `kyc_records` | Aadhaar eKYC verification records (name, address, hashed contact) |
| `chat_history` | Persistent chat history between user and AI bot |
| `loanqa` | Banking FAQs and loan question-answer knowledge base (populated from `Q&A.csv`) |
