/* Small on-site decisions; salary still requires the existing full service. */
const WorkScenes={
 cafe:[
  {text:'Une cliente souhaite une table au calme. Comment l’accueillir ?',choices:['Lui proposer une place et prendre sa commande','La faire repartir','Servir sans demander'],correct:0},
  {text:'Commande de la table fleurie : café et tartine. Prépare le bon plateau.',choices:['Une caisse de provisions','Café et tartine','Un vase de fleurs'],correct:1},
  {text:'Le plateau est prêt pour la table fleurie. Que fais-tu ?',choices:['Le ranger dans la réserve','Le jeter','Apporter le plateau à la table'],correct:2},
  {text:'Le client a quitté la table. Prépare-la pour la prochaine visite.',choices:['Nettoyer et remettre les couverts','Poser des cartons sur la table','Laisser les assiettes sales'],correct:0}
 ],
 shop:[
  {text:'La livraison arrive. Vérifie les provisions avant le rangement.',choices:['Laisser les cartons dans le passage','Contrôler puis réceptionner les cartons','Les poser devant la sortie'],correct:1},
  {text:'Le rayon de gauche doit recevoir les produits secs.',choices:['Ranger les fleurs','Fermer le magasin','Aligner les produits secs'],correct:2},
  {text:'Le rayon de droite manque de provisions. Garde le passage libre.',choices:['Réapprovisionner le rayon sans bloquer le passage','Empiler devant la porte','Laisser les cartons au sol'],correct:0},
  {text:'Une cliente attend à la caisse.',choices:['Fermer la caisse','Accueillir la cliente et traiter ses achats','Partir au parc'],correct:1}
 ],
 gardener:[
  {text:'Prépare un arrosoir et des outils pour le massif.',choices:['Prendre un plateau de café','Emporter les produits du magasin','Prendre les outils de jardin'],correct:2},
  {text:'Les fleurs ont besoin d’eau au pied.',choices:['Arroser doucement au pied des fleurs','Vider l’eau sur le trottoir','Arroser les bancs'],correct:0},
  {text:'Le massif doit être entretenu en préservant les fleurs.',choices:['Retirer toutes les fleurs','Désherber et ameublir autour des plantes','Piétiner le massif'],correct:1},
  {text:'Des feuilles couvrent le chemin du parc.',choices:['Les pousser sur les fleurs','Bloquer le chemin','Balayer et regrouper les feuilles'],correct:2}
 ]
};
for(const [id,choices]of Object.entries({chef:['Vérifier les ingrédients et préparer le poste','Découper sur une planche propre','Remuer et surveiller la cuisson','Dresser les portions à servir'],teacher:['Accueillir les élèves et expliquer la journée','Préparer les supports de lecture','Expliquer le cours à la classe','Ranger les livres en laissant le passage libre'],mechanic:['Écouter la demande du client','Inspecter la roue sur le poste réservé','Utiliser l’établi et les outils adaptés','Ranger les outils après le travail'],care:['Accueillir la famille et écouter sa demande','Préparer une salle propre','Ranger les fournitures','Noter le rendez-vous dans le carnet']}))WorkScenes[id]=choices.map(text=>({text:'Que fais-tu à ce poste ?',choices:[text,'Quitter la tâche sans la terminer','Laisser le poste encombré'],correct:0}));
if(typeof module!=='undefined')module.exports=WorkScenes;
