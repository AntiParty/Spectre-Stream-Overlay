async function fetchData() {
    const playerId = 'a7a6b16b-e80b-4606-a71a-165de1db9ae4';  // Replace with your Player ID
    const url = `https://wavescan-production.up.railway.app/api/v1/player/${playerId}/full_profile`; // Use a single API URL

    try {
        // Fetch player data
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response:', data);  // Log the response for debugging

        // Extract rank data
        if (data.data && data.data.length > 0) {
            const playerStats = data.data[0].spectre_player_stats;
            const soloRankId = playerStats.current_solo_rank;

            // Get the solo rank info from the mapping
            const soloRankInfo = soloRankMapping[soloRankId] || { name: 'Unknown', image: 'Unknown.png' };

            // Update the HTML elements
            document.getElementById('rankIcon').src = `./assets/${soloRankInfo.image}`;
            document.getElementById('soloRank').textContent = `Solo Rank: ${soloRankInfo.name}`;
        } else {
            document.getElementById('soloRank').textContent = 'Solo Rank: Error - No player data found';
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('soloRank').textContent = 'Solo Rank: Error - ' + error.message;
    }
}

// Call the function immediately to fetch data on load
fetchData();