import { useMemo } from 'react';

// third-party
import useSWR, { mutate } from 'swr';

// project-imports
import axiosServices, { fetcher } from 'utils/axios';

// ==============================|| API - WORKSHEETS ||============================== //

const endpoints = {
  key: 'api/admin/worksheets',
  list: 'api/admin/worksheets',
  create: 'api/admin/worksheets',
  read: (id) => `api/admin/worksheets/${id}`,
  update: (id) => `api/admin/worksheets/${id}`,
  delete: (id) => `api/admin/worksheets/${id}`
};

// Get all worksheets
export function useGetWorksheets(params = {}) {
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
      worksheets: data?.data || [],
      worksheetsLoading: isLoading,
      worksheetsError: error,
      worksheetsMutate: mutateData
    }),
    [data, isLoading, error, mutateData]
  );

  return memoizedValue;
}

// Get single worksheet
export function useGetWorksheet(id) {
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
      worksheet: data?.data || null,
      worksheetLoading: isLoading,
      worksheetError: error,
      worksheetMutate: mutateData
    }),
    [data, isLoading, error, mutateData]
  );

  return memoizedValue;
}

// Create worksheet
export async function createWorksheet(worksheetData) {
  try {
    const response = await axiosServices.post(endpoints.create, worksheetData);
    mutate(endpoints.key);
    return response.data;
  } catch (error) {
    return Promise.reject((error.response && error.response.data) || 'Error creating worksheet');
  }
}

// Update worksheet
export async function updateWorksheet(id, worksheetData) {
  try {
    const response = await axiosServices.put(endpoints.update(id), worksheetData);
    mutate(endpoints.key);
    mutate(endpoints.read(id));
    return response.data;
  } catch (error) {
    return Promise.reject((error.response && error.response.data) || 'Error updating worksheet');
  }
}

// Delete worksheet
export async function deleteWorksheet(id) {
  try {
    const response = await axiosServices.delete(endpoints.delete(id));
    mutate(endpoints.key);
    return response.data;
  } catch (error) {
    return Promise.reject((error.response && error.response.data) || 'Error deleting worksheet');
  }
}
