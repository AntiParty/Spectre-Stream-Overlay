// Function to extract player ID from URL query parameters
function getPlayerIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('playerId'); // Get the 'playerId' parameter from the URL
  }

  // Mapping of rank IDs to rank information
  const soloRankMapping = {
  0: { name: "Unranked", image: "Unranked.png", color: "#ffffff" },
  1: { name: "Bronze 1", image: "Bronze_1.png", color: "#8d4f29" },
  2: { name: "Bronze 2", image: "Bronze_2.png", color: "#8d4f29" },
  3: { name: "Bronze 3", image: "Bronze_3.png", color: "#8d4f29" },
  4: { name: "Bronze 4", image: "Bronze_4.png", color: "#8d4f29" },
  5: { name: "Silver 1", image: "Silver_1.png", color: "#bebebe" },
  6: { name: "Silver 2", image: "Silver_2.png", color: "#bebebe" },
  7: { name: "Silver 3", image: "Silver_3.png", color: "#bebebe" },
  8: { name: "Silver 4", image: "Silver_4.png", color: "#bebebe" },
  9: { name: "Gold 1", image: "Gold_1.png", color: "#e39925" },
  10: { name: "Gold 2", image: "Gold_2.png", color: "#e39925" },
  11: { name: "Gold 3", image: "Gold_3.png", color: "#e39925" },
  12: { name: "Gold 4", image: "Gold_4.png", color: "#e39925" },
  13: { name: "Platinum 1", image: "Platinum_1.png", color: "#8ec1e5" },
  14: { name: "Platinum 2", image: "Platinum_2.png", color: "#8ec1e5" },
  15: { name: "Platinum 3", image: "Platinum_3.png", color: "#8ec1e5" },
  16: { name: "Platinum 4", image: "Platinum_4.png", color: "#8ec1e5" },
  17: { name: "Emerald 1", image: "Emerald_1.png", color: "#0e9776" },
  18: { name: "Emerald 2", image: "Emerald_2.png", color: "#0e9776" },
  19: { name: "Emerald 3", image: "Emerald_3.png", color: "#0e9776" },
  20: { name: "Emerald 4", image: "Emerald_4.png", color: "#0e9776" },
  21: { name: "Ruby 1", image: "Ruby_1.png", color: "#e0113a" },
  22: { name: "Ruby 2", image: "Ruby_2.png", color: "#e0113a" },
  23: { name: "Ruby 3", image: "Ruby_3.png", color: "#e0113a" },
  24: { name: "Ruby 4", image: "Ruby_4.png", color: "#e0113a" },
  25: { name: "Diamond 1", image: "Diamond_1.png", color: "#8531eb" },
  26: { name: "Diamond 2", image: "Diamond_2.png", color: "#8531eb" },
  27: { name: "Diamond 3", image: "Diamond_3.png", color: "#8531eb" },
  28: { name: "Diamond 4", image: "Diamond_4.png", color: "#8531eb" },
  29: { name: "Champion", image: "Champion.png", color: "#FFEE58" }
};



  // Thresholds defining points required for each rank
  const rankThresholds = [
    { name: "Champion", points: 4700 },
    { name: "Diamond 4", points: 4500 },
    { name: "Ruby 1", points: 3100 },
    { name: "Emerald 1", points: 2300 },
    { name: "Gold 1", points: 700 },
    { name: "Silver 1", points: 0 }
  ];

  // Fetch player data from the API
  async function fetchData() {
  const playerId = getPlayerIdFromUrl(); // Get player ID from URL

  if (!playerId) {
    console.error("Player ID not found in URL.");
    return;
  }

  const url = `https://wavescan-production.up.railway.app/api/v1/player/${playerId}/full_profile`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    const soloRankPoints = data.stats?.solo_rank_points || 0;
    const soloRankId = data.stats?.current_solo_rank || 0;
    const soloRankInfo = soloRankMapping[soloRankId] || { name: "Unknown", image: "Unknown.png", color: "#ffffff" };

    // Set rank image and label
    document.getElementById("rankIcon").src = `../assets/${soloRankInfo.image}`;
    document.getElementById("soloRankLabel").textContent = "Solo Rank: ";
    document.getElementById("soloRank").textContent = soloRankInfo.name;
    document.getElementById("soloRank").style.color = soloRankInfo.color;

    // Display the result of the last match
    const latestMatch = data.matches?.[0];
    if (latestMatch) {
      const playerMatchStats = latestMatch.player_team.players.find((player) => player.id === playerId);
      const rankDelta = playerMatchStats?.ranked_rating_delta ?? 0;
      const matchResultText = rankDelta > 0
        ? `Last Match: <span style="color: #81FF5A;">+${rankDelta} <img class="arrow" src="./assets/up_plusplus.webp" alt="Win Arrow"></span>`
        : `Last Match: <span style="color: red;">${rankDelta} <img class="arrow" src="./assets/down_plusplus.webp" alt="Loss Arrow"></span>`;
      document.getElementById("matchResult").innerHTML = matchResultText;
    }

    // Update the progress bar based on the player's solo rank points
    updateProgressBar(soloRankPoints, soloRankInfo.name, soloRankInfo.color);

  } catch (error) {
    console.error("Error fetching data:", error);
    document.getElementById("soloRank").textContent = "Solo Rank: Error - " + error.message;
    document.getElementById("matchResult").textContent = "Last Match: Error - " + error.message;
  }
}

  function updateProgressBar(soloRankPoints, currentRankName, rankColor) {
    const currentRankIndex = rankThresholds.findIndex(rank => rank.name === currentRankName);
    if (currentRankIndex === -1) return;

    const currentRank = rankThresholds[currentRankIndex];
    const nextRank = rankThresholds[currentRankIndex + 1] || { points: soloRankPoints + 1000 };

    let progressPercentage = ((soloRankPoints - currentRank.points) / (nextRank.points - currentRank.points)) * 100;
    progressPercentage = Math.min(progressPercentage, 100);

    const progressBarElement = document.getElementById("rankProgress");

  // Apply width and color to the progress bar
    progressBarElement.style.width = `${progressPercentage}%`;
    progressBarElement.style.backgroundColor = rankColor;

    console.log(`Progress bar updated: width = ${progressPercentage}%, color = ${rankColor}`);
  }

  // Initialize the fetch process and set a refresh interval
  fetchData();
  setInterval(fetchData, 60000); // Refresh data every 60 seconds