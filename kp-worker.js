// DroneWX — Cloudflare Worker proxy dla NOAA Kp index
// Wdróż na: https://workers.cloudflare.com (darmowe, 100k req/dzień)

export default {
  async fetch(request) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Max-Age': '86400',
        }
      });
    }

    const NOAA_URL = 'https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json';

    try {
      const response = await fetch(NOAA_URL, {
        headers: { 'User-Agent': 'DroneWX/1.0' }
      });

      if (!response.ok) {
        return new Response(JSON.stringify({ error: 'NOAA fetch failed', status: response.status }), {
          status: 502,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        });
      }

      const data = await response.json();

      return new Response(JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=600', // cache 10 minut
        }
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }
  }
};
