#include <iostream>
#include <vector>
#include <algorithm>
#include <iomanip>

using namespace std;

/**
 * PROJECT: Route Optimization System using TSP
 * ALGORITHM: Dynamic Programming with Bitmasking
 * TIME COMPLEXITY: O(n^2 * 2^n)
 * SPACE COMPLEXITY: O(n * 2^n)
 */

const int INF = 1e9;
int n;
vector<vector<int>> dist;
vector<vector<int>> memo;
vector<vector<int>> parent;

/**
 * solveTSP: Computes the minimum cost to visit all cities and return to the start.
 * @param mask: Bitmask representing the set of visited cities.
 * @param pos: Current city index.
 * @return: Minimum cost to complete the tour from the current state.
 */
int solveTSP(int mask, int pos) {
    // Base Case: If all cities are visited, return the distance to the starting city (0).
    if (mask == (1 << n) - 1) {
        return dist[pos][0];
    }

    // Return the value if it's already computed (Memoization).
    if (memo[mask][pos] != -1) {
        return memo[mask][pos];
    }

    int ans = INF;

    // Try visiting every city that hasn't been visited yet.
    for (int city = 0; city < n; city++) {
        if ((mask & (1 << city)) == 0) { // If city is not visited
            int newDist = dist[pos][city] + solveTSP(mask | (1 << city), city);
            if (newDist < ans) {
                ans = newDist;
                parent[mask][pos] = city; // Store for path reconstruction
            }
        }
    }

    return memo[mask][pos] = ans;
}

/**
 * reconstructPath: Prints the optimal route by backtracking through the parent array.
 */
void reconstructPath() {
    int mask = 1; // Start with city 0 visited
    int pos = 0;
    cout << "Optimal Route:" << endl;
    cout << "City 0";

    while (true) {
        int nextCity = parent[mask][pos];
        if (nextCity == -1) break;
        cout << " -> City " << nextCity;
        mask |= (1 << nextCity);
        pos = nextCity;
    }
    cout << " -> City 0" << endl;
}

int main() {
    cout << "===========================================" << endl;
    cout << "   TSP Route Optimization System (C++)     " << endl;
    cout << "===========================================" << endl;

    cout << "Enter number of cities: ";
    if (!(cin >> n) || n <= 0) {
        cout << "Invalid number of cities." << endl;
        return 1;
    }

    if (n > 20) {
        cout << "Warning: DP with Bitmasking is O(2^n). Large 'n' will be slow." << endl;
    }

    dist.assign(n, vector<int>(n));
    memo.assign(1 << n, vector<int>(n, -1));
    parent.assign(1 << n, vector<int>(n, -1));

    cout << "Enter the distance matrix (" << n << "x" << n << "):" << endl;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            cin >> dist[i][j];
        }
    }

    int minCost = solveTSP(1, 0);

    cout << "\n-------------------------------------------" << endl;
    cout << "Minimum Travelling Cost: " << minCost << endl;
    cout << "-------------------------------------------" << endl;
    
    reconstructPath();
    cout << "-------------------------------------------" << endl;

    return 0;
}
