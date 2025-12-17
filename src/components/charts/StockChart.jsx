import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Card } from 'react-bootstrap';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { selectAllArticles } from '../../features/articles/articlesSlice';

const StockChart = () => {
  const articles = useSelector(selectAllArticles);

  const stockData = [
    { name: 'Lun', entrées: 4, sorties: 2 },
    { name: 'Mar', entrées: 3, sorties: 1 },
    { name: 'Mer', entrées: 5, sorties: 3 },
    { name: 'Jeu', entrées: 7, sorties: 4 },
    { name: 'Ven', entrées: 2, sorties: 1 },
    { name: 'Sam', entrées: 3, sorties: 2 },
    { name: 'Dim', entrées: 0, sorties: 0 },
  ];

  const categoryData = articles.reduce((acc, article) => {
    const existing = acc.find(item => item.name === article.categorie);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: article.categorie, value: 1 });
    }
    return acc;
  }, []);

  const stockStatusData = [
    { name: 'Confortable', value: articles.filter(a => a.quantite > a.seuilMin).length, color: '#28a745' },
    { name: 'Attention', value: articles.filter(a => a.quantite <= a.seuilMin && a.quantite > a.seuilMin * 0.5).length, color: '#ffc107' },
    { name: 'Critique', value: articles.filter(a => a.quantite <= a.seuilMin * 0.5).length, color: '#dc3545' },
  ];

  const COLORS = ['#28a745', '#ffc107', '#dc3545'];

  return (
    <div>
      <Row className="mb-4">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Évolution des Mouvements (7 jours)</Card.Title>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="entrées" stroke="#28a745" strokeWidth={2} />
                  <Line type="monotone" dataKey="sorties" stroke="#dc3545" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Statut du Stock</Card.Title>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stockStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stockStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Articles par Catégorie</Card.Title>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Top 5 Articles</Card.Title>
              <div className="mt-3">
                {articles.slice(0, 5).map((article, index) => (
                  <div key={article.id} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                    <div>
                      <strong>{article.nom}</strong>
                      <div className="text-muted small">{article.reference}</div>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold">{article.quantite} {article.unite}</div>
                      <div className="text-muted small">
                        {(article.quantite * article.prixUnitaire).toFixed(2)} DH
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StockChart;