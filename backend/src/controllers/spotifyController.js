import axios from 'axios';

// In-memory cache for the client credentials token
let cachedToken = null;
let tokenExpiry = 0;

async function getClientCredentialsToken() {
    if (cachedToken && Date.now() < tokenExpiry - 60000) {
        return cachedToken;
    }

    const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        new URLSearchParams({ grant_type: 'client_credentials' }).toString(),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(
                    process.env.SPOTIFY_CLIENT_ID.trim() + ':' + process.env.SPOTIFY_CLIENT_SECRET.trim()
                ).toString('base64')
            }
        }
    );

    const { access_token, expires_in } = response.data;
    cachedToken = access_token;
    tokenExpiry = Date.now() + expires_in * 1000;
    return cachedToken;
}

/**
 * GET /api/spotify/search?q=query
 * Search for artists on Spotify using client credentials (no user auth required).
 */
export const searchArtists = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.trim().length === 0) {
            return res.json([]);
        }

        const accessToken = await getClientCredentialsToken();

        const response = await axios.get('https://api.spotify.com/v1/search', {
            headers: { 'Authorization': `Bearer ${accessToken}` },
            params: { q: q.trim(), type: 'artist', limit: 10 }
        });

        const artists = response.data.artists.items.map(artist => ({
            spotify_id: artist.id,
            name: artist.name,
            image_url: artist.images?.[0]?.url || null,
            genres: artist.genres?.slice(0, 3) || [],
            popularity: artist.popularity
        }));

        res.json(artists);
    } catch (err) {
        console.error('[Spotify] Search error:', err.response?.data || err.message);
        res.status(500).json({ error: 'Failed to search artists' });
    }
};
