import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  Table, 
  Card, 
  Row, 
  Col, 
  Form,  
  Button, 
  Badge,
  Alert
} from 'react-bootstrap';
import { 
  fetchMouvements, 
  deleteMouvement,
  setMouvementFilters,
  selectFilteredMouvements,
  selectMouvementsStats
} from '../features/mouvements/mouvementsSlice';
import { fetchArticles } from '../features/articles/articlesSlice';
import { FiFilter, FiEye, FiTrash2 } from 'react-icons/fi';
import Spinner from '../components/common/Spinner';

const MouvementsList = () => {
  const dispatch = useDispatch();
  const mouvements = useSelector(selectFilteredMouvements);
  const stats = useSelector(selectMouvementsStats);
  const articles = useSelector((state) => state.articles.items);
  const loading = useSelector((state) => state.mouvements.loading);
  const [localFilters, setLocalFilters] = useState({
    type: '',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    dispatch(fetchMouvements());
    dispatch(fetchArticles());
  }, [dispatch]);


  if (loading) return <Spinner message="Chargement des mouvements..." />;

  const handleFilterChange = (name, value) => {
    setLocalFilters({ ...localFilters, [name]: value });
    dispatch(setMouvementFilters({ [name]: value }));
  };

 const getArticleName = (articleId) => {
  
  const article = articles.find(a => {
    return a.id === articleId || 
           a.id === parseInt(articleId) || 
           a.id === Number(articleId);
  });
  
  return article ? article.nom : `N/A (ID: ${articleId})`;
};

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Historique des Mouvements</h2>
        <Link to="/mouvements/ajouter" className="btn btn-primary">
          + Nouveau Mouvement
        </Link>
      </div>

      <Row className="mb-4">
        <Col md={3}>
          <Card className="shadow-sm border-0">
            <Card.Body className="text-center">
              <h6 className="text-muted">Total Mouvements</h6>
              <h3 className="text-primary">{stats.totalMouvements}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0">
            <Card.Body className="text-center">
              <h6 className="text-muted">Aujourd'hui</h6>
              <h3 className="text-success">{stats.mouvementsToday}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0">
            <Card.Body className="text-center">
              <h6 className="text-muted">Entrées</h6>
              <h3 className="text-info">{stats.entréesToday}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0">
            <Card.Body className="text-center">
              <h6 className="text-muted">Sorties</h6>
              <h3 className="text-warning">{stats.sortiesToday}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mb-4 shadow-sm">
        <Card.Header className="bg-light">
          <h5 className="mb-0">
            <FiFilter className="me-2" />
            Filtres
          </h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Select 
                value={localFilters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option value="">Tous les types</option>
                <option value="entrée">Entrées</option>
                <option value="sortie">Sorties</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Control
                type="date"
                placeholder="Date début"
                value={localFilters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Form.Control
                type="date"
                placeholder="Date fin"
                value={localFilters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body>
          <Table striped hover responsive>
            <thead className="table-dark">
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Article</th>
                <th>Quantité</th>
                <th>Motif</th>
                <th>Utilisateur</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mouvements.map((mouvement) => (
                <tr key={mouvement.id}>
                  <td>{formatDate(mouvement.date)}</td>
                  <td>
                    <Badge bg={mouvement.type === 'entrée' ? 'success' : 'danger'}>
                      {mouvement.type === 'entrée' ? 'Entrée' : 'Sortie'}
                    </Badge>
                  </td>
                  <td>{getArticleName(mouvement.articleId)}</td>
                  <td className={mouvement.type === 'entrée' ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                    {mouvement.type === 'entrée' ? '+' : '-'}{mouvement.quantite}
                  </td>
                  <td>{mouvement.motif}</td>
                  <td>{mouvement.utilisateur}</td>
                  <td>
                    <Button 
                      variant="outline-info" 
                      size="sm"
                      as={Link}
                      to={`/articles/${mouvement.articleId}`}
                      className="me-1"
                    >
                      <FiEye />
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => {
                        if (window.confirm('Supprimer ce mouvement?')) {
                          dispatch(deleteMouvement(mouvement.id));
                        }
                      }}
                    >
                      <FiTrash2 />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {mouvements.length === 0 && (
            <Alert variant="info" className="text-center">
              Aucun mouvement trouvé avec les filtres actuels
            </Alert>
          )}

          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              <span className="text-muted">
                Affichage de {mouvements.length} mouvements
              </span>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default MouvementsList;