/**
 * Centralized anime service backed by Kitsu API.
 * Formats Kitsu responses into the shape expected by the frontend components.
 */

const BASE_URL = 'https://kitsu.io/api/edge';

/**
 * Maps a Kitsu anime item + optional included array into the standard anime object
 */
export function formatKitsuAnime(item, included = []) {
  if (!item || !item.attributes) return null;
  const a = item.attributes;

  // Extract categories for this anime
  let genres = [];
  if (item.relationships?.categories?.data && included.length > 0) {
    const categoryIds = new Set(item.relationships.categories.data.map(c => c.id));
    genres = included
      .filter(inc => inc.type === 'categories' && categoryIds.has(inc.id))
      .map(cat => ({ name: cat.attributes?.title || cat.attributes?.slug || 'Anime' }));
  } else if (included.length > 0) {
    genres = included
      .filter(inc => inc.type === 'categories')
      .map(cat => ({ name: cat.attributes?.title || cat.attributes?.slug || 'Anime' }));
  }

  const title = a.canonicalTitle || a.titles?.en || a.titles?.en_jp || a.slug || 'Untitled';
  const title_english = a.titles?.en || a.titles?.en_us || a.canonicalTitle || title;
  const title_japanese = a.titles?.ja_jp || a.titles?.en_jp || '';

  const largeImg = a.posterImage?.large || a.posterImage?.original || a.posterImage?.medium || '';
  const mediumImg = a.posterImage?.medium || a.posterImage?.small || largeImg;

  // Kitsu averageRating is 0-100; MAL score is 0-10
  const score = a.averageRating ? (parseFloat(a.averageRating) / 10).toFixed(1) : (a.ratingRank ? '7.8' : 'N/A');

  let status = 'Finished Airing';
  if (a.status === 'current') status = 'Currently Airing';
  else if (a.status === 'upcoming') status = 'Not yet aired';

  const year = a.startDate ? new Date(a.startDate).getFullYear() : (a.createdAt ? new Date(a.createdAt).getFullYear() : 'N/A');

  return {
    mal_id: Number(item.id) || item.id,
    id: String(item.id),
    title,
    title_english,
    title_japanese,
    score,
    rating: score,
    imageUrl: largeImg,
    images: {
      jpg: {
        large_image_url: largeImg,
        image_url: mediumImg,
        small_image_url: a.posterImage?.small || mediumImg
      }
    },
    synopsis: a.synopsis || a.description || 'No synopsis available.',
    genres,
    status,
    episodes: a.episodeCount || (a.status === 'current' ? 'Airing' : 1),
    type: (a.subtype || a.showType || 'TV').toUpperCase(),
    year,
    season: a.startDate ? (['Winter', 'Spring', 'Summer', 'Fall'][Math.floor(new Date(a.startDate).getMonth() / 3)]) : '',
    duration: a.episodeLength ? `${a.episodeLength} min` : '24 min',
    trailer: {
      youtube_id: a.youtubeVideoId || null
    },
    aired: {
      string: `${a.startDate || '?'} to ${a.endDate || '?'}`
    }
  };
}

/**
 * Fetch top/popular anime
 */
export async function getTopAnime(page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  const res = await fetch(`${BASE_URL}/anime?sort=-userCount&page[limit]=${limit}&page[offset]=${offset}&include=categories`);
  if (!res.ok) throw new Error(`Kitsu top anime error: ${res.status}`);
  const data = await res.json();
  const included = data.included || [];
  const list = (data.data || []).map(item => formatKitsuAnime(item, included)).filter(Boolean);
  list.totalCount = data.meta?.count || list.length;
  // Kitsu practical offset limit is 10,000 (~500 pages)
  list.totalPages = Math.min(Math.max(1, Math.ceil(list.totalCount / limit)), 500);
  return list;
}

/**
 * Fetch currently airing anime
 */
