import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { 
  Container, 
  Card, 
  Button, 
  Row, 
  Col, 
  Alert,
  Form as BootstrapForm,
  Spinner as BootstrapSpinner
} from 'react-bootstrap';
import { fetchArticleById, updateArticle } from '../features/articles/articlesSlice';
import { articleSchema } from '../utils/validationSchemas';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import { formatCurrency } from '../utils/helpers';

const EditArticleForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const article = useSelector((state) => 
    state.articles.items.find(item => item.id === parseInt(id))
  );
  const loading = useSelector((state) => state.articles.loading);

  useEffect(() => {
    if (!article) {
      dispatch(fetchArticleById(id));
    }
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
      <Container>
        <Alert variant="danger" className="mt-4">
          Article non trouvé
        </Alert>
        <Button variant="outline-primary" onClick={() => navigate('/articles')}>
          Retour à la liste
        </Button>
      </Container>
    );
  }

  const initialValues = {
    reference: article.reference,
    nom: article.nom,
    categorie: article.categorie,
    quantite: article.quantite,
    unite: article.unite,
    seuilMin: article.seuilMin,
    emplacement: article.emplacement,
    fournisseur: article.fournisseur,
    prixUnitaire: article.prixUnitaire,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(updateArticle({
        id: parseInt(id),
        data: { ...article, ...values }
      })).unwrap();
      navigate(`/articles/${id}`);
    } catch (error) {
      console.log('Erreur:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const categories = ['Quincaillerie', 'Métallerie', 'Électricité', 'Outillage', 'Peinture', 'Soudure'];
  const unites = ['pièce', 'kg', 'm', 'm²', 'L', 'boîte'];

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Button 
            variant="outline-secondary" 
            onClick={() => navigate(`/articles/${id}`)}
            className="mb-2"
          >
            <FiArrowLeft className="me-2" />
            Retour aux détails
          </Button>
          <h2>Modifier l'article</h2>
        </div>
      </div>

      <Card className="shadow-sm">
        <Card.Header className="bg-warning text-dark">
          <h4 className="mb-0">Modification de {article.nom}</h4>
        </Card.Header>
        <Card.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={articleSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, values }) => (
              <Form>
                <Row>
                  <Col md={6}>
                    <BootstrapForm.Group className="mb-3">
                      <BootstrapForm.Label>Référence *</BootstrapForm.Label>
                      <Field 
                        name="reference" 
                        className="form-control"
                      />
                      <ErrorMessage name="reference" component={Alert} variant="danger" />
                    </BootstrapForm.Group>

                    <BootstrapForm.Group className="mb-3">
                      <BootstrapForm.Label>Nom de l'article *</BootstrapForm.Label>
                      <Field 
                        name="nom" 
                        className="form-control"
                      />
                      <ErrorMessage name="nom" component={Alert} variant="danger" />
                    </BootstrapForm.Group>

                    <BootstrapForm.Group className="mb-3">
                      <BootstrapForm.Label>Catégorie *</BootstrapForm.Label>
                      <Field 
                        as="select" 
                        name="categorie" 
                        className="form-select"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </Field>
                    </BootstrapForm.Group>

                    <BootstrapForm.Group className="mb-3">
                      <BootstrapForm.Label>Fournisseur</BootstrapForm.Label>
                      <Field 
                        name="fournisseur" 
                        className="form-control"
                      />
                    </BootstrapForm.Group>
                  </Col>

                  <Col md={6}>
                    <BootstrapForm.Group className="mb-3">
                      <BootstrapForm.Label>Quantité en stock *</BootstrapForm.Label>
                      <Field 
                        type="number" 
                        name="quantite" 
                        className="form-control"
                        min="0"
                        step="1"
                      />
                      <ErrorMessage name="quantite" component={Alert} variant="danger" />
                    </BootstrapForm.Group>

                    <BootstrapForm.Group className="mb-3">
                      <BootstrapForm.Label>Unité *</BootstrapForm.Label>
                      <Field 
                        as="select" 
                        name="unite" 
                        className="form-select"
                      >
                        {unites.map(unit => (
                          <option key={unit} value={unit}>{unit}</option>
                        ))}
                      </Field>
                    </BootstrapForm.Group>

                    <BootstrapForm.Group className="mb-3">
                      <BootstrapForm.Label>Seuil minimum d'alerte *</BootstrapForm.Label>
                      <Field 
                        type="number" 
                        name="seuilMin" 
                        className="form-control"
                        min="0"
                        step="1"
                      />
                      <div className="form-text">
                        Alerte déclenchée quand stock ≤ {values.seuilMin}
                      </div>
                      <ErrorMessage name="seuilMin" component={Alert} variant="danger" />
                    </BootstrapForm.Group>

                    <BootstrapForm.Group className="mb-3">
                      <BootstrapForm.Label>Prix unitaire (DH) *</BootstrapForm.Label>
                      <Field 
                        type="number" 
                        name="prixUnitaire" 
                        className="form-control"
                        min="0"
                        step="0.01"
                      />
                      <div className="form-text">
                        Valeur actuelle: {formatCurrency(article.prixUnitaire)}
                      </div>
                      <ErrorMessage name="prixUnitaire" component={Alert} variant="danger" />
                    </BootstrapForm.Group>
                  </Col>
                </Row>

                <BootstrapForm.Group className="mb-3">
                  <BootstrapForm.Label>Emplacement</BootstrapForm.Label>
                  <Field 
                    name="emplacement" 
                    className="form-control"
                  />
                </BootstrapForm.Group>

                <Alert variant="info" className="mb-4">
                  <strong>Note:</strong> La modification de la quantité affectera directement le stock disponible.
                  Pour enregistrer des mouvements (entrées/sorties), utilisez l'interface des mouvements.
                </Alert>

                <div className="d-flex justify-content-between">
                  <Button 
                    type="button" 
                    variant="outline-secondary"
                    onClick={() => navigate(`/articles/${id}`)}
                  >
                    Annuler
                  </Button>
                  <Button 
                    type="submit" 
                    variant="warning"
                    disabled={isSubmitting}
                  >
                    <FiSave className="me-2" />
                    {isSubmitting ? 'Mise à jour...' : 'Mettre à jour'}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditArticleForm;