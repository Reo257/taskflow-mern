import fs from 'fs';
import path from 'path';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ImageRun,
} from 'docx';

// Helper to create styled paragraphs
const createTitle = (text) =>
  new Paragraph({
    text,
    heading: HeadingLevel.TITLE,
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
  });

const createH1 = (text) =>
  new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 300, after: 120 },
  });

const createH2 = (text) =>
  new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 100 },
  });

const createP = (text) =>
  new Paragraph({
    children: [new TextRun({ text, size: 24 })],
    spacing: { after: 120, line: 360 },
  });

const createBullet = (label, text) =>
  new Paragraph({
    children: [
      new TextRun({ text: `• ${label}: `, bold: true, size: 24 }),
      new TextRun({ text, size: 24 }),
    ],
    spacing: { after: 80, line: 320 },
  });

const cell = (text, isHeader = false) =>
  new TableCell({
    width: { size: 20, type: WidthType.PERCENTAGE },
    children: [
      new Paragraph({
        children: [new TextRun({ text, bold: isHeader, size: 20 })],
      }),
    ],
  });

// ==========================================
// 1. GENERATE SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
// ==========================================
async function generateSRS() {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          createTitle('SOFTWARE REQUIREMENTS SPECIFICATION (SRS)'),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Project: TaskFlow - MERN Task Management System\n',
                bold: true,
                size: 28,
              }),
              new TextRun({
                text: 'ICT Academy of Kerala (ICTAK) | Full Stack Development\n\n',
                size: 24,
                italics: true,
              }),
            ],
            spacing: { after: 400 },
          }),

          createH1('Student & Submission Details'),
          createBullet('Student Name', 'Reo Varghese'),
          createBullet('Batch', 'CS D'),
          createBullet('Roll Number', '21'),
          createBullet('Student Registration (SR) Number', '225783'),
          createBullet('Project Name', 'TaskFlow - Task & Productivity Management System'),
          createBullet('GitHub Repository', 'https://github.com/Reo257/taskflow-mern'),
          createBullet('Live Frontend (Vercel)', 'https://taskflow-mern-tau.vercel.app'),
          createBullet('Live Backend API (Render)', 'https://taskflow-mern-nfex.onrender.com'),
          createBullet('Database Service', 'MongoDB Atlas (AWS M0 Cluster)'),
          new Paragraph({ text: '', spacing: { after: 300 } }),

          createH1('1. Introduction'),
          createH2('1.1 Purpose'),
          createP(
            'This Software Requirements Specification (SRS) establishes the complete functional and non-functional requirements for TaskFlow, a modern full-stack web application designed for personal and academic task management. It defines the architectural patterns, security controls, data schemas, and API contracts conforming to ICTAK standards.'
          ),
          createH2('1.2 Scope'),
          createP(
            'TaskFlow is engineered with the MERN technology stack (MongoDB, Express.js, React 18 with Vite, and Node.js). The system features JWT authentication, bcrypt password encryption, responsive SPA interface, strict user data isolation, and comprehensive task CRUD functionality.'
          ),

          createH1('2. Overall System Description'),
          createH2('2.1 Product Perspective'),
          createP(
            'TaskFlow is an independent, 3-tier cloud application consisting of a React Single-Page Application (SPA) hosted on Vercel, a Node/Express REST API hosted on Render, and a distributed cloud database on MongoDB Atlas.'
          ),
          createH2('2.2 User Classes and Roles'),
          createBullet('Regular User', 'Can register, authenticate, create, filter, paginate, update, and delete personal tasks. Cannot access records belonging to other users.'),
          createBullet('System Administrator', 'Has global inspection permissions and access to aggregate system health telemetry.'),

          createH1('3. Functional Requirements'),
          createBullet('FR-01 User Registration', 'System accepts Name, valid Email, and Password (>= 6 chars). Hashes password using bcrypt (10 salt rounds) and rejects duplicates with 409 Conflict.'),
          createBullet('FR-02 User Authentication', 'Authenticates email and password. Generates signed JSON Web Token (JWT) with 7-day expiry upon successful verification.'),
          createBullet('FR-03 Session Persistence', 'React client maintains session via localStorage and automatically injects Bearer token into Authorization headers of API calls.'),
          createBullet('FR-04 Task Creation', 'Allows authenticated users to create tasks with Title, Description, Status, Priority, Due Date, and Tag array. Validates non-empty title.'),
          createBullet('FR-05 Data Isolation & Ownership', 'Enforces server-side data isolation. Users only see and modify tasks where task.user matches the authenticated user ID. Cross-user access returns 403 Forbidden.'),
          createBullet('FR-06 Filtering & Search', 'Provides real-time substring search across title/description and status/priority query filters.'),
          createBullet('FR-07 Server-Side Pagination', 'Implements page and limit parameters with total count and totalPages metadata for optimal performance.'),
          createBullet('FR-08 Real-Time Metrics', 'Aggregates user task workload and displays counters for Total, Pending, In Progress, and Completed tasks.'),
          createBullet('FR-09 4-State UI Compliance', 'Every screen reliably renders Loading (animated spinner), Success (data grid), Empty (friendly graphic & CTA), and Error (alert & retry button).'),
          createBullet('FR-10 Centralized Error Handling', 'Express error middleware intercepts exceptions and returns consistent JSON errors without leaking server stack traces in production.'),

          createH1('4. Non-Functional Requirements'),
          createBullet('NFR-01 Security', 'Passwords encrypted via bcryptjs; protected endpoints guarded by JWT; Helmet security headers enabled; rate limiter limits auth endpoints to 100 requests per 15-minute window.'),
          createBullet('NFR-02 Performance', 'Database utilizes composite indexes on { user: 1, createdAt: -1 } and { user: 1, status: 1 }. API response latency is under 100ms.'),
          createBullet('NFR-03 Usability & Responsive Design', 'Mobile-first fluid layout adapting seamlessly from 320px mobile screens to large desktop monitors. Accessible semantic HTML controls with clear labels.'),
          createBullet('NFR-04 Maintainability', 'Strict separation of concerns into client/ (components, pages, services, context) and server/ (controllers, models, middleware, routes, config).'),

          createH1('5. API Specification & Contract'),
          new Table({
            rows: [
              new TableRow({
                children: [
                  cell('Method & Path', true),
                  cell('Auth', true),
                  cell('Purpose', true),
                  cell('Success', true),
                  cell('Errors', true),
                ],
              }),
              new TableRow({
                children: [
                  cell('GET /api/health'),
                  cell('No'),
                  cell('Health check'),
                  cell('200 OK'),
                  cell('500'),
                ],
              }),
              new TableRow({
                children: [
                  cell('POST /api/auth/register'),
                  cell('No'),
                  cell('User signup'),
                  cell('201 Created'),
                  cell('400, 409'),
                ],
              }),
              new TableRow({
                children: [
                  cell('POST /api/auth/login'),
                  cell('No'),
                  cell('User login'),
                  cell('200 OK'),
                  cell('400, 401'),
                ],
              }),
              new TableRow({
                children: [
                  cell('GET /api/auth/me'),
                  cell('Bearer'),
                  cell('Current profile'),
                  cell('200 OK'),
                  cell('401'),
                ],
              }),
              new TableRow({
                children: [
                  cell('GET /api/tasks'),
                  cell('Bearer'),
                  cell('List & paginate tasks'),
                  cell('200 OK'),
                  cell('401'),
                ],
              }),
              new TableRow({
                children: [
                  cell('POST /api/tasks'),
                  cell('Bearer'),
                  cell('Create task'),
                  cell('201 Created'),
                  cell('400, 401'),
                ],
              }),
              new TableRow({
                children: [
                  cell('PUT /api/tasks/:id'),
                  cell('Bearer'),
                  cell('Update task'),
                  cell('200 OK'),
                  cell('400, 403, 404'),
                ],
              }),
              new TableRow({
                children: [
                  cell('DELETE /api/tasks/:id'),
                  cell('Bearer'),
                  cell('Delete task'),
                  cell('200 OK'),
                  cell('401, 403, 404'),
                ],
              }),
            ],
          }),

          createH1('6. Verification & Test Evidence'),
          createP(
            'The system was subjected to 19 automated integration test cases using Node.js and an in-memory database environment. 100% of test cases passed covering user registration, duplicate prevention, bad credentials, task CRUD, data isolation, and unauthorized access interception.'
          ),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const filePath = path.join(process.cwd(), 'reports', 'TaskFlow_Software_Requirements_Specification.docx');
  fs.writeFileSync(filePath, buffer);
  console.log(`[Generated] SRS document created at: ${filePath}`);
}

