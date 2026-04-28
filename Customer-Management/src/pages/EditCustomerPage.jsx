import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CustomForm from '../components/CustomForm';
import { updateCustomer as apiUpdateCustomer, getCustomerById as apiGetCustomerById } from '../utils/services/customerService.js';
import { showSuccess, showError } from '../utils/toast.js';
import { CustomerContext } from '../context/CustomerContext.jsx';

export default function EditCustomerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateCustomer } = useContext(CustomerContext);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        if (!id) {
          showError('Invalid customer ID');
          navigate('/customers');
          return;
        }

        const response = await apiGetCustomerById(id);
        if (response.success && response.data) {
          setFormData({
            name: response.data.name,
            email: response.data.email,
            phone: response.data.phone
          });
        } else {
          showError(response.message || 'Customer not found');
          navigate('/customers');
        }
      } catch (error) {
        console.error('Error fetching customer:', error);
        showError('Failed to load customer details');
        navigate('/customers');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchCustomer();
  }, [id, navigate]);

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
      if (!id) {
        showError('Invalid customer ID');
        setLoading(false);
        return;
      }

      const response = await apiUpdateCustomer(id, formData);

      if (response.success) {
        updateCustomer(id, formData);
        showSuccess('Customer updated successfully');
        navigate('/customers');
      } else {
        // Handle validation errors
        if (response.errors && Array.isArray(response.errors) && response.errors.length > 0) {
          showError(response.errors[0]);
        } else {
          showError(response.message || 'Failed to update customer');
        }
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      showError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8 col-xl-6">
        <CustomForm
          title="Edit Customer"
          breadcrumb="Customers / Edit"
          fields={fields}
          values={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onClose={() => navigate('/customers')}
          onBack={() => navigate('/customers')}
          backLabel="Back"
          submitLabel="Update"
          loading={loading}
        />
      </div>
    </div>
  );
}
