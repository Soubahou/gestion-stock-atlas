import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  Table, 
  Card, 
  Button, 
  Form, 
  InputGroup, 
  Badge, 
  Row, 
  Col,
  Alert,
  Container
} from 'react-bootstrap';
import { 
  fetchArticles, 
  deleteArticle, 
  setFilters,
  selectFilteredArticles,
  selectArticlesStats 
} from '../features/articles/articlesSlice';
import { FiSearch, FiEdit, FiTrash2, FiEye, FiFilter, FiX } from 'react-icons/fi';
import Spinner from '../components/common/Spinner';

const ArticlesList = () => {
  const dispatch = useDispatch();
  const articles = useSelector(selectFilteredArticles);
  const stats = useSelector(selectArticlesStats);
  const loading = useSelector((state) => state.articles.loading);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockAlertOnly, setStockAlertOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  const getStockStatus = (quantite, seuilMin) => {
    if (quantite <= seuilMin * 0.5) return { variant: 'danger', text: 'Critique' };
    if (quantite <= seuilMin) return { variant: 'warning', text: 'Attention' };
    return { variant: 'success', text: 'Confortable' };
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    dispatch(setFilters({ search: e.target.value }));
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
    dispatch(setFilters({ category: e.target.value }));
  };

  const handleStockAlertChange = (e) => {
    setStockAlertOnly(e.target.checked);
    dispatch(setFilters({ stockAlert: e.target.checked }));
  };

  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setStockAlertOnly(false);
    dispatch(setFilters({ search: '', category: '', stockAlert: false }));
  };

  if (loading) return <Spinner message="Chargement des articles..." />;

  const categories = ['Quincaillerie', 'Métallerie', 'Électricité', 'Outillage', 'Peinture', 'Soudure'];

  return (
    <Container fluid="lg" className="px-md-4 px-3 py-3">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h1 className="h3 mb-1">Gestion des Articles</h1>
          <p className="text-muted mb-0">Gérez votre inventaire en temps réel</p>
        </div>
        <Link to="/articles/ajouter" className="btn btn-primary btn-lg w-100 w-md-auto">
          <span className="d-none d-md-inline">+ Nouvel Article</span>
          <span className="d-md-none">+ Ajouter</span>
        </Link>
      </div>

      <Row className="g-3 mb-4">
        <Col xs={6} md={3}>
          <Card className="shadow-sm h-100 border-0">
            <Card.Body className="p-3 text-center">
              <h6 className="text-muted mb-2">Total Articles</h6>
              <h3 className="text-primary mb-0">{stats.totalItems}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="shadow-sm h-100 border-0">
            <Card.Body className="p-3 text-center">
              <h6 className="text-muted mb-2">Valeur Totale</h6>
              <h3 className="text-success mb-0">{stats.totalValue} DH</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="shadow-sm h-100 border-0">
            <Card.Body className="p-3 text-center">
              <h6 className="text-muted mb-2">En Alerte</h6>
              <h3 className="text-warning mb-0">{stats.alertCount}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="shadow-sm h-100 border-0">
            <Card.Body className="p-3 text-center">
              <h6 className="text-muted mb-2">Critique</h6>
              <h3 className="text-danger mb-0">{stats.lowStockCount}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="d-md-none mb-3">
        <Button 
          variant="outline-secondary" 
          onClick={() => setShowFilters(!showFilters)}
          className="w-100 d-flex align-items-center justify-content-center gap-2"
        >
          {showFilters ? <FiX /> : <FiFilter />}
          {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
        </Button>
      </div>

      {(showFilters || window.innerWidth >= 768) && (
        <Card className="mb-4 shadow-sm">
          <Card.Header className="bg-light">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Filtres</h5>
              <Button 
                variant="link" 
                size="sm" 
                onClick={resetFilters}
                className="text-decoration-none"
              >
                Tout effacer
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            <Row className="g-3">
              <Col md={6} lg={4}>
                <InputGroup>
                  <InputGroup.Text className="bg-white">
                    <FiSearch />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Nom, référence..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="border-start-0"
                  />
                </InputGroup>
              </Col>
              
              <Col md={6} lg={3}>
                <Form.Select 
                  value={categoryFilter}
                  onChange={handleCategoryChange}
                >
                  <option value="">Toutes catégories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Form.Select>
              </Col>
              
              <Col md={6} lg={3}>
                <div className="d-flex align-items-center h-100">
                  <Form.Check
                    type="switch"
                    id="stock-alert"
                    label="Alertes seulement"
                    checked={stockAlertOnly}
                    onChange={handleStockAlertChange}
                    className="ms-1"
                  />
                </div>
              </Col>
              
              <Col md={6} lg={2}>
                <Button 
                  variant="outline-secondary" 
                  onClick={resetFilters}
                  className="w-100"
                >
                  Réinitialiser
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      <Card className="shadow-sm">
        <Card.Body className="p-0">
          <div className="table-responsive-md">
            <Table hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th className="d-none d-md-table-cell">Référence</th>
                  <th>Nom</th>
                  <th className="d-none d-sm-table-cell">Catégorie</th>
                  <th className="text-nowrap">Quantité</th>
                  <th className="d-none d-lg-table-cell">Seuil Min</th>
                  <th>Statut</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => {
                  const status = getStockStatus(article.quantite, article.seuilMin);
                  return (
                    <tr key={article.id}>
                      <td className="d-none d-md-table-cell">
                        <Badge bg="light" text="dark" className="fw-normal">
                          {article.reference}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex flex-column">
                          <span className="fw-medium">{article.nom}</span>
                          <small className="text-muted d-md-none">{article.reference}</small>
                        </div>
                      </td>
                      <td className="d-none d-sm-table-cell">
                        <span className="badge bg-light text-dark">
                          {article.categorie}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-1">
                          <strong>{article.quantite}</strong>
                          <small className="text-muted">{article.unite}</small>
                        </div>
                        <small className="d-lg-none text-muted">
                          Seuil: {article.seuilMin}
                        </small>
                      </td>
                      <td className="d-none d-lg-table-cell">{article.seuilMin}</td>
                      <td>
                        <Badge bg={status.variant} className="text-nowrap">
                          {status.text}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex justify-content-end gap-1">
                          <Link 
                            to={`/articles/${article.id}`} 
                            className="btn btn-outline-info btn-sm"
                            title="Voir"
                          >
                            <FiEye />
                          </Link>
                          <Link 
                            to={`/articles/edit/${article.id}`} 
                            className="btn btn-outline-warning btn-sm"
                            title="Modifier"
                          >
                            <FiEdit />
                          </Link>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => {
                              if (window.confirm(`Supprimer l'article ${article.nom} ?`)) {
                                dispatch(deleteArticle(article.id));
                              }
                            }}
                            title="Supprimer"
                          >
                            <FiTrash2 />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>

          {articles.length === 0 && (
            <div className="text-center py-5">
              <Alert variant="light" className="border mx-3">
                <FiSearch size={48} className="text-muted mb-3" />
                <h5>Aucun article trouvé</h5>
                <p className="text-muted mb-0">
                  {searchTerm || categoryFilter || stockAlertOnly 
                    ? "Essayez de modifier vos filtres de recherche" 
                    : "Aucun article n'est disponible pour le moment"}
                </p>
                {(searchTerm || categoryFilter || stockAlertOnly) && (
                  <Button 
                    variant="outline-primary" 
                    onClick={resetFilters}
                    className="mt-3"
                  >
                    Réinitialiser les filtres
                  </Button>
                )}
              </Alert>
            </div>
          )}

          {articles.length > 0 && (
            <div className="px-3 py-3 border-top">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                <div className="mb-2 mb-md-0">
                  <span className="text-muted">
                    Affichage de <strong>{articles.length}</strong> article{articles.length > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="d-flex gap-2">
                  <small className="text-muted d-none d-md-block">
                    <Badge bg="success" className="me-1">Confortable</Badge>
                    <Badge bg="warning" className="me-1">Attention</Badge>
                    <Badge bg="danger">Critique</Badge>
                  </small>
                </div>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ArticlesList;