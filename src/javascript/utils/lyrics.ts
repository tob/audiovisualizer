const lyrics = prompt("Paste your song lyrics");

if (lyrics) {
  analyzeLyrics(lyrics);
}

async function analyzeLyrics(lyrics: string) {
  try {
    const response = await fetch("http://localhost:3001/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lyrics }),
    });

    const data = await response.json();
    console.log("AI analysis:", data.result);

    // You can parse and use `data.result` to influence visuals here
    // e.g., change canvas color, animation speed, etc.
  } catch (err) {
    console.error("Failed to fetch AI analysis", err);
  }
}
