import { createContext, useState, useEffect } from 'react';
import { getAllCustomers } from '../utils/services/customerService.js';

export const CustomerContext = createContext();

export function CustomerProvider({ children }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllCustomers();
      if (response.success) {
        setCustomers(response.data || []);
      } else {
        setError(response.message || 'Failed to fetch customers');
        console.error('Error fetching customers:', response.message);
      }
    } catch (err) {
      setError('An error occurred while fetching customers');
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = (customer) => {
    if (!customer || !customer.id) {
      console.error('Invalid customer object');
      return;
    }
    const updated = [...customers, customer];
    setCustomers(updated);
  };

  const removeCustomer = (customerId) => {
    if (!customerId) {
      console.error('Invalid customer ID');
      return;
    }
    const updated = customers.filter(c => c.id !== customerId);
    setCustomers(updated);
  };

  const getCustomerById = (customerId) => {
    if (!customerId) {
      console.error('Invalid customer ID');
      return null;
    }
    return customers.find(c => c.id === customerId);
  };

  const updateCustomer = (customerId, updatedData) => {
    if (!customerId || !updatedData) {
      console.error('Invalid customer ID or data');
      return;
    }
    const updated = customers.map(c =>
      c.id === customerId ? { ...c, ...updatedData } : c
    );
    setCustomers(updated);
  };

  return (
    <CustomerContext.Provider
      value={{
        customers,
        loading,
        error,
        addCustomer,
        removeCustomer,
        getCustomerById,
        updateCustomer,
        setCustomers,
        fetchCustomers
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}
