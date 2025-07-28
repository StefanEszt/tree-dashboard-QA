# Tree Dashboard – QA Automation Demo  

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

> **A smart-city-like dashboard built as a QA testing environment.**  
  **Focus:** Demonstrating *test strategy*, *functional UI tests*, and *Playwright automation*.  

---

## Features Overview

| Feature           | Description                                                                 |
|-------------------|-----------------------------------------------------------------------------|
| **Map**        | Interactive Leaflet map with tree markers for **23 Budapest districts**     |
| **Filters**    | Filter trees by **health**, **district**, or **street name**                |
| **Charts**     | Species distribution **Pie Chart** and CO₂ absorption **Bar Chart**         |
| **Calculator** | Calculates required trees to **offset yearly CO₂ goals**                    |
| **Data Export**| Tree data can be **collected and exported to CSV** using Playwright tests   |

---

## ▶ How to Run the App
cd tree-dashboard

npm install

npm run dev

Then open http://localhost:5173

## Screenshots
| Dashboard | Chart | Playwright Report |
|-----------|-------|-------------------|
| ![Dashboard](assets/dashboard.png) | ![Chart](assets/chart.png) | ![Report](assets/test-report.png) |

---


## Playwright Test Suite

| Test File                    | Purpose                                                                 |
|------------------------------|-------------------------------------------------------------------------|
| `tree-dashboard.spec.ts`   | **Decision Table Test** – Ensures filtering by "Poor" shows only Poor trees |
| `tree-details.spec.ts`     | **Export to CSV** – Collects all visible tree cards and saves them to CSV  |
| `co2-calculator.spec.ts`   | **CO₂ Goal Calculator** – Verifies correct calculation for valid/invalid input |

### ▶ Running All Tests in Order

npm run run-tests-in-order

### ▶ Running Individually
npx playwright test tests/tree-dashboard.spec.ts --headed

npx playwright test tests/tree-details.spec.ts --headed

npx playwright test tests/co2-calculator.spec.ts --headed


















# Tree-dashboard-QA
This project is a React + Vite + Tailwind CSS demo dashboard simulating a smart-city platform for urban tree management in Budapest. 


**Purpose:**  
The application was **intentionally built as a test environment** to demonstrate **QA automation skills, test strategy, and test design techniques** using **Playwright**.  

The app provides realistic UI elements – filters, map markers, charts, and data-driven outputs – to allow meaningful **functional UI testing, data validation, and automation scenarios.**

---
## The project was built for: 

 To **showcase my QA skills** in:
- Designing and executing **functional test cases**  
- Using **decision tables and risk-based test approaches**  
- Implementing **Playwright-based test automation**  
- Working with **dynamic UI elements (maps, charts, filters)**  
- Performing **data-driven testing and CSV validation** 

---
## Testing Approach
- Black-box functional testing – UI tests based on user actions
- Decision table-based testing – Ensures correct filter logic
- Negative testing – Verifies empty/invalid input behavior
- Data validation – Extracts UI data and validates CSV export

Tests are written as standalone cases for clarity, so reviewers can see selectors and assertions directly.
In a real project, I would implement Page Object Model (POM) for scalability.

---
## Tech Stack
- **Frontend:** React + Vite + Tailwind CSS + Leaflet  
- **Charts:** Recharts  
- **Testing:** Playwright (TypeScript)  

---

