import makeApiRequest from '../makeApiRequest.js';
import { apiUrls } from '../apiEndpoints.js';

export const addCustomer = async (customerData) => {
  const response = await makeApiRequest(
    apiUrls.AddCustomer,
    {
      method: 'POST',
      data: customerData
    }
  );
  return response;
};

export const getAllCustomers = async () => {
  const response = await makeApiRequest(
    apiUrls.GetAllCustomers,
    {
      method: 'GET'
    }
  );
  return response;
};

export const deleteCustomer = async (customerId) => {
  const response = await makeApiRequest(
    apiUrls.DeleteCustomer(customerId),
    {
      method: 'DELETE'
    }
  );
  return response;
};

export const getCustomerById = async (customerId) => {
  const response = await makeApiRequest(
    apiUrls.GetCustomerById(customerId),
    {
      method: 'GET'
    }
  );
  return response;
};

export const updateCustomer = async (customerId, customerData) => {
  const response = await makeApiRequest(
    apiUrls.UpdateCustomer(customerId),
    {
      method: 'PUT',
      data: customerData
    }
  );
  return response;
};
