import { articlesApi } from '../../api/mockApi';

export const articlesService = {
  fetchArticles: async () => {
    try {
      const response = await articlesApi.getAll();
      return response.data;
    } catch (error) {
      console.log('Erreur:', error);
    }
  },

  fetchArticleById: async (id) => {
    try {
      const response = await articlesApi.getById(id);
      if (!response || !response.data) {
        throw new Error(`Article ${id} non trouvé`);
      }
      return response.data;
    } catch (error) {
      console.log(`Erreur:`, error.message);
    }
  },

  createArticle: async (articleData) => {
    try {
      const dataWithId = {
        ...articleData,
        id: articleData.id || Date.now(),
        createdAt: articleData.createdAt || new Date().toISOString().split('T')[0]
      };
      const response = await articlesApi.create(dataWithId);
      return response.data;
    } catch (error) {
      const simulatedArticle = {
        ...articleData,
        id: Date.now(),
        createdAt: new Date().toISOString().split('T')[0]
      };
      return simulatedArticle;
    }
  },

  updateArticle: async (id, articleData) => {
    try {
      const response = await articlesApi.update(id, articleData);
      return response.data;
    } catch (error) {
      const simulatedArticle = { ...articleData, id: parseInt(id) };
      return simulatedArticle;
    }
  },

  deleteArticle: async (id) => {
    try {
      console.log(`📡 [articlesService] Suppression de l'article ${id}...`);
      await articlesApi.delete(id);
      console.log(`✅ [articlesService] Article ${id} supprimé`);
      return id;
    } catch (error) {
      return id;
    }
  },

  searchArticles: async (filters = {}) => {
    try {
      const allArticles = await articlesService.fetchArticles();
      const filteredArticles = allArticles.filter(article => {
        let matches = true;
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          matches = matches && (
            article.nom.toLowerCase().includes(searchLower) ||
            article.reference.toLowerCase().includes(searchLower) ||
            article.categorie.toLowerCase().includes(searchLower)
          );
        }
        if (filters.categorie) {
          matches = matches && article.categorie === filters.categorie;
        }
        if (filters.stockAlert) {
          matches = matches && article.quantite <= article.seuilMin;
        }
        return matches;
      });
      return filteredArticles;
    } catch (error) {
      return [];
    }
  }
};

export default articlesService;