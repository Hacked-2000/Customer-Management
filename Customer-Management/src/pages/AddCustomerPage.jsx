import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomForm from '../components/CustomForm';
import { addCustomer } from '../utils/services/customerService.js';
import { showSuccess, showError } from '../utils/toast.js';
import { CustomerContext } from '../context/CustomerContext.jsx';

export default function AddCustomerPage() {
  const navigate = useNavigate();
  const { addCustomer: addToContext } = useContext(CustomerContext);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const fields = [
    { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Enter customer name' },
    { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'Enter email address' },
    { name: 'phone', label: 'Phone Number', type: 'tel', required: true, placeholder: 'Enter phone number' }
  ];

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});

    try {
      const response = await addCustomer(formData);

      if (response.success) {
        if (!response.data) {
          showError('Invalid response from server');
          setLoading(false);
          return;
        }
        addToContext(response.data);
        showSuccess('Customer added successfully');
        navigate('/customers');
      } else {
        // Handle validation errors
        if (response.errors && Array.isArray(response.errors) && response.errors.length > 0) {
          showError(response.errors[0]);
        } else {
          showError(response.message || 'Failed to add customer');
        }
      }
    } catch (error) {
      console.error('Error adding customer:', error);
      showError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8 col-xl-6">
        <CustomForm
          title="Add New Customer"
          breadcrumb="Customers / Add"
          fields={fields}
          values={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onClose={() => navigate('/customers')}
          onBack={() => navigate('/customers')}
          backLabel="Back"
          submitLabel="Create"
          loading={loading}
        />
      </div>
    </div>
  );
}
