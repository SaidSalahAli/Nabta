import { useMemo } from 'react';

// third-party
import useSWR, { mutate } from 'swr';

// project-imports
import axiosServices, { fetcher } from 'utils/axios';
import { mapEpisodes, mapEpisode } from 'utils/dataMapper';

// ==============================|| API - EPISODES ||============================== //

const endpoints = {
  key: 'api/Episodes',
  list: 'api/Episodes/List',
  create: 'api/Episodes/Add',
  read: (id) => `api/Episodes/GetById?id=${id}`,
  update: 'api/Episodes/Update',
  delete: (id) => `api/Episodes/Delete?id=${id}`,
  byCategory: (categoryId) => `api/Episodes/ByCategory?categoryId=${categoryId}`,
  search: 'api/Episodes/search'
};

// Convert local field names to API field names (snake_case to PascalCase)
const convertToApiFormat = (episodeData) => {
  const apiData = {
    ID: episodeData.ID || episodeData.id,
    CategoryId: episodeData.category_id || episodeData.CategoryId,
    TitleAr: episodeData.title_ar || episodeData.TitleAr,
    ShortDescriptionAr: episodeData.short_description_ar || episodeData.ShortDescriptionAr,
    DescriptionAr: episodeData.description_ar || episodeData.DescriptionAr,
    VideoUrl: episodeData.video_url || episodeData.VideoUrl,
    VideoType: episodeData.video_type || episodeData.VideoType,
    EpisodeNumber: episodeData.episode_number || episodeData.EpisodeNumber,
    DurationSeconds: episodeData.duration_seconds || episodeData.DurationSeconds,
    IsFeatured:
      episodeData.is_featured !== undefined
        ? episodeData.is_featured
        : episodeData.IsFeatured !== undefined
          ? episodeData.IsFeatured
          : false,
    HasWorksheets:
      episodeData.has_worksheets !== undefined
        ? episodeData.has_worksheets
        : episodeData.HasWorksheets !== undefined
          ? episodeData.HasWorksheets
          : false
  };

  // Add optional fields only if they have values
  if (episodeData.title_en || episodeData.TitleEn) {
    apiData.TitleEn = episodeData.title_en || episodeData.TitleEn;
  }

  if (episodeData.short_description_en || episodeData.ShortDescriptionEn) {
    apiData.ShortDescriptionEn = episodeData.short_description_en || episodeData.ShortDescriptionEn;
  }

  if (episodeData.description_en || episodeData.DescriptionEn) {
    apiData.DescriptionEn = episodeData.description_en || episodeData.DescriptionEn;
  }

  if (episodeData.thumbnail_image || episodeData.ThumbnailImage) {
    apiData.ThumbnailImage = episodeData.thumbnail_image || episodeData.ThumbnailImage;
  }

  if (episodeData.cover_image || episodeData.CoverImage) {
    apiData.CoverImage = episodeData.cover_image || episodeData.CoverImage;
  }

  if (episodeData.transcript_ar || episodeData.TranscriptAr) {
    apiData.TranscriptAr = episodeData.transcript_ar || episodeData.TranscriptAr;
  }

  if (episodeData.transcript_en || episodeData.TranscriptEn) {
    apiData.TranscriptEn = episodeData.transcript_en || episodeData.TranscriptEn;
  }

  if (episodeData.published_at || episodeData.PublishedAt) {
    apiData.PublishedAt = episodeData.published_at || episodeData.PublishedAt;
  }

  return apiData;
};

// Get all episodes with filters
export function useGetEpisodes(params = {}) {
  const {
    data,
    isLoading,
    error,
    mutate: mutateData
  } = useSWR([endpoints.key, params], () => fetcher([endpoints.list, { params }]), {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      episodes: mapEpisodes(Array.isArray(data) ? data : data?.data || []),
      episodesLoading: isLoading,
      episodesError: error,
      episodesMutate: mutateData
    }),
    [data, isLoading, error, mutateData]
  );

  return memoizedValue;
}

// Get single episode
export function useGetEpisode(id) {
  const {
    data,
    isLoading,
    error,
    mutate: mutateData
  } = useSWR(id ? [endpoints.read(id)] : null, () => fetcher(endpoints.read(id)), {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      episode: mapEpisode(data?.data || data || null),
      episodeLoading: isLoading,
      episodeError: error,
      episodeMutate: mutateData
    }),
    [data, isLoading, error, mutateData]
  );

  return memoizedValue;
}

// Create episode
export async function createEpisode(episodeData) {
  try {
    const apiData = convertToApiFormat(episodeData);
    const response = await axiosServices.post(endpoints.create, apiData);
    mutate(endpoints.key);
    return response.data;
  } catch (error) {
    return Promise.reject((error.response && error.response.data) || 'Error creating episode');
  }
}

// Update episode
export async function updateEpisode(episodeData) {
  try {
    const apiData = convertToApiFormat(episodeData);
    const response = await axiosServices.put(endpoints.update, apiData);
    mutate(endpoints.key);
    mutate(endpoints.read(apiData.ID));
    return response.data;
  } catch (error) {
    return Promise.reject((error.response && error.response.data) || 'Error updating episode');
  }
}

// Delete episode
export async function deleteEpisode(id) {
  try {
    const response = await axiosServices.delete(endpoints.delete(id));
    mutate(endpoints.key);
    return response.data;
  } catch (error) {
    return Promise.reject((error.response && error.response.data) || 'Error deleting episode');
  }
}

// Get episodes by category
export async function getEpisodesByCategory(categoryId) {
  try {
    const response = await axiosServices.get(endpoints.byCategory(categoryId));
    return mapEpisodes(Array.isArray(response.data) ? response.data : response.data?.data || []);
  } catch (error) {
    return Promise.reject((error.response && error.response.data) || 'Error fetching episodes');
  }
}

// Search episodes
export async function searchEpisodes(searchParams) {
  try {
    // Convert search params to API format
    const apiSearchParams = {
      Title: searchParams.title || searchParams.Title,
      CategoryId: searchParams.categoryId || searchParams.CategoryId,
      IsFeatured: searchParams.isFeatured !== undefined ? searchParams.isFeatured : searchParams.IsFeatured
    };

    const response = await axiosServices.post(endpoints.search, apiSearchParams);
    return mapEpisodes(Array.isArray(response.data) ? response.data : response.data?.data || []);
  } catch (error) {
    return Promise.reject((error.response && error.response.data) || 'Error searching episodes');
  }
}