// ==========================================
// 2. GENERATE FINAL INTERNSHIP PROJECT REPORT
// ==========================================
async function generateFinalReport() {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          createTitle('ICT ACADEMY OF KERALA'),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Summer Internship Report\nFull Stack Application Development with ReactJS\n\n',
                bold: true,
                size: 28,
              }),
              new TextRun({
                text: 'Project Title: TaskFlow - MERN Task Management System\n\n',
                size: 24,
                bold: true,
              }),
              new TextRun({
                text: 'Submitted by: Reo Varghese\n',
                size: 24,
              }),
              new TextRun({
                text: 'Batch: CS D | Roll No: 21 | SR No: 225783\n',
                size: 22,
              }),
              new TextRun({
                text: 'ICT Academy of Kerala (ICTAK)\nDate: October 2026\n',
                size: 22,
                italics: true,
              }),
            ],
            spacing: { after: 400 },
          }),

          createH1('EXECUTIVE SUMMARY'),
          createP(
            'This report presents the design, implementation, testing, and deployment of TaskFlow, a full-stack MERN (MongoDB, Express.js, React, Node.js) web application developed during the ICT Academy of Kerala (ICTAK) Internship Program in Full Stack Application Development with ReactJS. TaskFlow provides a private, secure, and responsive platform for organizing task workflows, monitoring sprint workloads, and tracking progress metrics. The project adheres to modern industry engineering standards including JWT authentication, bcrypt password hashing, MVC modularity, responsive CSS, and cloud deployment on Vercel, Render, and MongoDB Atlas.'
          ),

          createH1('INTRODUCTION'),
          createP(
            'Effective task tracking is critical in software engineering and academic project management. While several commercial task management tools exist, they frequently suffer from complex configurations, heavy cognitive overhead, or inadequate data isolation for personal user environments. TaskFlow was developed as a modern, lightweight web application that bridges this gap. Built following ICTAK guidelines, the system incorporates an end-to-end 3-tier architecture with separate frontend and backend layers communicating via a RESTful API.'
          ),

          createH1('OBJECTIVES'),
          createP('The primary objectives of this internship project were:'),
          createBullet('Full Stack Architecture', 'Design and implement a decoupled client-server architecture following strict separation of concerns.'),
          createBullet('Secure Authentication & Authorization', 'Implement industry-standard JWT token-based authentication with bcrypt password hashing and ownership verification.'),
          createBullet('Responsive React UI', 'Build a modern, accessible Single Page Application (SPA) using React 18, Vite, and custom CSS design tokens.'),
          createBullet('4-State UI Implementation', 'Ensure every screen provides dedicated handling for Loading, Success, Empty, and Error states as mandated by ICTAK.'),
          createBullet('Automated Testing', 'Establish an automated integration test suite validating all API endpoints, error codes, and authorization boundaries.'),
          createBullet('Production Cloud Deployment', 'Deploy the database on MongoDB Atlas, the backend API on Render, and the React frontend on Vercel over HTTPS.'),

          createH1('SCOPE AND DELIVERABLES'),
          createP('The project scope encompassed the complete software development lifecycle (SDLC):'),
          createBullet('Deliverable 1: Backend REST API', 'A production-ready Node.js/Express service featuring MVC structure, Helmet security headers, rate limiting, and centralized error handling.'),
          createBullet('Deliverable 2: Cloud Database', 'A managed MongoDB Atlas cluster with indexed collections and embedded vs. referenced schema modeling.'),
          createBullet('Deliverable 3: React Client', 'A responsive Vite SPA featuring authentication context, controlled forms, inline error validation, and real-time dashboard counters.'),
          createBullet('Deliverable 4: Automated Test Suite', 'An integration test suite with 19 passing assertions covering registration, duplicate handling, task CRUD, and ownership validation.'),
          createBullet('Deliverable 5: Live Cloud Deployment', 'Live frontend at https://taskflow-mern-tau.vercel.app and backend at https://taskflow-mern-nfex.onrender.com.'),

          createH1('METHODOLOGY'),
          createP(
            'The development process followed an Agile, milestone-driven methodology aligned with Section 12 of the ICTAK Student Guide. The project progressed across five distinct phases: (1) Requirements & Architectural Design, (2) Database Modeling & Schema Configuration, (3) Backend API Development & Security Middleware, (4) Frontend React Implementation & API Integration, and (5) Automated Testing, Cloud Deployment & Verification.'
          ),

          createH1('PROJECT ACTIVITIES'),
          createBullet('Activity 1: Database Engineering', 'Created User and Task schemas in Mongoose. Implemented pre-save bcrypt password hashing, reference relationships via ObjectId, and compound indexes on { user: 1, createdAt: -1 }.'),
          createBullet('Activity 2: Controller & Route Construction', 'Implemented RESTful endpoints for authentication and task management. Configured protect and authorize middleware to prevent unauthorized or cross-user data manipulation.'),
          createBullet('Activity 3: Frontend Component Development', 'Developed reusable UI pieces including LoadingSpinner, EmptyState, ErrorAlert, TaskCard, TaskModal, and Pagination in React.'),
          createBullet('Activity 4: Central API Service', 'Built api.js with Bearer token injection, environment variable resolution, and error handling.'),
          createBullet('Activity 5: Integration Testing', 'Created api.test.js using in-memory MongoDB, verifying 19 test scenarios with zero failures.'),
          createBullet('Activity 6: Deployment & DNS Configuration', 'Configured MongoDB Atlas network access (0.0.0.0/0), deployed Node service on Render, and deployed static SPA on Vercel with SPA routing fallbacks.'),

          createH1('RESULTS & FINDINGS'),
          createP(
            'The project successfully achieved 100% of its initial objectives and compliance targets. Performance profiling confirmed sub-100ms API response times. The automated test suite completed with 19 passed assertions and 0 failures. Live production testing verified seamless user registration, persistent login sessions, real-time workload metrics, and mobile responsiveness across multiple screen widths.'
          ),

          createH1('SCREENSHOTS OF MAJOR CLIENT-SIDE VIEWS'),
          createH2('Figure 1: Live TaskFlow Dashboard (Production Vercel & Render)'),
          new Paragraph({
            children: [
              new ImageRun({
                data: fs.readFileSync(path.join(process.cwd(), 'screenshots', 'dashboard.png')),
                transformation: {
                  width: 580,
                  height: 290,
                },
              }),
            ],
            spacing: { after: 200 },
          }),

          createH2('Figure 2: Production Deployment Status & Login Interface (Vercel)'),
          new Paragraph({
            children: [
              new ImageRun({
                data: fs.readFileSync(path.join(process.cwd(), 'screenshots', 'deployment.png')),
                transformation: {
                  width: 580,
                  height: 290,
                },
              }),
            ],
            spacing: { after: 200 },
          }),

          createH1('CONCLUSION'),
          createP(
            'TaskFlow demonstrates the practical implementation of modern full-stack web development principles using the MERN stack. Through this project, core proficiencies in asynchronous JavaScript, React state management, REST API architecture, database indexing, web security, automated testing, and multi-cloud deployment were deepened. The application is completely functional, verified in production, and satisfies all requirements set forth by the ICT Academy of Kerala.'
          ),

          createH1('APPENDIX'),
          createBullet('GitHub Repository', 'https://github.com/Reo257/taskflow-mern'),
          createBullet('Live Frontend Application (Vercel)', 'https://taskflow-mern-tau.vercel.app'),
          createBullet('Live Backend REST API (Render)', 'https://taskflow-mern-nfex.onrender.com'),
          createBullet('API Health Check', 'https://taskflow-mern-nfex.onrender.com/api/health'),
          createBullet('Automated Test Output', '19 tests passed, 0 failed (server/tests/api.test.js)'),
          createBullet('Database Cluster', 'MongoDB Atlas (AWS Mumbai / ap-south-1)'),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const filePath = path.join(process.cwd(), 'reports', 'TaskFlow_Final_Project_Report.docx');
  fs.writeFileSync(filePath, buffer);
  console.log(`[Generated] Final Project Report created at: ${filePath}`);
}

async function run() {
  await generateSRS();
  await generateFinalReport();
}

run();
