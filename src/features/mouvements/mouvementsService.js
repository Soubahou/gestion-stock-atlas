import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const mouvementsService = {
  fetchMouvements: async () => {
    try {
      const response = await axios.get(`${API_URL}/mouvements`);
      console.log('Mouvements récupérés:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('Erreur fetchMouvements:', error);
      return [];
    }
  },

  createMouvement: async (mouvementData) => {
    try {
      
      const dataToSend = {
        ...mouvementData,
        articleId: parseInt(mouvementData.articleId),
        quantite: parseInt(mouvementData.quantite)
      };
      
      
      const response = await axios.post(`${API_URL}/mouvements`, dataToSend);
      
      return response.data;
      
    } catch (error) {
      console.log('❌ Erreur:', error.message);
    }
  },

  deleteMouvement: async (id) => {
    try {
      await axios.delete(`${API_URL}/mouvements/${id}`);
      return id;
    } catch (error) {
      console.log('❌ Erreur:', error.message);
    }
  }
};