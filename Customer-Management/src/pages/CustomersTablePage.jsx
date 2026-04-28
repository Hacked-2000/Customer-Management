import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomTable from '../components/CustomTable';
import { deleteCustomer } from '../utils/services/customerService.js';
import { showSuccess, showError } from '../utils/toast.js';
import { CustomerContext } from '../context/CustomerContext.jsx';

export default function CustomersTablePage() {
  const navigate = useNavigate();
  const { customers, removeCustomer, loading, error } = useContext(CustomerContext);
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (row) => {
    if (!row || !row.id) {
      showError('Invalid customer data');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this customer?')) {
      return;
    }

    setDeletingId(row.id);
    try {
      const response = await deleteCustomer(row.id);

      if (response.success) {
        removeCustomer(row.id);
        showSuccess('Customer deleted successfully');
      } else {
        if (response.errors && Array.isArray(response.errors) && response.errors.length > 0) {
          showError(response.errors[0]);
        } else {
          showError(response.message || 'Failed to delete customer');
        }
      }
    } catch (err) {
      console.error('Error deleting customer:', err);
      showError('An unexpected error occurred while deleting customer');
    } finally {
      setDeletingId(null);
    }
  };

  const columns = [
    { label: 'Name', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: 'Phone', key: 'phone' }
  ];

  const actions = [
    { label: 'View', onClick: (row) => navigate(`/view/${row.id}`) },
    { label: 'Edit', onClick: (row) => navigate(`/edit/${row.id}`) },
    { label: 'Delete', onClick: handleDelete, color: 'error' }
  ];

  const topActions = [
    { label: '+ Add Customer', onClick: () => navigate('/add') }
  ];

  return (
    <CustomTable
      title="Customers"
      breadcrumb="Dashboard / Customers"
      columns={columns}
      data={customers}
      actions={actions}
      topActions={topActions}
      totalCount={customers.length}
      page={0}
      rowsPerPage={10}
      onPageChange={() => {}}
      onRowsPerPageChange={() => {}}
      loading={loading}
    />
  );
}
