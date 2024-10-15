# SimpleGTD: AI-Powered Productivity for ADHD
![Screen Recording Oct 15 (1)](https://github.com/user-attachments/assets/3b79668d-7386-4024-b0ba-1da7e7b1cd73)

## Table of Contents
- Introduction
- Features
- Tech Stack
- Architecture

## Introduction
SimpleGTD is a web application designed to boost productivity for individuals with ADHD. Using AI, SimpleGTD simplifies task management and provides personalized insights to help users stay focused and organized.
Visit the live application: https://simplegtd.co.uk

## Features
- **Streamlined Task Creation**: Intuitive interface for quick and easy task input
- **AI-Powered Prioritization**: Intelligent algorithm to automatically prioritize tasks based on importance
- **ADHD-Friendly Design**: Minimalist UI to reduce distractions and cognitive load
- **AI Insights**: Personalized hints and tips to improve productivity
- **Secure Authentication**: Robust user authentication and session management

## Tech Stack
### Frontend

- **TypeScript**: For type-safe, scalable code
- **React**: Building responsive and dynamic user interfaces
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **shadcn/ui**: High-quality React components for a polished look
- **Clerk**: Secure authentication and session management

### Backend

- **Django**: High-level Python web framework
- **PostgreSQL**: Robust, scalable database solution
- **OpenAI API**: Powering AI-driven task prioritization and insights

### DevOps & Hosting

- **Frontend**: DigitalOcean Droplet (VPS)
  - Nginx: Reverse proxy
  - PM2: Node.js process manager

- **Backend**: AWS Lightsail
  - Nginx: Reverse proxy
  - Gunicorn: WSGI HTTP Server

- **Database**: AWS RDS (PostgreSQL)
- **SSL**: Let's Encrypt for secure HTTPS connections

## Architecture
SimpleGTD follows a modern, scalable architecture:

1. **Client-Side**: React application served by Nginx on a DigitalOcean Droplet
2. **API Layer**: Django REST framework running on AWS Lightsail
3. **Database**: PostgreSQL instance on AWS RDS
4. **AI Integration**: Seamless integration with OpenAI API for task analysis
   
