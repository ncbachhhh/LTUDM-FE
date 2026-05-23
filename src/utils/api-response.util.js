export const unwrapApiData = (response) => response.data?.data;

export const successResponse = (response, fallbackData = null) => ({
  isSuccess: true,
  data: unwrapApiData(response) ?? fallbackData,
  message: response.data?.message,
});

export const failureResponse = (error, fallbackMessage, fallbackData = null) => ({
  isSuccess: false,
  data: fallbackData,
  message: error.response?.data?.message || error.message || fallbackMessage,
});

