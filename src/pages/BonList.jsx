import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  Table, 
  Card, 
  Button, 
  Form, 
  Badge, 
  Row, 
  Col,
  Alert,
  Container
} from 'react-bootstrap';
import { FiEye, FiX } from 'react-icons/fi';
import Spinner from '../components/common/Spinner';
import { 
  fetchBons, 
  deleteBon, 
  setFilters, 
  selectFilteredBons, 
  selectBonsStats 
} from '../features/bons/bonsSlice';

const BonsList = () => {
  const dispatch = useDispatch();
  const bons = useSelector(selectFilteredBons);
  const stats = useSelector(selectBonsStats);
  const loading = useSelector((state) => state.bons.loading);

  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    dispatch(fetchBons());
  }, [dispatch]);

  const handleTypeChange = (e) => {
    setTypeFilter(e.target.value);
    dispatch(setFilters({ type: e.target.value }));
  };

  const resetFilter = () => {
    setTypeFilter('');
    dispatch(setFilters({ type: '' }));
  };

  if (loading) return <Spinner message="Chargement des bons..." />;

  return (
    <Container fluid="lg" className="px-md-4 px-3 py-3">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h1 className="h3 mb-1">Gestion des Bons</h1>
          <p className="text-muted mb-0">Consultez et gérez vos bons d'entrée et de sortie</p>
        </div>
        <Link to="/bon/ajouter" className="btn btn-primary btn-lg w-100 w-md-auto">
          <span className="d-none d-md-inline">+ Nouveau Bon</span>
          <span className="d-md-none">+ Ajouter</span>
        </Link>
      </div>

      <Row className="g-3 mb-4">
        <Col xs={6} md={3}>
          <Card className="shadow-sm h-100 border-0">
            <Card.Body className="p-3 text-center">
              <h6 className="text-muted mb-2">Total Bons</h6>
              <h3 className="text-primary mb-0">{stats.totalBons}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="shadow-sm h-100 border-0">
            <Card.Body className="p-3 text-center">
              <h6 className="text-muted mb-2">Entrées</h6>
              <h3 className="text-success mb-0">{stats.totalEntree}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="shadow-sm h-100 border-0">
            <Card.Body className="p-3 text-center">
              <h6 className="text-muted mb-2">Sorties</h6>
              <h3 className="text-danger mb-0">{stats.totalSortie}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="shadow-sm h-100 border-0">
            <Card.Body className="p-3 text-center">
              <h6 className="text-muted mb-2">Articles concernés</h6>
              <h3 className="text-warning mb-0">{stats.totalArticles}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mb-4 shadow-sm">
        <Card.Header className="bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Filtrer par type</h5>
          <Button variant="link" size="sm" onClick={resetFilter} className="text-decoration-none">
            Tout effacer
          </Button>
        </Card.Header>
        <Card.Body>
          <Form.Select value={typeFilter} onChange={handleTypeChange}>
            <option value="">Tous types</option>
            <option value="ENTREE">Entrée</option>
            <option value="SORTIE">Sortie</option>
          </Form.Select>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body className="p-0">
          <div className="table-responsive-md">
            <Table hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Référence</th>
                  <th>Type</th>
                  <th className="d-none d-sm-table-cell">Utilisateur</th>
                  <th className="d-none d-md-table-cell">Articles</th>
                  <th className="text-nowrap">Date</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bons.map((bon) => (
                  <tr key={bon.id}>
                    <td>{bon.ref}</td>
                    <td>
                      <Badge bg={bon.type === 'ENTREE' ? 'success' : 'danger'}>
                        {bon.type === 'ENTREE' ? 'Entrée' : 'Sortie'}
                      </Badge>
                    </td>
                    <td className="d-none d-sm-table-cell">{bon.utilisateur}</td>
                    <td className="d-none d-md-table-cell">{bon.articles.length}</td>
                    <td>{bon.date}</td>
                    <td>
                      <div className="d-flex justify-content-end gap-1">
                        <Link 
                          to={`/bon/${bon.id}`} 
                          className="btn btn-outline-info btn-sm"
                          title="Voir"
                        >
                          <FiEye />
                        </Link>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => {
                            if (window.confirm(`Supprimer le bon ${bon.ref} ?`)) {
                              dispatch(deleteBon(bon.id));
                            }
                          }}
                          title="Supprimer"
                        >
                          <FiX />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {bons.length === 0 && (
            <div className="text-center py-5">
              <Alert variant="light" className="border mx-3">
                <h5>Aucun bon trouvé</h5>
                <p className="text-muted mb-0">
                  {typeFilter ? "Essayez de modifier le filtre par type" : "Aucun bon n'est disponible pour le moment"}
                </p>
              </Alert>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BonsList;
