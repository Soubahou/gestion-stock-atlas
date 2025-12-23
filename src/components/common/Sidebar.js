import React, { useState, useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiPackage, 
  FiTrendingUp,
  FiChevronLeft,
  FiMenu
} from 'react-icons/fi';

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { path: '/dashboard', icon: <FiHome size={20} />, label: 'Dashboard' },
    { path: '/articles', icon: <FiPackage size={20} />, label: 'Articles' },
    { path: '/bons', icon: <FiTrendingUp size={20} />, label: 'Bons' },
  ];

  return (
    <div
      className="bg-dark text-white vh-100 position-sticky top-0 d-flex flex-column"
      style={{
        width: collapsed ? '80px' : '250px',
        transition: 'width 0.3s ease',
      }}
    >
      <div className="d-flex justify-content-end p-2">
        <button
          className="btn btn-sm btn-outline-light"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <FiMenu /> : <FiChevronLeft />}
        </button>
      </div>

      <Nav className="flex-column px-2">
        {menuItems.map((item) => (
          <Nav.Link
            key={item.path}
            as={Link}
            to={item.path}
            className={`mb-2 text-white d-flex align-items-center ${
              location.pathname === item.path ? 'bg-primary rounded' : ''
            }`}
            style={{
              justifyContent: collapsed ? 'center' : 'flex-start',
              padding: '12px'
            }}
            title={collapsed ? item.label : ''}
          >
            <span className={collapsed ? '' : 'me-3'}>
              {item.icon}
            </span>
            {!collapsed && item.label}
          </Nav.Link>
        ))}
      </Nav>

      {!collapsed && (
        <div className="mt-auto p-3">
          <h6 className="text-muted">Actions rapides</h6>
          <Link to="/articles/ajouter" className="btn btn-success w-100 mb-2">
            + Nouvel article
          </Link>
          <Link to="/bon/ajouter" className="btn btn-warning w-100">
            + Nouveau bon
          </Link>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
