import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Card, Button, Badge, Form } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import { fetchArticles, selectArticlesStats, selectAllArticles } from '../features/articles/articlesSlice';
import { fetchBons, selectAllBons } from '../features/bons/bonsSlice';
import { FiAlertTriangle, FiPackage, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import StockChart from '../components/charts/StockChart';
import Spinner from '../components/common/Spinner';

const Dashboard = () => {
  const dispatch = useDispatch();
  const stats = useSelector(selectArticlesStats);
  const loadingArticles = useSelector((state) => state.articles.loading);
  const loadingBons = useSelector((state) => state.bons.loading);
  const articles = useSelector(selectAllArticles);
  const bons = useSelector(selectAllBons);

  const [reportDates, setReportDates] = useState({ start: '', end: '' });

  useEffect(() => {
    dispatch(fetchArticles());
    dispatch(fetchBons());
  }, [dispatch]);

  if (loadingArticles || loadingBons) return <Spinner message="Chargement du dashboard..." />;

  const getArticleName = (id) => {
    const a = articles.find(a => a.id === id);
    return a ? a.nom : `Article #${id}`;
  };

  const exportReport = () => {
    if (!reportDates.start || !reportDates.end) {
      alert("Veuillez sélectionner la date de début et la date de fin.");
      return;
    }

    const startDate = new Date(reportDates.start);
    const endDate = new Date(reportDates.end);

    const filteredBons = bons.filter(b => {
      const bDate = new Date(b.date);
      return bDate >= startDate && bDate <= endDate;
    });

    let rows = [];
    filteredBons.forEach(b => {
      b.articles.forEach(a => {
        const articleInfo = articles.find(ar => ar.id === a.articleId);
        rows.push({
          Ref: b.ref,
          Type: b.type,
          Date: b.date,
          Utilisateur: b.utilisateur,
          Motif: b.motif || '',
          'Article Nom': articleInfo ? articleInfo.nom : `Article #${a.articleId}`,
          Quantité: a.quantity,
          Unité: articleInfo ? articleInfo.unite : 'pièce',
          'Prix Unitaire': articleInfo ? articleInfo.prixUnitaire : 0,
          'Valeur Totale': articleInfo ? (a.quantity * articleInfo.prixUnitaire).toFixed(2) : 0
        });
      });
    });

    const totalEntree = filteredBons.filter(b => b.type === 'ENTREE').length;
    const totalSortie = filteredBons.filter(b => b.type === 'SORTIE').length;
    const totalArticles = filteredBons.reduce((sum, b) => sum + b.articles.reduce((s, a) => s + a.quantity, 0), 0);
    const totalValue = rows.reduce((sum, r) => sum + parseFloat(r['Valeur Totale']), 0);

    const summary = [
      { Statistique: 'Total Bons', Valeur: filteredBons.length },
      { Statistique: 'Total Entrées', Valeur: totalEntree },
      { Statistique: 'Total Sorties', Valeur: totalSortie },
      { Statistique: 'Total Articles', Valeur: totalArticles },
      { Statistique: 'Valeur Totale', Valeur: totalValue.toFixed(2) }
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), 'Détails Bons');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summary), 'Résumé');

    XLSX.writeFile(wb, `Rapport_${reportDates.start}_to_${reportDates.end}.xlsx`);
  };

  const exportBonsData = () => {
    let rows = [];
    bons.forEach(b => {
      b.articles.forEach(a => {
        rows.push({
          Ref: b.ref,
          Type: b.type,
          Date: b.date,
          Utilisateur: b.utilisateur,
          Motif: b.motif || '',
          'Article Nom': getArticleName(a.articleId),
          Quantité: a.quantity
        });
      });
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), 'Bons');
    XLSX.writeFile(wb, 'Donnees_Bons.xlsx');
  };

  const exportStockData = () => {
    const rows = articles.map(a => ({
      Nom: a.nom,
      Reference: a.reference,
      Catégorie: a.categorie,
      Quantité: a.quantite,
      Unité: a.unite,
      'Seuil Minimum': a.seuilMin,
      Emplacement: a.emplacement,
      Fournisseur: a.fournisseur,
      'Prix Unitaire': a.prixUnitaire,
      'Valeur Totale': (a.quantite * a.prixUnitaire).toFixed(2)
    }));

    const categories = [...new Set(articles.map(a => a.categorie))];
    const summary = categories.map(cat => {
      const catArticles = articles.filter(a => a.categorie === cat);
      const totalValue = catArticles.reduce((sum, a) => sum + a.quantite * a.prixUnitaire, 0);
      return { Catégorie: cat, 'Nombre d\'articles': catArticles.length, 'Valeur Totale': totalValue.toFixed(2) };
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), 'Articles');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summary), 'Résumé');

    XLSX.writeFile(wb, 'Donnees_Stock.xlsx');
  };

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
              
              <Form className="mb-3">
                <Form.Group className="mb-2">
                  <Form.Label>Date Début</Form.Label>
                  <Form.Control type="date" value={reportDates.start} onChange={(e) => setReportDates({...reportDates, start: e.target.value})}/>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Date Fin</Form.Label>
                  <Form.Control type="date" value={reportDates.end} onChange={(e) => setReportDates({...reportDates, end: e.target.value})}/>
                </Form.Group>
              </Form>

              <div className="d-grid gap-2">
                <Button variant="primary" size="lg" className="mb-2" onClick={exportReport}>
                  Générer Rapport
                </Button>
                <Button variant="success" size="lg" className="mb-2" onClick={exportBonsData}>
                  Exporter Données Bons
                </Button>
                <Button variant="warning" size="lg" onClick={exportStockData}>
                  Exporter Données Stocks
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