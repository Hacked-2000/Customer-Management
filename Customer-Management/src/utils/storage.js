const CUSTOMERS_KEY = 'customers_data';
const CURRENT_ROUTE_KEY = 'current_route';

export const saveCustomersToStorage = (customers) => {
  try {
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
  } catch (error) {
    console.error('Failed to save customers to storage:', error);
  }
};

export const getCustomersFromStorage = () => {
  try {
    const data = localStorage.getItem(CUSTOMERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get customers from storage:', error);
    return [];
  }
};

export const clearCustomersStorage = () => {
  try {
    localStorage.removeItem(CUSTOMERS_KEY);
  } catch (error) {
    console.error('Failed to clear customers storage:', error);
  }
};

export const saveCurrentRoute = (route) => {
  try {
    localStorage.setItem(CURRENT_ROUTE_KEY, route);
  } catch (error) {
    console.error('Failed to save current route:', error);
  }
};

export const getCurrentRoute = () => {
  try {
    return localStorage.getItem(CURRENT_ROUTE_KEY) || '/customers';
  } catch (error) {
    console.error('Failed to get current route:', error);
    return '/customers';
  }
};
