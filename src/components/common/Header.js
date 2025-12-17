import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FiBell, FiUser } from 'react-icons/fi';
import { GiHammerBreak } from "react-icons/gi";

const Header = () => {
  const navigate = useNavigate();

  return (
    <Navbar 
      bg="dark" 
      variant="dark" 
      expand="lg" 
      className="shadow sticky-top"
      style={{ zIndex: 1030 }}
    >
      <Container fluid>
        <Navbar.Brand as={Link} to="/dashboard" className="fw-bold">
          <GiHammerBreak className='me-3 mb-2'/>
          Atlas Stock
        </Navbar.Brand>
        
        <Nav className="ms-auto">
          <Button 
            variant="outline-light" 
            className="me-3 position-relative"
            onClick={() => navigate('/dashboard')}
          >
            <FiBell size={20} />
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              3
            </span>
          </Button>
          
          <Button variant="outline-light" className="d-flex align-items-center">
            <FiUser className="me-2" />
            M. Rachid
          </Button>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;