export async function getCurrentAnime(page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  const res = await fetch(`${BASE_URL}/anime?filter[status]=current&sort=-userCount&page[limit]=${limit}&page[offset]=${offset}&include=categories`);
  if (!res.ok) throw new Error(`Kitsu current anime error: ${res.status}`);
  const data = await res.json();
  const included = data.included || [];
  const list = (data.data || []).map(item => formatKitsuAnime(item, included)).filter(Boolean);
  list.totalCount = data.meta?.count || list.length;
  list.totalPages = Math.min(Math.max(1, Math.ceil(list.totalCount / limit)), 500);
  return list;
}

/**
 * Fetch anime by genre / category
 */
export async function getAnimeByGenre(genreName, page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  const category = encodeURIComponent(String(genreName).toLowerCase().replace(/\s+/g, '-'));
  const res = await fetch(`${BASE_URL}/anime?filter[categories]=${category}&sort=-userCount&page[limit]=${limit}&page[offset]=${offset}&include=categories`);
  if (!res.ok) throw new Error(`Kitsu genre anime error: ${res.status}`);
  const data = await res.json();
  const included = data.included || [];
  const list = (data.data || []).map(item => formatKitsuAnime(item, included)).filter(Boolean);
  list.totalCount = data.meta?.count || list.length;
  list.totalPages = Math.min(Math.max(1, Math.ceil(list.totalCount / limit)), 500);
  return list;
}

/**
 * Search anime by text query
 */
export async function searchAnime(query, limit = 20) {
  if (!query || !query.trim()) return [];
  const res = await fetch(`${BASE_URL}/anime?filter[text]=${encodeURIComponent(query.trim())}&page[limit]=${limit}&include=categories`);
  if (!res.ok) throw new Error(`Kitsu search error: ${res.status}`);
  const data = await res.json();
  const included = data.included || [];
  return (data.data || []).map(item => formatKitsuAnime(item, included)).filter(Boolean);
}

/**
 * Fetch details for a single anime by Kitsu ID or legacy MAL ID
 */
export async function getAnimeById(id) {
  if (!id) return null;

  // 1. Try direct Kitsu ID lookup
  try {
    const res = await fetch(`${BASE_URL}/anime/${id}?include=categories`);
    if (res.ok) {
      const data = await res.json();
      if (data.data) {
        return formatKitsuAnime(data.data, data.included || []);
      }
    }
  } catch (err) {
    console.warn("Direct Kitsu fetch error, falling back to MAL mapping:", err);
  }

  // 2. Try MAL ID mapping
  try {
    const mapRes = await fetch(`${BASE_URL}/mappings?filter[externalSite]=myanimelist/anime&filter[externalId]=${id}&include=item.categories`);
    if (mapRes.ok) {
      const mapData = await mapRes.json();
      const animeItem = (mapData.included || []).find(i => i.type === 'anime');
      if (animeItem) {
        return formatKitsuAnime(animeItem, mapData.included || []);
      }
    }
  } catch (err) {
    console.warn("Kitsu mapping lookup failed:", err);
  }

  return null;
}

/**
 * Fetch episodes for an anime by Kitsu ID
 */
export async function getAnimeEpisodes(animeId, limit = 100) {
  if (!animeId) return [];

  // If animeId looks like a MAL ID that isn't the Kitsu ID, resolve it first
  let targetId = animeId;
  try {
    const checkRes = await fetch(`${BASE_URL}/anime/${animeId}`);
    if (!checkRes.ok) {
      const mapRes = await fetch(`${BASE_URL}/mappings?filter[externalSite]=myanimelist/anime&filter[externalId]=${animeId}&include=item`);
      if (mapRes.ok) {
        const mapData = await mapRes.json();
        const found = (mapData.included || []).find(i => i.type === 'anime');
        if (found) targetId = found.id;
      }
    }
  } catch (e) {
    // ignore
  }

  try {
    const res = await fetch(`${BASE_URL}/anime/${targetId}/episodes?page[limit]=${limit}&sort=number`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data || []).map(ep => ({
      mal_id: ep.attributes.number || ep.id,
      title: ep.attributes.canonicalTitle || `Episode ${ep.attributes.number || ''}`,
      aired: ep.attributes.airdate || null,
      score: null
    }));
  } catch (err) {
    console.error("Failed to fetch episodes:", err);
    return [];
  }
}
