import { useMemo } from 'react';

// third-party
import useSWR, { mutate } from 'swr';

// project-imports
import axiosServices, { fetcher } from 'utils/axios';

// ==============================|| API - EPISODES ||============================== //

const endpoints = {
  key: 'api/admin/episodes',
  list: 'api/admin/episodes',
  create: 'api/admin/episodes',
  read: (id) => `api/admin/episodes/${id}`,
  update: (id) => `api/admin/episodes/${id}`,
  delete: (id) => `api/admin/episodes/${id}`
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
      episodes: data?.data || [],
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
  } = useSWR([endpoints.read(id)], () => fetcher(endpoints.read(id)), {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      episode: data?.data || null,
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
    const response = await axiosServices.post(endpoints.create, episodeData);
    mutate(endpoints.key);
    return response.data;
  } catch (error) {
    return Promise.reject((error.response && error.response.data) || 'Error creating episode');
  }
}

// Update episode
export async function updateEpisode(id, episodeData) {
  try {
    const response = await axiosServices.put(endpoints.update(id), episodeData);
    mutate(endpoints.key);
    mutate(endpoints.read(id));
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
