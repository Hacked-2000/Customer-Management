import axios from "axios";

const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

const makeApiRequest = async (url, options) => {
  const { method, data, params } = options;
  const lowerCaseMethod = method.toLowerCase();

  try {
    const response = await axiosInstance({
      method: lowerCaseMethod,
      url,
      ...(data && { data }),
      ...(params && { params }),
    });

    return response.data;
  } catch (error) {
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      return {
        success: false,
        message: error.code === 'ECONNABORTED' 
          ? 'Request timeout. Please try again.' 
          : 'Network error. Please check your connection.',
        errors: [],
        data: null,
      };
    }

    // Handle API errors with response
    if (error.response?.data) {
      return error.response.data;
    }

    // Handle other errors
    console.error('API error:', error.message);
    return {
      success: false,
      message: error.message || "Something went wrong",
      errors: [],
      data: null,
    };
  }
};

export default makeApiRequest;


