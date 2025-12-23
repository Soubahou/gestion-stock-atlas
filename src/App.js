import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Layout from './components/common/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ArticlesList from './pages/ArticlesList';
import ArticleDetail from './pages/ArticleDetail';
import AddArticleForm from './pages/AddArticleForm';
import EditArticleForm from './pages/EditArticleForm';
import BonList from './pages/BonList';
import AddBonForm from './pages/AddBonForm';
import BonDetail from './pages/BonDetail';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          <Route path="/" element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="articles" element={<ArticlesList />} />
            <Route path="articles/:id" element={<ArticleDetail />} />
            <Route path="articles/ajouter" element={<AddArticleForm />} />
            <Route path="articles/edit/:id" element={<EditArticleForm />} />
            <Route path="bons" element={<BonList />} />
            <Route path="bon/ajouter" element={<AddBonForm />} />
            <Route path="bon/:id" element={<BonDetail />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
