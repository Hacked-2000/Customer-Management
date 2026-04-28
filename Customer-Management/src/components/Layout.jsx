import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="layout-wrapper">
      {/* Header */}
      <header className="layout-header">
        <div className="header-inner">
          <div className="header-brand">
            <span className="brand-icon">📊</span>
            <h1 className="brand-name">Customer Management</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="layout-main">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="layout-footer">
        <div className="footer-inner">
          {/* <div className="footer-info">
            <p className="footer-text">
              <strong>Email:</strong> <a href="mailto:support@example.com">support@example.com</a>
            </p>
            <p className="footer-text">
              <strong>Phone:</strong> <a href="tel:+15551234567">+1 (555) 123-4567</a>
            </p>
          </div> */}
          <p className="footer-copyright">
            &copy; 2024 Customer Management System. All rights reserved.
          </p>
        </div>
        
      </footer>
    </div>
  );
}
