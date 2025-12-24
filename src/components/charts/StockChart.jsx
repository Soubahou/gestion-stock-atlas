import React, { useMemo } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
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
import { selectBonsByDay } from '../../features/bons/bonsSlice';

const StockChart = () => {
  const articles = useSelector(selectAllArticles);
  const bonsByDay = useSelector(selectBonsByDay);

  const stockData = useMemo(() => {
    return bonsByDay.map(day => ({
      name: day.date,
      entrees: day.entrees,
      sorties: day.sorties,
      totalBons: day.totalBons
    }));
  }, [bonsByDay]);

  const categories = ['Quincaillerie', 'Métallerie', 'Électricité', 'Outillage', 'Peinture', 'Soudure'];
  const categoryColors = {
    'Quincaillerie': '#1f77b4',
    'Métallerie': '#ff7f0e',
    'Électricité': '#2ca02c',
    'Outillage': '#d62728',
    'Peinture': '#9467bd',
    'Soudure': '#8c564b'
  };

  const categoryData = useMemo(() => {
    return categories.map(cat => ({
      name: cat,
      value: articles.filter(a => a.categorie === cat).length,
      fill: categoryColors[cat]
    }));
  }, [articles]);

  const stockStatusData = useMemo(() => {
    const confortable = articles.filter(a => a.quantite > a.seuilMin).length;
    const attention = articles.filter(a => a.quantite <= a.seuilMin && a.quantite > a.seuilMin * 0.5).length;
    const critique = articles.filter(a => a.quantite <= a.seuilMin * 0.5).length;
    
    return [
      { name: 'Confortable', value: confortable, color: '#28a745' },
      { name: 'Attention', value: attention, color: '#ffc107' },
      { name: 'Critique', value: critique, color: '#dc3545' },
    ];
  }, [articles]);

  const topArticles = useMemo(() => {
    return [...articles]
      .sort((a, b) => b.quantite - a.quantite)
      .slice(0, 5);
  }, [articles]);

  return (
    <div>
      <Row className="mb-4">
        <Col md={7}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Évolution des Mouvements (7 jours)</Card.Title>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [value, 'Quantité']}
                    labelFormatter={(label) => `Jour: ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="entrees" 
                    name="Entrées" 
                    stroke="#28a745" 
                    strokeWidth={2} 
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sorties" 
                    name="Sorties" 
                    stroke="#dc3545" 
                    strokeWidth={2} 
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col md={5}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Statut du Stock</Card.Title>
              <div className="text-center mb-3">
                <div className="d-flex justify-content-center gap-4">
                  <div>
                    <div className="fw-bold text-success">{stockStatusData[0].value}</div>
                    <small>Confortable</small>
                  </div>
                  <div>
                    <div className="fw-bold text-warning">{stockStatusData[1].value}</div>
                    <small>Attention</small>
                  </div>
                  <div>
                    <div className="fw-bold text-danger">{stockStatusData[2].value}</div>
                    <small>Critique</small>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={stockStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    innerRadius={40}
                    dataKey="value"
                  >
                    {stockStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} articles`, 'Quantité']}
                  />
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
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value} articles`, 'Quantité']}
                    labelFormatter={(label) => `Catégorie: ${label}`}
                  />
                  <Bar dataKey="value" name="Nombre d'articles" radius={[4, 4, 0, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Top 5 Articles en Stock</Card.Title>
              <div className="mt-3">
                {topArticles.map((article, index) => (
                  <div key={article.id} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                    <div className="d-flex align-items-center">
                      <div className="me-3">
                        <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" 
                             style={{ width: '36px', height: '36px' }}>
                          <span className="fw-bold text-primary">{index + 1}</span>
                        </div>
                      </div>
                      <div>
                        <strong className="d-block">{article.nom}</strong>
                        <small className="text-muted">{article.reference} • {article.categorie}</small>
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold">{article.quantite} {article.unite}</div>
                      <small className="text-muted">
                        {(article.quantite * article.prixUnitaire).toFixed(2)} DH
                      </small>
                      <div className={`small ${article.quantite <= article.seuilMin ? 'text-danger' : 'text-success'}`}>
                        Seuil: {article.seuilMin} {article.unite}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {articles.length === 0 && (
                <div className="text-center text-muted py-4">
                  Aucun article disponible
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StockChart;