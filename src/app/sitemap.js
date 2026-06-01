// ============================================================
// src/app/sitemap.js
// Auto-generates /sitemap.xml for search engines
// ============================================================

const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://yoursite.com"
  ).replace(/\/+$/, "");
  
  // ------------------------------------------------------------
  // Safe date converter — won't crash if backend returns bad date
  // ------------------------------------------------------------
  function toIsoDate(d) {
    try {
      return d instanceof Date ? d : new Date(d);
    } catch {
      return new Date();
    }
  }
  
  export default async function sitemap() {
    const now = new Date();
  
    // ----------------------------------------------------------
    // STATIC ROUTES — public pages for non-authenticated users
    // ----------------------------------------------------------
    const staticRoutes = [
      {
        url: `${siteUrl}/`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 1,
      },
      {
        url: `${siteUrl}/explore`,
        lastModified: now,
        changeFrequency: "daily", // jobs update frequently
        priority: 0.9,
      },
      {
        url: `${siteUrl}/how-it-works`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
      },
      {
        url: `${siteUrl}/seekers`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
      },
      {
        url: `${siteUrl}/recruiters`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
      },
      // NOTE: login & signup are excluded intentionally —
      // no SEO value in indexing auth pages
    ];
  
    // ----------------------------------------------------------
    // DYNAMIC: Job / Listing pages
    // TODO: uncomment and implement when Java backend endpoint
    //       GET /api/jobs/public is ready
    //       Expected response: [{ slug, updatedAt }, ...]
    // ----------------------------------------------------------
    let jobEntries = [];
    // try {
    //   const res = await fetch(
    //     `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/public`,
    //     { next: { revalidate: 3600 } } // cache for 1 hour
    //   );
    //   const jobs = await res.json();
    //   jobEntries = (jobs || [])
    //     .filter((j) => j?.slug)
    //     .map((j) => ({
    //       url: `${siteUrl}/explore/${encodeURIComponent(String(j.slug))}`,
    //       lastModified: toIsoDate(j.updatedAt || now),
    //       changeFrequency: "weekly",
    //       priority: 0.7,
    //     }));
    // } catch {
    //   // Java backend down — skip dynamic job entries gracefully
    //   jobEntries = [];
    // }
  
    // ----------------------------------------------------------
    // DYNAMIC: Seeker public profiles
    // TODO: uncomment when GET /api/seekers/public is ready
    //       Expected response: [{ username, updatedAt }, ...]
    //       Only include seekers who have set profile to public
    // ----------------------------------------------------------
    let seekerEntries = [];
    // try {
    //   const res = await fetch(
    //     `${process.env.NEXT_PUBLIC_API_URL}/api/seekers/public`,
    //     { next: { revalidate: 3600 } }
    //   );
    //   const seekers = await res.json();
    //   seekerEntries = (seekers || [])
    //     .filter((s) => s?.username)
    //     .map((s) => ({
    //       url: `${siteUrl}/seekers/${encodeURIComponent(String(s.username))}`,
    //       lastModified: toIsoDate(s.updatedAt || now),
    //       changeFrequency: "monthly",
    //       priority: 0.6,
    //     }));
    // } catch {
    //   // Java backend down — skip seeker entries gracefully
    //   seekerEntries = [];
    // }
  
    // ----------------------------------------------------------
    // DYNAMIC: Recruiter public profiles
    // TODO: uncomment when GET /api/recruiters/public is ready
    //       Expected response: [{ username, updatedAt }, ...]
    //       Only include recruiters who have set profile to public
    // ----------------------------------------------------------
    let recruiterEntries = [];
    // try {
    //   const res = await fetch(
    //     `${process.env.NEXT_PUBLIC_API_URL}/api/recruiters/public`,
    //     { next: { revalidate: 3600 } }
    //   );
    //   const recruiters = await res.json();
    //   recruiterEntries = (recruiters || [])
    //     .filter((r) => r?.username)
    //     .map((r) => ({
    //       url: `${siteUrl}/recruiters/${encodeURIComponent(String(r.username))}`,
    //       lastModified: toIsoDate(r.updatedAt || now),
    //       changeFrequency: "monthly",
    //       priority: 0.6,
    //     }));
    // } catch {
    //   // Java backend down — skip recruiter entries gracefully
    //   recruiterEntries = [];
    // }
  
    // ----------------------------------------------------------
    // Merge all routes and return
    // ----------------------------------------------------------
    return [
      ...staticRoutes,
      ...jobEntries,       // empty until TODO above is done
      ...seekerEntries,    // empty until TODO above is done
      ...recruiterEntries, // empty until TODO above is done
    ];
  }