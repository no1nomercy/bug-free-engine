// /api/discord-user.js
export default async function handler(req, res) {
  const { id } = req.query; // URL'deki ?id=DISCORD_USER_ID parametresini alır

  if (!id) {
    return res.status(400).json({ error: "Missing Discord user ID" });
  }

  try {
    const discordResponse = await fetch(
      `https://discord.com/api/v10/users/${id}`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`, // Vercel env değişkeni
        },
      }
    );

    if (!discordResponse.ok) {
      const text = await discordResponse.text();
      return res.status(discordResponse.status).json({ error: text });
    }

    const userData = await discordResponse.json();
    return res.status(200).json(userData);
  } catch (err) {
    console.error("Discord API error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

