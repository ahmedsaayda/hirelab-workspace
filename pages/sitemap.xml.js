export async function getServerSideProps({ req, res }) {
  try {
    const host = req.headers.host?.replace('www.', '');
    // For custom domains, we cannot compute dynamic sitemap without backend public endpoint here.
    // Provide a minimal empty sitemap to avoid 404s.
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`;
    res.setHeader('Content-Type', 'application/xml');
    res.write(xml);
    res.end();
  } catch (e) {
    res.statusCode = 500;
    res.end('');
  }
  return { props: {} };
}

export default function SiteMap() {
  return null;
}







