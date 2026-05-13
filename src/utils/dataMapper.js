// ==============================|| DATA MAPPER UTILITY ||============================== //

/**
 * Maps category data from API to standardized format
 * Handles both field naming conventions (Id/id, NameAr/name_ar, etc.)
 */
export const mapCategory = (category) => {
  if (!category) return null;

  return {
    id: category.Id || category.id,
    name_ar: category.NameAr || category.name_ar,
    name_en: category.NameEn || category.name_en,
    description_ar: category.DescriptionAr || category.description_ar,
    description_en: category.DescriptionEn || category.description_en,
    image: category.Image || category.image,
    // Keep original for reference
    ...category
  };
};

/**
 * Maps episode data from API to standardized format
 */
export const mapEpisode = (episode) => {
  if (!episode) return null;

  return {
    id: episode.ID || episode.id,
    category_id: episode.CategoryId || episode.category_id,
    title_ar: episode.TitleAr || episode.title_ar,
    title_en: episode.TitleEn || episode.title_en,
    short_description_ar: episode.ShortDescriptionAr || episode.short_description_ar,
    short_description_en: episode.ShortDescriptionEn || episode.short_description_en,
    description_ar: episode.DescriptionAr || episode.description_ar,
    description_en: episode.DescriptionEn || episode.description_en,
    video_url: episode.VideoUrl || episode.video_url,
    video_type: episode.VideoType || episode.video_type,
    thumbnail_image: episode.ThumbnailImage || episode.thumbnail_image,
    cover_image: episode.CoverImage || episode.cover_image,
    episode_number: episode.EpisodeNumber || episode.episode_number,
    duration_seconds: episode.DurationSeconds || episode.duration_seconds,
    transcript_ar: episode.TranscriptAr || episode.transcript_ar,
    transcript_en: episode.TranscriptEn || episode.transcript_en,
    is_published: episode.IsPublished || episode.is_published,
    is_featured: episode.IsFeatured || episode.is_featured,
    has_worksheets: episode.HasWorksheets || episode.has_worksheets,
    slug: episode.Slug || episode.slug,
    sort_order: episode.SortOrder || episode.sort_order,
    published_at: episode.PublishedAt || episode.published_at,
    created_at: episode.CreatedAt || episode.created_at,
    updated_at: episode.UpdatedAt || episode.updated_at,
    // Keep original for reference
    ...episode
  };
};

/**
 * Maps array of categories
 */
export const mapCategories = (categories) => {
  if (!Array.isArray(categories)) return [];
  return categories.map(mapCategory);
};

/**
 * Maps array of episodes
 */
export const mapEpisodes = (episodes) => {
  if (!Array.isArray(episodes)) return [];
  return episodes.map(mapEpisode);
};
