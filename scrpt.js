const API_URL = "https://wavescan-production.up.railway.app/api/v1/player/a7a6b16b-e80b-4606-a71a-165de1db9ae4/full_profile";

// Function to fetch and display stats
async function fetchStats() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        
        // Extract relevant stats
        const rank = data.rank ? data.rank.display_name : "N/A";
        const winPercent = data.stats ? data.stats.win_percent : "N/A";
        const kdRatio = data.stats ? data.stats.kd_ratio : "N/A";
        const matches = data.matches ? data.matches : [];

        // Populate player stats
        document.getElementById('rank').textContent = rank;
        document.getElementById('win-percent').textContent = `${winPercent}%`;
        document.getElementById('kd-ratio').textContent = kdRatio;

        // Populate matches
        const timelineElement = document.getElementById('timeline');
        matches.forEach(match => {
            const matchDiv = document.createElement('div');
            matchDiv.className = `timeline__match timeline__match--${match.result}`;
            const img = document.createElement('img');
            img.src = match.agent_icon_url;
            matchDiv.appendChild(img);
            timelineElement.appendChild(matchDiv);
        });
    } catch (error) {
        console.error("Failed to fetch stats:", error);
    }
}

// Call fetchStats when the page loads
document.addEventListener('DOMContentLoaded', fetchStats);
