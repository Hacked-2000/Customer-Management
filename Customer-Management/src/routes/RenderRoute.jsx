import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { saveCurrentRoute, getCurrentRoute } from '../utils/storage.js';
import Layout from '../components/Layout.jsx';
import CustomersTablePage from '../pages/CustomersTablePage.jsx';
import AddCustomerPage from '../pages/AddCustomerPage.jsx';
import ViewCustomerPage from '../pages/ViewCustomerPage.jsx';
import EditCustomerPage from '../pages/EditCustomerPage.jsx';

function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    saveCurrentRoute(location.pathname);
  }, [location.pathname]);

  return null;
}

export default function RenderRoute() {
  const initialRoute = getCurrentRoute();

  return (
    <>
      <RouteTracker />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/customers" element={<CustomersTablePage />} />
          <Route path="/add" element={<AddCustomerPage />} />
          <Route path="/view/:id" element={<ViewCustomerPage />} />
          <Route path="/edit/:id" element={<EditCustomerPage />} />
          <Route path="/" element={<Navigate to={initialRoute} replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/customers" replace />} />
      </Routes>
    </>
  );
}
