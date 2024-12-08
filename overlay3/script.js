// Moved soloRankMapping and sponsorMapping here to avoid the reference error
function getPlayerIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("playerId"); // Get the 'playerId' parameter from the URL
}

const sponsorMapping = {
  1: { name: "Pinnacle", image: "Pinnacle.png" },
  2: { name: "Bloom", image: "Bloom.png" },
  3: { name: "Umbra", image: "Umbra.png" },
  4: { name: "Ryker", image: "Ryker.png" },
  5: { name: "Muu", image: "Muu.png" },
  6: { name: "Ghostlink", image: "Ghostlink.png" },
  default: { name: "Unknown Sponsor", image: "default.png" },
};

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
  29: { name: "Champion", image: "Champion.png", color: "#FFEE58" },
};

function calculateWinPercentage(wins, totalMatches) {
  if (totalMatches === 0) return 0;
  return ((wins / totalMatches) * 100).toFixed(2);
}

function calculateKD(kills, deaths) {
  return deaths === 0 ? "N/A" : (kills / deaths).toFixed(2);
}

async function fetchData() {
  const playerId = getPlayerIdFromUrl();
  console.log("Data being fetched...");
  if (!playerId) {
    console.error("Player ID not found in URL.");
    return;
  }
  const url = `https://wavescan-production.up.railway.app/api/v1/player/${playerId}/full_profile`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    // Log the data to see the structure
    console.log("Full player data:", data);

    // Extract solo rank from the data
    const soloRankId = data.stats?.current_solo_rank || 0;
    const soloRankPoints = data.stats?.rank_rating || 0;
    const rankData = soloRankMapping[soloRankId] || soloRankMapping[0];
    const avgWinPercentage =
      data.extended_stats?.last_20_matches_avg_stats?.average_win_percentage ||
      0;
    const totalKills =
      data.extended_stats?.last_20_matches_avg_stats?.total_kills || 0;
    const totalDeaths =
      data.extended_stats?.last_20_matches_avg_stats?.total_deaths || 0;
    const kdRatio = calculateKD(totalKills, totalDeaths);

    // Display rank icon and player stats
    const rankIcon = document.getElementById("rankIcon");
    const playerStats = document.getElementById("playerStats");

    if (rankIcon) {
      rankIcon.src = `../assets/${rankData.image}`;
      rankIcon.style.borderColor = rankData.color;
    } else {
      console.error("Rank icon element not found.");
    }

    if (playerStats) {
      playerStats.innerHTML = `
          <div class="player-stats">
            <div class="rank-info">
              <span class="rank-name">${rankData.name}</span>
              <span class="avg-win">Win %</span>
              <span class="kd-ratio">K/D</span>
            </div>
            <div>
              <span class="rank-points">${soloRankPoints}</span><span class="sr-text"> SR</span>
              <span class="avg-win-text">${avgWinPercentage}%</span>
              <span class="kd-ratio-text">${kdRatio}</span>
            </div>
          </div>
        `;
    } else {
      console.error("Player stats element not found.");
    }

    // Display last 5 games and their sponsor logos
    const last5Games = (data.matches || []).slice(0, 6);
    console.log("Last 5 games:", last5Games);
    const sponsorNames = last5Games.map((game, index) => {
        // Log the full game data to inspect its structure
        console.log(`Game ${index + 1} data:`, game);
      
        // Access the sponsor name from the match data
        const sponsorName = game.player_team?.players?.find(player => player.id === playerId)?.sponsor_name || "Unknown Sponsor"; 
        console.log(`Sponsor for game ${index + 1}:`, sponsorName);
      
        return sponsorName;
      });
      const sponsorIcons = last5Games
      .map((game, index) => {
        const sponsorName =
          game.player_team?.players?.find((player) => player.id === playerId)
            ?.sponsor_name || "Unknown Sponsor";

        const sponsorData =
          Object.values(sponsorMapping).find(
            (s) => s.name.toLowerCase() === sponsorName.toLowerCase()
          ) || sponsorMapping.default;
        
        const imageSrc = 
        sponsorName.toLowerCase() === "morrgen"
        ? "https://raw.githubusercontent.com/AntiParty/Spectre-Stream-Overlay/refs/heads/main/assets/Morrgen.png"
        : `../assets/${sponsorData.image}`;

        return `<img src="${imageSrc}" alt="${sponsorData.name}" class="sponsor-icon" />`;
      })
      .join("");

    let sponsorsContainer = document.querySelector(".sponsors-container");

    if (!sponsorsContainer) {
      sponsorsContainer = document.createElement("div");
      sponsorsContainer.className = "sponsors-container";
      document.body.appendChild(sponsorsContainer);
    }

    sponsorsContainer.innerHTML = sponsorIcons;
  } catch (error) {
    console.error("Failed to fetch player data:", error);
  }
}
fetchData();
setInterval(fetchData, 30000);