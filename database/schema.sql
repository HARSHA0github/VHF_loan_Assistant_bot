-- ==========================================================
-- VHF Bank Loan Assistant - Database Schema
-- Database: loanbot
-- Target RDBMS: MySQL 8.0+
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `loanbot` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `loanbot`;

-- 1. User Accounts Table
CREATE TABLE IF NOT EXISTS `user_accounts` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. User Profiles Table
CREATE TABLE IF NOT EXISTS `user_profile` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `income` VARCHAR(255),
    `cibil` VARCHAR(255),
    `eligibility` VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. KYC Records Table (Aadhaar eKYC Verification)
CREATE TABLE IF NOT EXISTS `kyc_records` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255),
    `address` VARCHAR(1000),
    `mobile_hash` VARCHAR(255),
    `verified_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Chat History Table
CREATE TABLE IF NOT EXISTS `chat_history` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(255) NOT NULL,
    `role` VARCHAR(50) NOT NULL COMMENT 'user or bot',
    `content` TEXT NOT NULL,
    `message_type` VARCHAR(50) NOT NULL COMMENT 'text or file',
    `file_name` VARCHAR(255),
    `timestamp` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_chat_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Loan Q&A Knowledge Base Table
CREATE TABLE IF NOT EXISTS `loanqa` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `question` VARCHAR(255),
    `answer` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
