// api/embed.js
export default async function handler(req, res) {
    const { id } = req.query;
    const JSONBIN_KEY = '$2a$10$sLrFF.ABoJcUYrK2Ps8lxusDVHHm.E00yjgfvttWumaj34EYr61qy';

    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${id}/latest`, {
            headers: { 'X-Master-Key': JSONBIN_KEY }
        });
        const data = await response.json();
        const build = data.record.build; // The string like "100.0.0..._Oath_Weapon..."

        // Parse the build string 
        const sections = build.split('_');
        const stats = sections[0].split('.');
        const oath = sections[4] || "No Oath";
        
        
        const desc = `STR: ${stats[0]} | FOR: ${stats[1]} | AGI: ${stats[2]} | INT: ${stats[3]} | WIL: ${stats[4]} | CHA: ${stats[5]}`;

        // Return HTML with ONLY Meta Tags (Discord reads these)
        res.setHeader('Content-Type', 'text/html');
        return res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta property="og:title" content="Build: ${oath}">
                <meta property="og:description" content="${desc}">
                <meta property="og:image" content="https://media.discordapp.net/attachments/1452799462723420192/1453046676838289488/image.png">
                <meta name="theme-color" content="#c2a35d">
                <meta http-equiv="refresh" content="0; url=../../?id=${id}">
            </head>
            <body>Redirecting to build...</body>
            </html>
        `);
    } catch (e) {
        return res.status(500).send("Error generating embed.");
    }
}