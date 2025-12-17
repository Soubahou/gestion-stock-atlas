import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { 
  fetchArticles, 
  selectArticlesStats 
} from '../features/articles/articlesSlice';
import { FiAlertTriangle, FiPackage, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import StockChart from '../components/charts/StockChart';
import Spinner from '../components/common/Spinner';

const Dashboard = () => {
  const dispatch = useDispatch();
  const stats = useSelector(selectArticlesStats);
  const loading = useSelector((state) => state.articles.loading);

  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  if (loading) return <Spinner message="Chargement du dashboard..." />;

  return (
    <div>
      <h2 className="mb-4">Tableau de Bord</h2>
      
      <Row className="mb-4">
        <Col md={3}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Valeur Stock</h6>
                  <h3 className="mb-0">{stats.totalValue} DH</h3>
                </div>
                <FiDollarSign size={40} className="text-success" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Articles Total</h6>
                  <h3 className="mb-0">{stats.totalItems}</h3>
                </div>
                <FiPackage size={40} className="text-primary" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Alertes Stock</h6>
                  <h3 className="mb-0 text-danger">{stats.alertCount}</h3>
                </div>
                <FiAlertTriangle size={40} className="text-danger" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Stock Critique</h6>
                  <h3 className="mb-0 text-warning">{stats.lowStockCount}</h3>
                </div>
                <FiTrendingUp size={40} className="text-warning" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md={8}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <Card.Title>Évolution des Mouvements</Card.Title>
              <StockChart />
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <Card.Title>Actions Rapides</Card.Title>
              <div className="d-grid gap-2">
                <Button variant="primary" size="lg" className="mb-2">
                  Générer Rapport Mensuel
                </Button>
                <Button variant="success" size="lg" className="mb-2">
                  Importer Stock
                </Button>
                <Button variant="warning" size="lg">
                  Exporter les Données
                </Button>
              </div>
              
              <div className="mt-4">
                <h6>Statut du Système</h6>
                <Badge bg="success" className="me-2">API Connectée</Badge>
                <Badge bg="info" className="me-2">Base de données active</Badge>
                <Badge bg="light" text="dark">3 utilisateurs en ligne</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;