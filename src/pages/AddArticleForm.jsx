import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  Container, 
  Card, 
  Button, 
  Row, 
  Col, 
  Alert,
  Form as BootstrapForm
} from 'react-bootstrap';
import { createArticle } from '../features/articles/articlesSlice';
import { articleSchema } from '../utils/validationSchemas';
import { FiSave, FiArrowLeft } from 'react-icons/fi';

const AddArticleForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    reference: `ART-${String(Math.floor(Math.random() * 1000)).padStart(4, '0')}`,
    nom: '',
    categorie: 'Quincaillerie',
    quantite: 0,
    unite: 'pièce',
    seuilMin: 10,
    emplacement: '',
    fournisseur: '',
    prixUnitaire: 0,
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await dispatch(createArticle(values)).unwrap();
      resetForm();
      navigate('/articles');
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const categories = ['Quincaillerie', 'Métallerie', 'Électricité', 'Outillage', 'Peinture', 'Soudure'];
  const unites = ['pièce', 'kg', 'm', 'm²', 'L', 'boîte'];

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Ajouter un Nouvel Article</h2>
        <Button variant="outline-secondary" onClick={() => navigate('/articles')}>
          <FiArrowLeft className="me-2" />
          Annuler
        </Button>
      </div>

      <Card className="shadow-sm">
        <Card.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={articleSchema}
            onSubmit={handleSubmit}
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
                        readOnly
                      />
                      <ErrorMessage name="reference" component={Alert} variant="danger" />
                    </BootstrapForm.Group>

                    <BootstrapForm.Group className="mb-3">
                      <BootstrapForm.Label>Nom de l'article *</BootstrapForm.Label>
                      <Field 
                        name="nom" 
                        className="form-control"
                        placeholder="Ex: Vis M6 x 20mm"
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
                        placeholder="Ex: Fournisseur A"
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
                      <ErrorMessage name="prixUnitaire" component={Alert} variant="danger" />
                    </BootstrapForm.Group>
                  </Col>
                </Row>

                <BootstrapForm.Group className="mb-3">
                  <BootstrapForm.Label>Emplacement</BootstrapForm.Label>
                  <Field 
                    name="emplacement" 
                    className="form-control"
                    placeholder="Ex: Rayon A1, Zone B2"
                  />
                </BootstrapForm.Group>

                <div className="d-flex justify-content-between">
                  <Button 
                    type="button" 
                    variant="outline-secondary"
                    onClick={() => navigate('/articles')}
                  >
                    Annuler
                  </Button>
                  <Button 
                    type="submit" 
                    variant="primary"
                    disabled={isSubmitting}
                  >
                    <FiSave className="me-2" />
                    {isSubmitting ? 'Enregistrement...' : 'Enregistrer l\'article'}
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

export default AddArticleForm;