# RouteOptima: TSP Route Optimization System

**Live Demo:** [https://travelling-salesman-problem-xkwg.vercel.app/](https://travelling-salesman-problem-xkwg.vercel.app/)

A professional and beginner-friendly college mini-project demonstrating route optimization using the **Travelling Salesman Problem (TSP)** solved with **Dynamic Programming and Bitmasking**.

## 🚀 Overview
The Travelling Salesman Problem (TSP) is a classic algorithmic problem. This project provides a complete system to:
1.  **Understand** the theoretical aspects of TSP.
2.  **Calculate** the optimal route for a given distance matrix.
3.  **Visualize** the city nodes and the final optimal path on an interactive canvas.

## 🛠️ Technologies Used
-   **Frontend:** HTML5, CSS3 (Vanilla), JavaScript (Vanilla)
-   **Backend (Algorithm Demo):** C++
-   **Icons:** FontAwesome
-   **Fonts:** Google Fonts (Outfit)

## 📁 Project Structure
```text
TSP-Project/
│
├── frontend/           # Web-based interface
│   ├── index.html      # Home Page
│   ├── optimizer.html  # Main Application Page
│   ├── about.html      # Educational Content
│   ├── style.css       # Premium Design Styles
│   └── script.js       # Core Logic & Visualization
│
├── backend/            # C++ Algorithm Implementation
│   └── tsp.cpp         # Source code for DP + Bitmasking
│
└── README.md           # Documentation
```

## 🧠 Core Concepts

### 1. Travelling Salesman Problem
The goal is to find the shortest possible route that visits each city exactly once and returns to the starting city.

### 2. Dynamic Programming
Instead of calculating all $n!$ permutations, we break the problem into smaller sub-problems and store their results (memoization) to avoid redundant calculations.

### 3. Bitmasking
We use an integer as a bitmask to efficiently represent the set of visited cities.
-   `mask = 5` (binary `0101`) means City 0 and City 2 have been visited.

### 4. Complexity
-   **Time Complexity:** $O(n^2 \cdot 2^n)$
-   **Space Complexity:** $O(n \cdot 2^n)$

## 💻 How to Run

### Frontend
Simply open `frontend/index.html` in any modern web browser. No server is required.

### C++ Backend (Algorithm Demo)
To compile and run the algorithm demonstration:
1.  Open your terminal in the `backend/` directory.
2.  Compile the code:
    ```bash
    g++ tsp.cpp -o tsp.exe
    ```
3.  Run the executable:
    ```bash
    ./tsp.exe
    ```

### Sample Input for C++:
```text
4
0 10 15 20
10 0 35 25
15 35 0 30
20 25 30 0
```

## 🌟 Future Improvements
-   Integration with Google Maps API for real-world coordinate selection.
-   Genetic Algorithm implementation for solving much larger sets of cities (N > 20).
-   Multi-vehicle route optimization (Vehicle Routing Problem).

---
Created for College Mini-Project Submission.
