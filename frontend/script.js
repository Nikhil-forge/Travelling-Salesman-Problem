/**
 * RouteOptima - TSP Script
 * Handles UI logic, Matrix generation, TSP algorithm (JS), and Canvas Visualization
 */

document.addEventListener('DOMContentLoaded', () => {
    const cityCountInput = document.getElementById('city-count');
    const generateBtn = document.getElementById('generate-matrix');
    const matrixWrapper = document.getElementById('matrix-wrapper');
    const matrixTable = document.getElementById('matrix-table');
    const solveBtn = document.getElementById('solve-btn');
    const resultsDiv = document.getElementById('results');
    const loader = document.getElementById('loader');
    const canvas = document.getElementById('tsp-canvas');
    const ctx = canvas.getContext('2d');
    const placeholderText = document.getElementById('placeholder-text');

    let n = 0;
    let distMatrix = [];
    let cityCoords = [];

    // --- 1. MATRIX GENERATION ---

    generateBtn.addEventListener('click', () => {
        n = parseInt(cityCountInput.value);
        if (n < 2 || n > 10) {
            alert("Please enter a number between 2 and 10 for a clean demo.");
            return;
        }

        matrixTable.innerHTML = '';
        distMatrix = Array(n).fill().map(() => Array(n).fill(0));
        
        // Header Row
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = '<th></th>' + Array.from({length: n}, (_, i) => `<th>C${i}</th>`).join('');
        matrixTable.appendChild(headerRow);

        // Data Rows
        for (let i = 0; i < n; i++) {
            const row = document.createElement('tr');
            row.innerHTML = `<th>C${i}</th>`;
            for (let j = 0; j < n; j++) {
                const td = document.createElement('td');
                const input = document.createElement('input');
                input.type = 'number';
                input.min = '0';
                input.value = (i === j) ? 0 : Math.floor(Math.random() * 50) + 10;
                input.disabled = (i === j);
                input.dataset.row = i;
                input.dataset.col = j;
                
                // Keep matrix symmetric for easy input
                input.addEventListener('input', (e) => {
                    const val = e.target.value;
                    const r = e.target.dataset.row;
                    const c = e.target.dataset.col;
                    const counterpart = document.querySelector(`input[data-row="${c}"][data-col="${r}"]`);
                    if (counterpart) counterpart.value = val;
                });

                td.appendChild(input);
                row.appendChild(td);
            }
            matrixTable.appendChild(row);
        }

        matrixWrapper.style.display = 'block';
        resultsDiv.style.display = 'none';
        
        // Generate random coordinates for visualization
        generateCityCoordinates();
        drawCities();
    });

    // --- 2. TSP ALGORITHM (JS Implementation for Frontend) ---

    solveBtn.addEventListener('click', async () => {
        // Read matrix values
        const inputs = matrixTable.querySelectorAll('input');
        inputs.forEach(input => {
            const r = parseInt(input.dataset.row);
            const c = parseInt(input.dataset.col);
            distMatrix[r][c] = parseInt(input.value) || 0;
        });

        loader.style.display = 'block';
        resultsDiv.style.display = 'none';
        solveBtn.disabled = true;

        // Small delay to simulate processing
        await new Promise(resolve => setTimeout(resolve, 800));

        const result = runTSP(n, distMatrix);

        loader.style.display = 'none';
        resultsDiv.style.display = 'block';
        solveBtn.disabled = false;

        displayResults(result);
        animateRoute(result.path);
    });

    function runTSP(n, dist) {
        const memo = Array(1 << n).fill().map(() => Array(n).fill(-1));
        const parent = Array(1 << n).fill().map(() => Array(n).fill(-1));

        function solve(mask, pos) {
            if (mask === (1 << n) - 1) return dist[pos][0];
            if (memo[mask][pos] !== -1) return memo[mask][pos];

            let res = Infinity;
            for (let city = 0; city < n; city++) {
                if ((mask & (1 << city)) === 0) {
                    let newAns = dist[pos][city] + solve(mask | (1 << city), city);
                    if (newAns < res) {
                        res = newAns;
                        parent[mask][pos] = city;
                    }
                }
            }
            return memo[mask][pos] = res;
        }

        const minCost = solve(1, 0);
        
        // Path Reconstruction
        const path = [0];
        let mask = 1;
        let pos = 0;
        while (true) {
            let nextCity = parent[mask][pos];
            if (nextCity === -1) break;
            path.push(nextCity);
            mask |= (1 << nextCity);
            pos = nextCity;
        }
        path.push(0); // Return to start

        return { minCost, path };
    }

    // --- 3. VISUALIZATION (CANVAS) ---

    function generateCityCoordinates() {
        cityCoords = [];
        const padding = 50;
        const width = canvas.width - padding * 2;
        const height = canvas.height - padding * 2;

        for (let i = 0; i < n; i++) {
            // Use a circle layout for better visualization
            const angle = (i / n) * Math.PI * 2;
            const x = canvas.width / 2 + Math.cos(angle) * (width / 2.5);
            const y = canvas.height / 2 + Math.sin(angle) * (height / 2.5);
            
            cityCoords.push({ x, y, id: i });
        }
    }

    function drawCities() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        placeholderText.style.display = 'none';

        // Draw connections (faint)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                ctx.beginPath();
                ctx.moveTo(cityCoords[i].x, cityCoords[i].y);
                ctx.lineTo(cityCoords[j].x, cityCoords[j].y);
                ctx.stroke();
            }
        }

        // Draw Nodes
        cityCoords.forEach((city, i) => {
            ctx.beginPath();
            ctx.arc(city.x, city.y, 15, 0, Math.PI * 2);
            ctx.fillStyle = i === 0 ? '#6366f1' : '#334155';
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = '#fff';
            ctx.font = 'bold 12px Outfit';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`C${i}`, city.x, city.y);
        });
    }

    function animateRoute(path) {
        drawCities();
        let step = 0;

        function drawStep() {
            if (step >= path.length - 1) return;

            const start = cityCoords[path[step]];
            const end = cityCoords[path[step + 1]];

            ctx.beginPath();
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = '#22d3ee';
            ctx.lineWidth = 3;
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
            ctx.setLineDash([]);

            // Draw arrow
            const headlen = 10;
            const angle = Math.atan2(end.y - start.y, end.x - start.x);
            ctx.beginPath();
            ctx.moveTo(end.x, end.y);
            ctx.lineTo(end.x - headlen * Math.cos(angle - Math.PI / 6), end.y - headlen * Math.sin(angle - Math.PI / 6));
            ctx.moveTo(end.x, end.y);
            ctx.lineTo(end.x - headlen * Math.cos(angle + Math.PI / 6), end.y - headlen * Math.sin(angle + Math.PI / 6));
            ctx.stroke();

            step++;
            setTimeout(drawStep, 400);
        }

        drawStep();
    }

    // --- 4. DISPLAY RESULTS ---

    function displayResults(result) {
        document.getElementById('min-cost').textContent = result.minCost;
        document.getElementById('cities-visited').textContent = n;
        
        const routeDisplay = document.getElementById('route-display');
        routeDisplay.innerHTML = '';

        result.path.forEach((city, index) => {
            const node = document.createElement('div');
            node.className = 'route-node';
            node.textContent = `City ${city}`;
            routeDisplay.appendChild(node);

            if (index < result.path.length - 1) {
                const arrow = document.createElement('i');
                arrow.className = 'fas fa-arrow-right route-arrow';
                routeDisplay.appendChild(arrow);
            }
        });
    }
});
