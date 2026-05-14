import axiosServices from 'utils/axios';

export async function uploadMedia(file) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axiosServices.post('v1/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    return Promise.reject((error.response && error.response.data) || 'Error uploading file');
  }
}
