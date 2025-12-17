import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Image } from 'react-bootstrap';
import { FiUsers, FiGlobe, FiCheckCircle } from 'react-icons/fi';

const LandingPage = () => {
  const teamMembers = [
    { name: 'Mohamed Mouad Moukrim', role: 'UI/UX Designer', photo: 'https://randomuser.me/api/portraits/men/65.jpg' },
    { name: 'Souhail Bahoujabour', role: 'Backend Developer', photo: 'https://randomuser.me/api/portraits/men/16.jpg' },
  ];

  return (
    <Container className="py-5">
      <Row className="align-items-center mb-5">
        <Col md={6}>
          <h1 className="display-4 fw-bold mb-3">
            Atlas Manufacturing - <span className="text-primary">Gestion de Stock</span>
          </h1>
          <p className="lead mb-4">
            Solution complète de gestion de stock pour entreprise industrielle. 
            Suivez vos articles en temps réel, gérez les mouvements et optimisez vos stocks.
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="me-3">Accéder à l'application</Button>
          </Link>
          <Button variant="outline-primary" size="lg">Voir la démo</Button>
        </Col>
        <Col md={6}>
          <Image 
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop" 
            fluid 
            rounded 
            className="shadow"
            alt="Gestion de stock"
          />
        </Col>
      </Row>

      <Row className="mb-5">
        <Col md={4}>
          <Card className="text-center border-0 shadow-sm h-100">
            <Card.Body>
              <div className="display-1 text-primary mb-3">
                <FiCheckCircle />
              </div>
              <Card.Title>Suivi en Temps Réel</Card.Title>
              <Card.Text>
                Visualisez l'état de votre stock instantanément avec des alertes automatiques.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center border-0 shadow-sm h-100">
            <Card.Body>
              <div className="display-1 text-success mb-3">
                <FiGlobe />
              </div>
              <Card.Title>Accessible Partout</Card.Title>
              <Card.Text>
                Application web responsive accessible depuis tous vos appareils.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center border-0 shadow-sm h-100">
            <Card.Body>
              <div className="display-1 text-warning mb-3">
                <FiUsers />
              </div>
              <Card.Title>Gestion Collaborative</Card.Title>
              <Card.Text>
                Plusieurs utilisateurs peuvent gérer le stock simultanément.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="text-center mb-5">
        <h2 className="mb-4">Notre Équipe</h2>
        <Row>
          {teamMembers.map((member, index) => (
            <Col md={6} key={index}>
              <Card className="border-0 shadow-sm">
                <Card.Img 
                  variant="top" 
                  src={member.photo} 
                  className="rounded-circle w-50 mx-auto mt-3"
                />
                <Card.Body>
                  <Card.Title>{member.name}</Card.Title>
                  <Card.Text className="text-muted">{member.role}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <div className="text-center p-5 bg-light rounded">
        <h2 className="mb-3">Prêt à optimiser votre stock ?</h2>
        <p className="lead mb-4">Rejoignez les entreprises qui utilisent déjà notre solution.</p>
        <Link to="/dashboard">
          <Button size="lg" className="px-5">Commencer maintenant</Button>
        </Link>
      </div>
    </Container>
  );
};

export default LandingPage;