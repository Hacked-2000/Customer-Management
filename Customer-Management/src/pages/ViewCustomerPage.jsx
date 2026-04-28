import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CustomForm from '../components/CustomForm';
import { getCustomerById as apiGetCustomerById } from '../utils/services/customerService.js';
import { showError } from '../utils/toast.js';

export default function ViewCustomerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

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
          setCustomer(response.data);
        } else {
          showError(response.message || 'Customer not found');
          navigate('/customers');
        }
      } catch (error) {
        console.error('Error fetching customer:', error);
        showError('Failed to load customer details');
        navigate('/customers');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  const fields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel', required: true }
  ];

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8 col-xl-6">
        <CustomForm
          title="Customer Details"
          breadcrumb="Customers / View"
          fields={fields}
          values={customer}
          viewMode={true}
          onClose={() => navigate('/customers')}
          onBack={() => navigate('/customers')}
          backLabel="Back to List"
        />
      </div>
    </div>
  );
}
