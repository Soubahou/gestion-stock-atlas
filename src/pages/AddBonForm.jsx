import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Container, 
  Card, 
  Button, 
  Row, 
  Col, 
  Alert,
  Form as BootstrapForm,
  Table,
  Modal
} from 'react-bootstrap';
import { fetchArticles } from '../features/articles/articlesSlice';
import { createBon, clearBonError } from '../features/bons/bonsSlice';
import { FiSave, FiArrowLeft, FiPackage } from 'react-icons/fi';

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

export default function AddBonForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const articles = useSelector((state) => state.articles.items);
  const { loading, error } = useSelector((state) => state.bons);

  const [type, setType] = useState('ENTREE');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedArticles, setSelectedArticles] = useState([]);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalArticleId, setModalArticleId] = useState('');
  const [modalQuantity, setModalQuantity] = useState(1);

  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearBonError());
    }
  }, [error, dispatch]);

  const handleAddArticle = () => {
    if (!modalArticleId || modalQuantity <= 0) {
      alert('Veuillez sélectionner un article et une quantité valide.');
      return;
    }

    const article = articles.find(a => a.id === parseInt(modalArticleId));

    if (type === 'SORTIE' && modalQuantity > article.quantite) {
      alert(`Stock insuffisant. Disponible: ${article.quantite}`);
      return;
    }

    setSelectedArticles([
      ...selectedArticles,
      { articleId: article.id, quantity: modalQuantity }
    ]);

    setModalArticleId('');
    setModalQuantity(1);
    setShowModal(false);
  };

  const handleRemoveArticle = (index) => {
    const newList = [...selectedArticles];
    newList.splice(index, 1);
    setSelectedArticles(newList);
  };

  const handleSubmit = async (values) => {
    if (!selectedArticles.length) {
      alert('Ajoutez au moins un article.');
      return;
    }

    const ref = `${values.type}-${Date.now()}`;
    await dispatch(createBon({
      type: values.type,
      date: values.date,
      motif: values.motif,
      utilisateur: values.utilisateur,
      articles: selectedArticles,
      ref
    })).unwrap();

    // Reset form
    setType('ENTREE');
    setSelectedArticles([]);
    setDate(new Date().toISOString().split('T')[0]);
    alert('Bon ajouté avec succès !');
    navigate('/bons');
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Nouveau Bon</h2>
        <Button variant="outline-secondary" onClick={() => navigate('/bons')}>
          <FiArrowLeft className="me-2" />
          Annuler
        </Button>
      </div>

      <Row>
        <Col md={8}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Formik
                initialValues={{
                  type,
                  date,
                  motif: '',
                  utilisateur: 'Admin'
                }}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ values, setFieldValue }) => (
                  <Form>
                    <Row>
                      <Col md={6}>
                        {/* Type */}
                        <BootstrapForm.Group className="mb-3">
                          <BootstrapForm.Label>Type *</BootstrapForm.Label>
                          <div>
                            <div className="form-check form-check-inline">
                              <Field
                                type="radio"
                                name="type"
                                value="ENTREE"
                                className="form-check-input"
                                checked={type === 'ENTREE'}
                                onChange={() => { setType('ENTREE'); setFieldValue('type', 'ENTREE'); }}
                              />
                              <label className="form-check-label text-success fw-bold">Entrée</label>
                            </div>
                            <div className="form-check form-check-inline">
                              <Field
                                type="radio"
                                name="type"
                                value="SORTIE"
                                className="form-check-input"
                                checked={type === 'SORTIE'}
                                onChange={() => { setType('SORTIE'); setFieldValue('type', 'SORTIE'); }}
                              />
                              <label className="form-check-label text-danger fw-bold">Sortie</label>
                            </div>
                          </div>
                        </BootstrapForm.Group>

                        {/* Date */}
                        <BootstrapForm.Group className="mb-3">
                          <BootstrapForm.Label>Date *</BootstrapForm.Label>
                          <Field
                            type="date"
                            name="date"
                            className="form-control"
                            value={date}
                            onChange={(e) => { setDate(e.target.value); setFieldValue('date', e.target.value); }}
                          />
                        </BootstrapForm.Group>
                        {/* Motif */}
                        <BootstrapForm.Group className="mb-3">
                          <BootstrapForm.Label>Motif *</BootstrapForm.Label>
                          <Field as="select" name="motif" className="form-select">
                            <option value="">Sélectionner un motif</option>
                            {motifOptions.map(motif => (
                              <option key={motif} value={motif}>{motif}</option>
                            ))}
                          </Field>
                          <ErrorMessage name="motif" component={Alert} variant="danger" />
                        </BootstrapForm.Group>

                        {/* Utilisateur */}
                        <BootstrapForm.Group className="mb-3">
                          <BootstrapForm.Label>Utilisateur *</BootstrapForm.Label>
                          <Field as="select" name="utilisateur" className="form-select">
                            {utilisateurs.map(user => (
                              <option key={user} value={user}>{user}</option>
                            ))}
                          </Field>
                          <ErrorMessage name="utilisateur" component={Alert} variant="danger" />
                        </BootstrapForm.Group>

                        <Button variant="primary" onClick={() => setShowModal(true)}>
                          Ajouter un article
                        </Button>
                      </Col>

                      <Col md={6}>
                        {selectedArticles.length > 0 && (
                          <Card>
                            <Card.Header>Articles ajoutés</Card.Header>
                            <Card.Body>
                              <Table striped bordered hover>
                                <thead>
                                  <tr>
                                    <th>Article</th>
                                    <th>Quantité</th>
                                    <th>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {selectedArticles.map((a, i) => {
                                    const art = articles.find(ar => ar.id === a.articleId);
                                    return (
                                      <tr key={i}>
                                        <td>{art?.nom}</td>
                                        <td>{a.quantity}</td>
                                        <td>
                                          <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={() => handleRemoveArticle(i)}
                                          >
                                            Supprimer
                                          </Button>
                                        </td>
                                      </tr>
                                    )
                                  })}
                                </tbody>
                              </Table>
                            </Card.Body>
                          </Card>
                        )}
                      </Col>
                    </Row>

                    <div className="d-flex justify-content-between mt-3">
                      <Button variant="outline-secondary" onClick={() => navigate('/bons')}>
                        Annuler
                      </Button>
                      <Button type="submit" variant="success" disabled={loading}>
                        <FiSave className="me-2" />
                        {loading ? 'Envoi...' : 'Ajouter Bon'}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0"><FiPackage className="me-2" /> Informations</h5>
            </Card.Header>
            <Card.Body>
              <p>Le bon sera enregistré avec tous les articles sélectionnés.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal for adding articles */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un article</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BootstrapForm.Group className="mb-3">
            <BootstrapForm.Label>Article</BootstrapForm.Label>
            <BootstrapForm.Select
              value={modalArticleId}
              onChange={(e) => setModalArticleId(e.target.value)}
            >
              <option value="">Sélectionner</option>
              {articles.map(a => (
                <option key={a.id} value={a.id}>
                  {a.nom} (Stock: {a.quantite})
                </option>
              ))}
            </BootstrapForm.Select>
          </BootstrapForm.Group>

          <BootstrapForm.Group className="mb-3">
            <BootstrapForm.Label>Quantité</BootstrapForm.Label>
            <BootstrapForm.Control
              type="number"
              min="1"
              value={modalQuantity}
              onChange={(e) => setModalQuantity(parseInt(e.target.value))}
            />
          </BootstrapForm.Group>

          <Button variant="primary" onClick={handleAddArticle}>
            Ajouter
          </Button>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
