// api/user_info.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Missing user ID" });
  }

  const DISCORD_BOT_TOKEN = process.env.TOKEN; // Vercel ortam değişkeni
  if (!DISCORD_BOT_TOKEN) {
    return res.status(500).json({ error: "Bot token not configured" });
  }

  try {
    const discordResponse = await fetch(`https://discord.com/api/v10/users/${id}`, {
      headers: {
        Authorization: `Bot ${TOKEN}`,
      },
    });

    if (!discordResponse.ok) {
      return res.status(discordResponse.status).json({ error: "Failed to fetch user data from Discord" });
    }

    const userData = await discordResponse.json();

    // Eğer banner veya avatar varsa, tam URL oluştur
    const avatarUrl = userData.avatar
      ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.${userData.avatar.startsWith("a_") ? "gif" : "png"}?size=512`
      : null;

    const bannerUrl = userData.banner
      ? `https://cdn.discordapp.com/banners/${userData.id}/${userData.banner}.${userData.banner.startsWith("a_") ? "gif" : "png"}?size=512`
      : null;

    res.status(200).json({
      id: userData.id,
      username: userData.username,
      global_name: userData.global_name || null,
      discriminator: userData.discriminator,
      avatar: userData.avatar,
      banner: userData.banner,
      avatar_url: avatarUrl,
      banner_url: bannerUrl,
      public_flags: userData.public_flags,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
