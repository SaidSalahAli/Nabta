import { useMemo } from 'react';

// third-party
import useSWR, { mutate } from 'swr';

// project-imports
import axiosServices, { fetcher } from 'utils/axios';
import { mapCategories, mapCategory } from 'utils/dataMapper';

// ==============================|| API - EPISODE CATEGORIES ||============================== //

const endpoints = {
  key: 'v1/categories',
  list: 'v1/categories',
  create: 'v1/admin/categories',
  read: (id) => `v1/categories/${id}`,
  update: (id) => `v1/admin/categories/${id}`,
  delete: (id) => `v1/admin/categories/${id}`,
  search: (name) => `v1/categories/search?name=${name}`
};

// Convert form values to API snake_case format
const convertToApiFormat = (formData) => ({
  name_ar: formData.name_ar || formData.nameAr || formData.NameAr || '',
  name_en: formData.name_en || formData.nameEn || formData.NameEn || '',
  description_ar: formData.description_ar || formData.descriptionAr || formData.DescriptionAr || '',
  description_en: formData.description_en || formData.descriptionEn || formData.DescriptionEn || '',
  icon_url: formData.icon_url || formData.iconUrl || formData.IconUrl || formData.image || formData.Image || '',
  cover_image: formData.cover_image || formData.coverImage || formData.CoverImage || '',
  color_code: formData.color_code || formData.colorCode || formData.ColorCode || '',
  display_order: formData.display_order ?? formData.displayOrder ?? formData.DisplayOrder ?? 0,
  is_active: formData.is_active !== undefined ? Boolean(formData.is_active) : true,
  type: formData.type || 'episodes'
});

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
      categories: mapCategories(Array.isArray(data) ? data : data?.data || []),
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
      category: mapCategory(data?.data || null),
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
    const apiData = convertToApiFormat(categoryData);
    const response = await axiosServices.post(endpoints.create, apiData);
    mutate(endpoints.key);
    return response.data;
  } catch (error) {
    return Promise.reject((error.response && error.response.data) || 'Error creating category');
  }
}

// Update category
export async function updateEpisodeCategory(id, categoryData) {
  try {
    const apiData = convertToApiFormat(categoryData);
    const response = await axiosServices.put(endpoints.update(id), apiData);
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

// Search categories by name
export async function searchEpisodeCategories(name) {
  try {
    const response = await axiosServices.get(endpoints.search(name));
    return response.data;
  } catch (error) {
    return Promise.reject((error.response && error.response.data) || 'Error searching categories');
  }
}
