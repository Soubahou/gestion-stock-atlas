import * as Yup from 'yup';

export const articleSchema = Yup.object().shape({
  reference: Yup.string()
    .required('La référence est requise')
    .matches(/^ART-\d{3}$/, 'Format: ART-001'),
  nom: Yup.string()
    .required('Le nom est requis')
    .min(3, 'Minimum 3 caractères'),
  categorie: Yup.string()
    .required('La catégorie est requise'),
  quantite: Yup.number()
    .required('La quantité est requise')
    .min(0, 'La quantité ne peut pas être négative'),
  unite: Yup.string()
    .required("L'unité est requise"),
  seuilMin: Yup.number()
    .required('Le seuil minimum est requis')
    .min(0, 'Le seuil ne peut pas être négatif'),
  prixUnitaire: Yup.number()
    .required('Le prix unitaire est requis')
    .min(0, 'Le prix ne peut pas être négatif'),
});
  
export const mouvementSchema = (article) => Yup.object().shape({
    articleId: Yup.string().required('Article requis'),
    type: Yup.string().required('Type requis'),
    quantite: Yup.number()
      .required('Quantité requise')
      .min(1, 'Minimum 1')
      .test(
        'stock-validation',
        'Stock insuffisant',
        function(value) {
          if (this.parent.type === 'sortie' && article) {
            return value <= article.quantite;
          }
          return true;
        }
      ),
    date: Yup.date().required('Date requise'),
    motif: Yup.string().required('Motif requis'),
    utilisateur: Yup.string().required('Utilisateur requis'),
  });
