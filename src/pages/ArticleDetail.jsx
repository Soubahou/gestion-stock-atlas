import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Table,
  Spinner as BootstrapSpinner,
} from "react-bootstrap";
import {
  FiArrowLeft,
  FiEdit,
  FiTrendingUp,
  FiPackage,
  FiDollarSign,
  FiAlertCircle,
  FiEye
} from "react-icons/fi";
import { fetchArticleById } from "../features/articles/articlesSlice";
import { fetchBons } from "../features/bons/bonsSlice";

const ArticleDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const article = useSelector((state) =>
    state.articles.items.find((item) => item.id === parseInt(id))
  );
  const loading = useSelector((state) => state.articles.loading);

  const bons = useSelector((state) => state.bons.items);
  const bonsLoading = useSelector((state) => state.bons.loading);

  useEffect(() => {
    if (!article) {
      dispatch(fetchArticleById(id));
    }
    dispatch(fetchBons());
  }, [dispatch, id, article]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <BootstrapSpinner animation="border" />
        <p className="mt-2">Chargement de l'article...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <Container className="py-4">
        <Card className="shadow-sm border-0">
          <Card.Body className="text-center py-5">
            <FiAlertCircle size={64} className="text-warning mb-3" />
            <h3 className="mb-3">Article non trouvé</h3>
            <p className="text-muted mb-4">
              L'article que vous recherchez n'existe pas ou a été supprimé.
            </p>
            <Link to="/articles">
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

  const getStockStatus = (quantite, seuilMin) => {
    const percentage = (quantite / seuilMin) * 100;
    if (percentage <= 50) return { variant: "danger", text: "Stock Critique" };
    if (percentage <= 100) return { variant: "warning", text: "Attention" };
    return { variant: "success", text: "Stock Confortable" };
  };

  const status = getStockStatus(article.quantite, article.seuilMin);

  const articleMovements = bons
    .filter((bon) => bon.articles?.some((a) => a.articleId === parseInt(id)))
    .map((bon) => {
      const line = bon.articles.find((a) => a.articleId === parseInt(id));

      return {
        id: bon.id,
        date: bon.date,
        type: bon.type,
        quantity: line.quantity,
        motif: bon.motif || "",
        utilisateur: bon.utilisateur || "",
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <Container fluid="lg" className="px-3 px-md-4 py-4">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 gap-3">
        <div className="d-flex align-items-center">
          <Link to="/articles" className="text-decoration-none me-3">
            <Button
              variant="outline-secondary"
              size="sm"
              className="d-flex align-items-center"
            >
              <FiArrowLeft />
              <span className="d-none d-sm-inline ms-2">Retour</span>
            </Button>
          </Link>
          <div>
            <h1 className="h4 mb-0">{article.nom}</h1>
            <small className="text-muted">{article.reference}</small>
          </div>
        </div>

        <Link to={`/articles/edit/${article.id}`} className="w-100 w-sm-auto">
          <Button
            variant="warning"
            className="d-flex align-items-center w-100 justify-content-center"
          >
            <FiEdit className="me-2" />
            Modifier l'article
          </Button>
        </Link>
      </div>

      <Card
        className={`bg-${status.variant}-subtle border-${status.variant} mb-4`}
      >
        <Card.Body className="py-3">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <FiPackage size={24} className={`text-${status.variant} me-3`} />
              <div>
                <h5 className="mb-0">Statut du stock</h5>
                <p className="mb-0 text-muted">
                  Niveau actuel: {article.quantite} {article.unite}
                </p>
              </div>
            </div>
            <Badge bg={status.variant} className="fs-6 px-3 py-2">
              {status.text}
            </Badge>
          </div>
        </Card.Body>
      </Card>

      <Row className="g-4">
        <Col xs={12}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Informations Générales</h5>
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                <Col xs={12} sm={6} md={4}>
                  <div className="mb-3">
                    <small className="text-muted d-block">Référence</small>
                    <strong className="fs-5">{article.reference}</strong>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={4}>
                  <div className="mb-3">
                    <small className="text-muted d-block">Catégorie</small>
                    <Badge bg="light" text="dark" className="fs-6">
                      {article.categorie}
                    </Badge>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={4}>
                  <div className="mb-3">
                    <small className="text-muted d-block">Fournisseur</small>
                    <strong>{article.fournisseur}</strong>
                  </div>
                </Col>

                <Col xs={12} sm={6} md={4}>
                  <div className="mb-3">
                    <small className="text-muted d-block">Emplacement</small>
                    <strong>{article.emplacement}</strong>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={4}>
                  <div className="mb-3">
                    <small className="text-muted d-block">
                      Unité de mesure
                    </small>
                    <strong>{article.unite}</strong>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={4}>
                  <div className="mb-3">
                    <small className="text-muted d-block">Prix unitaire</small>
                    <strong className="fs-5">{article.prixUnitaire} DH</strong>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-success bg-opacity-10 border-success">
              <div className="d-flex align-items-center">
                <FiPackage className="text-success me-2" />
                <h5 className="mb-0">Stock Actuel</h5>
              </div>
            </Card.Header>
            <Card.Body className="text-center">
              <div className="display-4 fw-bold text-success mb-3">
                {article.quantite}
              </div>
              <p className="fs-5 text-muted">{article.unite}</p>

              <div className="mt-4">
                <div className="d-flex justify-content-between mb-2">
                  <small className="text-muted">Niveau actuel</small>
                  <small>
                    <strong>{article.quantite}</strong>
                  </small>
                </div>
                <div className="progress" style={{ height: "10px" }}>
                  <div
                    className={`progress-bar bg-${status.variant}`}
                    style={{
                      width: `${Math.min(
                        (article.quantite / article.seuilMin) * 100,
                        200
                      )}%`,
                    }}
                  ></div>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <small className="text-muted">Seuil minimum</small>
                  <small>
                    <strong>
                      {article.seuilMin} {article.unite}
                    </strong>
                  </small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-warning bg-opacity-10 border-warning">
              <div className="d-flex align-items-center">
                <FiDollarSign className="text-warning me-2" />
                <h5 className="mb-0">Valeur du Stock</h5>
              </div>
            </Card.Header>
            <Card.Body className="text-center">
              <div className="display-4 fw-bold text-warning mb-3">
                {(article.quantite * article.prixUnitaire).toFixed(2)} DH
              </div>
              <p className="text-muted mb-4">Valeur totale en stock</p>
              <div className="d-flex justify-content-center gap-2">
                <small className="text-muted">{article.quantite} ×</small>
                <small className="text-muted">
                  {article.prixUnitaire} DH/unité
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-info bg-opacity-10 border-info">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <FiTrendingUp className="text-info me-2" />
                  <h5 className="mb-0">Historique des Mouvements</h5>
                </div>
                <Badge bg="info" pill>
                  {articleMovements.length} mouvements
                </Badge>
              </div>
            </Card.Header>

            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="text-nowrap">Date</th>
                      <th className="text-nowrap">Type</th>
                      <th className="text-nowrap">Quantité</th>
                      <th className="d-none d-md-table-cell">Motif</th>
                      <th className="d-none d-sm-table-cell">Utilisateur</th>
                      <th className="d-none d-sm-table-cell">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {bonsLoading ? (
                      <tr>
                        <td colSpan="5" className="text-center py-4">
                          <BootstrapSpinner size="sm" />
                        </td>
                      </tr>
                    ) : articleMovements.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-4 text-muted">
                          Aucun mouvement pour cet article
                        </td>
                      </tr>
                    ) : (
                      articleMovements.map((mvt) => (
                        <tr key={`${mvt.id}-${mvt.date}`}>
                          <td>
                            <div className="fw-medium">
                              {new Date(mvt.date).toLocaleDateString()}
                            </div>
                            <small className="text-muted d-block d-md-none">
                              {mvt.motif}
                            </small>
                          </td>
                          <td>
                            <Badge
                              bg={mvt.type === "ENTREE" ? "success" : "danger"}
                            >
                              {mvt.type === "ENTREE" ? "Entrée" : "Sortie"}
                            </Badge>
                          </td>
                          <td>
                            <span
                              className={`fw-bold ${
                                mvt.type === "ENTREE"
                                  ? "text-success"
                                  : "text-danger"
                              }`}
                            >
                              {mvt.type === "ENTREE" ? "+" : "-"}
                              {mvt.quantity}
                            </span>
                            <small className="text-muted ms-1">
                              {article.unite}
                            </small>
                          </td>
                          <td className="d-none d-md-table-cell">
                            {mvt.motif}
                          </td>
                          <td className="d-none d-sm-table-cell">
                            <div className="d-flex align-items-center">
                              <div
                                className="bg-secondary rounded-circle text-white d-flex align-items-center justify-content-center me-2"
                                style={{
                                  width: "24px",
                                  height: "24px",
                                  fontSize: "12px",
                                }}
                              >
                                {mvt.utilisateur.charAt(0).toUpperCase()}
                              </div>
                              {mvt.utilisateur}
                            </div>
                          </td>
                          <td>
                            <Link
                              to={`/bon/${mvt.id}`}
                              className="btn btn-outline-info btn-sm"
                              title="Voir"
                            >
                              <FiEye />
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="mt-4 text-center d-block d-md-none">
        <small className="text-muted">
          Pour plus de détails, utilisez votre appareil en mode paysage ou un
          écran plus large.
        </small>
      </div>
    </Container>
  );
};

export default ArticleDetail;