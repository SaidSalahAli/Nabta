import { useMemo } from 'react';

// third-party
import useSWR, { mutate } from 'swr';

// project-imports
import axiosServices, { fetcher } from 'utils/axios';

// ==============================|| API - EPISODE CATEGORIES ||============================== //

const endpoints = {
  key: 'api/admin/episode-categories',
  list: 'api/admin/episode-categories',
  create: 'api/admin/episode-categories',
  read: (id) => `api/admin/episode-categories/${id}`,
  update: (id) => `api/admin/episode-categories/${id}`,
  delete: (id) => `api/admin/episode-categories/${id}`
};

// Get all categories
export function useGetEpisodeCategories(params = {}) {
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
      categories: data?.data || [],
      categoriesLoading: isLoading,
      categoriesError: error,
      categoriesMutate: mutateData
    }),
    [data, isLoading, error, mutateData]
  );

  return memoizedValue;
}

// Get single category
export function useGetEpisodeCategory(id) {
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
      category: data?.data || null,
      categoryLoading: isLoading,
      categoryError: error,
      categoryMutate: mutateData
    }),
    [data, isLoading, error, mutateData]
  );

  return memoizedValue;
}

// Create category
export async function createEpisodeCategory(categoryData) {
  try {
    const response = await axiosServices.post(endpoints.create, categoryData);
    mutate(endpoints.key);
    return response.data;
  } catch (error) {
    return Promise.reject((error.response && error.response.data) || 'Error creating category');
  }
}

// Update category
export async function updateEpisodeCategory(id, categoryData) {
  try {
    const response = await axiosServices.put(endpoints.update(id), categoryData);
    mutate(endpoints.key);
    mutate(endpoints.read(id));
    return response.data;
  } catch (error) {
    return Promise.reject((error.response && error.response.data) || 'Error updating category');
  }
}

// Delete category
export async function deleteEpisodeCategory(id) {
  try {
    const response = await axiosServices.delete(endpoints.delete(id));
    mutate(endpoints.key);
    return response.data;
  } catch (error) {
    return Promise.reject((error.response && error.response.data) || 'Error deleting category');
  }
}
