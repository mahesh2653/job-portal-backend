# 🚀 Job Portal - Backend (Node.js + Express + MongoDB)

## 📌 Overview

This repository contains the **backend** code for the **Job Portal** web application built using **Node.js**, **Express.js**, and **MongoDB**.

It powers features like **user authentication**, **role-based access**, **job listing management**, **job applications**, and **dashboard data** for both **Employers** and **Job Seekers**.

---

## 🔧 Tech Stack

- **Node.js** + **Express.js** (Server)
- **MongoDB** + **Mongoose** (Database)
- **JWT** (Authentication)
- **CORS**, **dotenv**, **Joi**, (Middlewares & Tools)

---

## 🚀 Features

### ✅ Authentication & Authorization

- User registration & login (with JWT)
- Role-Based Access Control (Employer / Job Seeker)
- Middleware for protecting routes

### 💼 Job Listings

- Employers can create, update, delete job posts
- Public endpoints for viewing, searching, and filtering jobs
- Pagination and search with regex support

### 📄 Applications

- Job Seekers can apply to jobs
- Employers can view applicants for their jobs
- Application status tracking and filtering

### 📊 Dashboards

- Employer dashboard: See job count, application count, analytics
- Job Seeker dashboard: Track applied jobs and statuses

---

## 📦 Folder Structure

```bash
├── config
├── controller
├── middleware
├── model
├── routes
├── services
├── utils
├── validator
├── .env
├── index.ts
```
