const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export const apiUrls = {
  AddCustomer: `${BASE_URL}/customers`,
  GetAllCustomers: `${BASE_URL}/customers`,
  GetCustomerById: (id) => `${BASE_URL}/customers/${id}`,
  UpdateCustomer: (id) => `${BASE_URL}/customers/${id}`,
  DeleteCustomer: (id) => `${BASE_URL}/customers/${id}`,
};

export { BASE_URL };
