import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Badge, 
  Button, 
  Table
} from 'react-bootstrap';
import { FiArrowLeft, FiPackage, FiCalendar, FiUsers, FiAlertCircle, FiPrinter } from 'react-icons/fi';
import { fetchBons } from '../features/bons/bonsSlice';
import { fetchArticles } from '../features/articles/articlesSlice';
import Spinner from '../components/common/Spinner';

const BonDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const bon = useSelector((state) => 
    state.bons.items.find((b) => b.id === parseInt(id))
  );
  const articles = useSelector((state) => state.articles.items);
  const loading = useSelector((state) => state.bons.loading);

  useEffect(() => {
    if (!bon) dispatch(fetchBons());
    if (articles.length === 0) dispatch(fetchArticles());
  }, [dispatch, bon, articles.length]);

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Bon ${bon.ref}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
          </style>
        </head>
        <body>
          <h2>Bon: ${bon.ref}</h2>
          <p><strong>Type:</strong> ${bon.type}</p>
          <p><strong>Date:</strong> ${bon.date}</p>
          <p><strong>Utilisateur:</strong> ${bon.utilisateur}</p>
          ${bon.motif ? `<p><strong>Motif:</strong> ${bon.motif}</p>` : ''}
          <p><strong>Nombre d'articles:</strong> ${bon.articles.length}</p>
          <h3>Articles</h3>
          <table>
            <thead>
              <tr>
                <th>Article</th>
                <th>Quantité</th>
                <th>Unité</th>
              </tr>
            </thead>
            <tbody>
              ${bon.articles.map(item => {
                const article = articles.find(a => a.id === item.articleId);
                const name = article ? article.nom : `Article #${item.articleId}`;
                const unite = article?.unite || 'pièce';
                const qty = bon.type === 'ENTREE' ? `+${item.quantity}` : `-${item.quantity}`;
                return `<tr>
                  <td>${name}</td>
                  <td>${qty}</td>
                  <td>${unite}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
return <Spinner message="Chargement du bon..." />;  }

  if (!bon) {
    return (
      <Container className="py-4">
        <Card className="shadow-sm border-0">
          <Card.Body className="text-center py-5">
            <FiAlertCircle size={64} className="text-warning mb-3" />
            <h3 className="mb-3">Bon non trouvé</h3>
            <p className="text-muted mb-4">Le bon que vous recherchez n'existe pas ou a été supprimé.</p>
            <Link to="/bons">
              <Button variant="primary">
                <FiArrowLeft className="me-2" />
                Retour à la liste
              </Button>
            </Link>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  const typeBadge = bon.type === 'ENTREE' 
    ? { variant: 'success', text: 'Entrée' } 
    : { variant: 'danger', text: 'Sortie' };

  const getArticleName = (articleId) => {
    const article = articles.find(a => a.id === articleId);
    return article ? article.nom : `Article #${articleId}`;
  };

  return (
    <Container fluid="lg" className="px-3 px-md-4 py-4">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 gap-3">
        <div className="d-flex align-items-center">
          <Link to="/bons" className="text-decoration-none me-3">
            <Button variant="outline-secondary" size="sm" className="d-flex align-items-center">
              <FiArrowLeft />
              <span className="d-none d-sm-inline ms-2">Retour</span>
            </Button>
          </Link>
          <div>
            <h1 className="h4 mb-0">{bon.ref}</h1>
            <small className="text-muted">{bon.type}</small>
          </div>
        </div>
      </div>

      <Card className={`bg-${typeBadge.variant}-subtle border-${typeBadge.variant} mb-4`}>
        <Card.Body className="py-3 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <FiPackage size={24} className={`text-${typeBadge.variant} me-3`} />
            <div>
              <h5 className="mb-0">Type du bon</h5>
              <p className="mb-0 text-muted">{typeBadge.text}</p>
            </div>
          </div>
          <Badge bg={typeBadge.variant} className="fs-6 px-3 py-2">{typeBadge.text}</Badge>
        </Card.Body>
      </Card>

      <Row className="g-4">
        <Col xs={12} sm={12}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Informations du Bon</h5>
              <Button variant="outline-primary" size="sm" onClick={handlePrint} className="d-flex align-items-center">
                <FiPrinter className="me-2" />
                Imprimer le Bon
              </Button>
            </Card.Header>
            <Card.Body>
              <div className="mb-2 d-flex align-items-center">
                <FiCalendar className="me-2" />
                <span><strong>Date:</strong> {bon.date}</span>
              </div>
              <div className="mb-2 d-flex align-items-center">
                <FiUsers className="me-2" />
                <span><strong>Utilisateur:</strong> {bon.utilisateur}</span>
              </div>
              {bon.motif && (
                <div className="mb-2">
                  <span><strong>Motif:</strong> {bon.motif}</span>
                </div>
              )}
              <div className="mb-2">
                <span><strong>Nombre d'articles:</strong> {bon.articles.length}</span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-info bg-opacity-10 border-info">
              <div className="d-flex align-items-center justify-content-between">
                <h5 className="mb-0">Articles du Bon</h5>
                <Badge bg="info" pill>{bon.articles.length}</Badge>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="text-nowrap">Article</th>
                      <th className="text-nowrap">Quantité</th>
                      <th className="d-none d-md-table-cell">Unité</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bon.articles.map((item, idx) => (
                      <tr key={idx}>
                        <td>{getArticleName(item.articleId)}</td>
                        <td>
                          {bon.type === 'ENTREE' ? (
                            <span className="text-success fw-bold">+{item.quantity}</span>
                          ) : (
                            <span className="text-danger fw-bold">-{item.quantity}</span>
                          )}
                        </td>
                        <td className="d-none d-md-table-cell">{articles.find(a => a.id === item.articleId)?.unite || 'pièce'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BonDetail;