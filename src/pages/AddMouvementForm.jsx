import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Container, 
  Card, 
  Button, 
  Row, 
  Col, 
  Alert,
  Form as BootstrapForm
} from 'react-bootstrap';
import { fetchMouvements, createMouvement } from '../features/mouvements/mouvementsSlice';
import { fetchArticles} from '../features/articles/articlesSlice';
import { FiSave, FiArrowLeft, FiPackage } from 'react-icons/fi';
import { formatCurrency } from '../utils/helpers';
import { mouvementSchema } from '../utils/validationSchemas';

const AddMouvementForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const articles = useSelector((state) => state.articles.items);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    dispatch(fetchArticles());
    
    const state = location.state;
    if (state?.articleId) {
      const article = articles.find(a => a.id === parseInt(state.articleId));
      if (article) {
        setSelectedArticle(article);
      }
    }
  }, [dispatch, location.state, articles]);

  const initialValues = {
    articleId: location.state?.articleId || '',
    type: location.state?.type || 'entrée',
    quantite: 1,
    date: new Date().toISOString().split('T')[0],
    motif: '',
    utilisateur: 'Admin',
  };

const handleSubmit = async (values, { setSubmitting, setErrors }) => {
  try {    
    if (values.type === 'sortie') {
      const article = articles.find(a => a.id === parseInt(values.articleId));
      if (article && parseInt(values.quantite) > article.quantite) {
        setErrors({ 
          quantite: `Stock insuffisant. Disponible: ${article.quantite} ${article.unite}` 
        });
        return;
      }
    }
    
    const mouvementData = {
      ...values,
      articleId: parseInt(values.articleId),
      quantite: parseInt(values.quantite)
    };
    
    await dispatch(createMouvement(mouvementData)).unwrap();
    
    dispatch(fetchArticles());
    dispatch(fetchMouvements());
    
    
    navigate('/mouvements');
    
  } catch (error) {
    console.error('Erreur:', error.message);
    
    setSubmitting(false);
  }
};

  const handleArticleChange = (articleId) => {
    const article = articles.find(a => a.id === parseInt(articleId));
    setSelectedArticle(article);
  };

  const motifOptions = [
    'Réception fournisseur',
    'Retour client',
    'Consommation production',
    'Transfert interne',
    'Inventaire',
    'Déchet/Perte',
    'Ajustement stock'
  ];

  const utilisateurs = ['Admin', 'Manager', 'Ouvrier', 'Technicien', 'Magasinier'];

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Nouveau Mouvement</h2>
        <Button variant="outline-secondary" onClick={() => navigate('/mouvements')}>
          <FiArrowLeft className="me-2" />
          Annuler
        </Button>
      </div>

      <Row>
        <Col md={8}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Formik
                initialValues={initialValues}
                validationSchema={() => mouvementSchema(selectedArticle)}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ isSubmitting, values, setFieldValue }) => (
                  <Form>
                    <Row>
                      <Col md={6}>
                        <BootstrapForm.Group className="mb-3">
                          <BootstrapForm.Label>Article *</BootstrapForm.Label>
                          <Field 
                            as="select" 
                            name="articleId" 
                            className="form-select"
                            onChange={(e) => {
                              setFieldValue('articleId', e.target.value);
                              handleArticleChange(e.target.value);
                            }}
                          >
                            <option value="">Sélectionner un article</option>
                            {articles.map(article => (
                              <option key={article.id} value={article.id}>
                                {article.reference} - {article.nom}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage name="articleId" component={Alert} variant="danger" />
                        </BootstrapForm.Group>

                        <BootstrapForm.Group className="mb-3">
                          <BootstrapForm.Label>Type de mouvement *</BootstrapForm.Label>
                          <div>
                            <div className="form-check form-check-inline">
                              <Field
                                type="radio"
                                name="type"
                                value="entrée"
                                className="form-check-input"
                                id="entree"
                              />
                              <label htmlFor="entree" className="form-check-label text-success fw-bold">
                                Entrée
                              </label>
                            </div>
                            <div className="form-check form-check-inline">
                              <Field
                                type="radio"
                                name="type"
                                value="sortie"
                                className="form-check-input"
                                id="sortie"
                              />
                              <label htmlFor="sortie" className="form-check-label text-danger fw-bold">
                                Sortie
                              </label>
                            </div>
                          </div>
                          <ErrorMessage name="type" component={Alert} variant="danger" />
                        </BootstrapForm.Group>

                        <BootstrapForm.Group className="mb-3">
                          <BootstrapForm.Label>Date *</BootstrapForm.Label>
                          <Field 
                            type="date" 
                            name="date" 
                            className="form-control"
                          />
                          <ErrorMessage name="date" component={Alert} variant="danger" />
                        </BootstrapForm.Group>
                      </Col>

                      <Col md={6}>
                        <BootstrapForm.Group className="mb-3">
                          <BootstrapForm.Label>Quantité *</BootstrapForm.Label>
                          <Field 
                            type="number" 
                            name="quantite" 
                            className="form-control"
                            min="1"
                          />
                          <ErrorMessage name="quantite" component={Alert} variant="danger" />
                          {values.type === 'sortie' && selectedArticle && (
                            <div className="form-text">
                              Stock disponible: <strong>{selectedArticle.quantite} {selectedArticle.unite}</strong>
                            </div>
                          )}
                        </BootstrapForm.Group>

                        <BootstrapForm.Group className="mb-3">
                          <BootstrapForm.Label>Motif *</BootstrapForm.Label>
                          <Field 
                            as="select" 
                            name="motif" 
                            className="form-select"
                          >
                            <option value="">Sélectionner un motif</option>
                            {motifOptions.map(motif => (
                              <option key={motif} value={motif}>{motif}</option>
                            ))}
                          </Field>
                          <ErrorMessage name="motif" component={Alert} variant="danger" />
                        </BootstrapForm.Group>

                        <BootstrapForm.Group className="mb-3">
                          <BootstrapForm.Label>Utilisateur *</BootstrapForm.Label>
                          <Field 
                            as="select"
                            name="utilisateur" 
                            className="form-select"
                          >
                            {utilisateurs.map(user => (
                              <option key={user} value={user}>{user}</option>
                            ))}
                          </Field>
                          <ErrorMessage name="utilisateur" component={Alert} variant="danger" />
                        </BootstrapForm.Group>
                      </Col>
                    </Row>

                    {values.type === 'sortie' && selectedArticle && values.quantite > selectedArticle.quantite && (
                      <Alert variant="danger">
                         <strong>Stock insuffisant!</strong> Vous essayez de sortir {values.quantite} {selectedArticle.unite} 
                        alors qu'il ne reste que {selectedArticle.quantite} {selectedArticle.unite}
                      </Alert>
                    )}

                    <div className="d-flex justify-content-between">
                      <Button 
                        type="button" 
                        variant="outline-secondary"
                        onClick={() => navigate('/mouvements')}
                      >
                        Annuler
                      </Button>
                      <Button 
                        type="submit" 
                        variant="primary"
                        disabled={isSubmitting || (values.type === 'sortie' && values.quantite > selectedArticle?.quantite)}
                      >
                        <FiSave className="me-2" />
                        {isSubmitting ? 'Enregistrement...' : 'Enregistrer le mouvement'}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          {selectedArticle && (
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-info text-white">
                <h5 className="mb-0">
                  <FiPackage className="me-2" />
                  Informations Article
                </h5>
              </Card.Header>
              <Card.Body>
                <h6>{selectedArticle.nom}</h6>
                <p className="mb-1"><strong>Référence:</strong> {selectedArticle.reference}</p>
                <p className="mb-1"><strong>Catégorie:</strong> {selectedArticle.categorie}</p>
                <p className="mb-1"><strong>Stock actuel:</strong> {selectedArticle.quantite} {selectedArticle.unite}</p>
                <p className="mb-1"><strong>Seuil min:</strong> {selectedArticle.seuilMin} {selectedArticle.unite}</p>
                <p className="mb-1"><strong>Prix unitaire:</strong> {formatCurrency(selectedArticle.prixUnitaire)}</p>
                <p className="mb-1"><strong>Emplacement:</strong> {selectedArticle.emplacement}</p>
                
                <div className="progress mt-2" style={{ height: '10px' }}>
                  <div 
                    className={`progress-bar ${selectedArticle.quantite <= selectedArticle.seuilMin ? 'bg-danger' : 'bg-success'}`}
                    style={{ 
                      width: `${Math.min((selectedArticle.quantite / selectedArticle.seuilMin) * 100, 200)}%` 
                    }}
                  ></div>
                </div>
              </Card.Body>
            </Card>
          )}

          <Card className="shadow-sm">
            <Card.Header>
              <h5 className="mb-0">Actions Rapides</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button 
                  variant="outline-primary"
                  onClick={() => navigate('/articles')}
                >
                  Voir tous les articles
                </Button>
                <Button 
                  variant="outline-success"
                  onClick={() => navigate('/articles/ajouter')}
                >
                  Ajouter un nouvel article
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddMouvementForm;