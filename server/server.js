const fs = require("fs");
const path = require("path");
const http = require("http");

const PORT = 5000;
const DB_FILE = path.join(__dirname, "db.json");

const readDB = () => {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  } catch {
    return { articles: [], bons: [], counters: { ENTREE: 0, SORTIE: 0 } };
  }
};

const writeDB = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

const generateBonRef = (type) => {
  const prefix = type === "ENTREE" ? "BON-ENT" : "BON-SOR";
  return `${prefix}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`;
};

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }

  const db = readDB();

  if (req.method === "GET" && req.url === "/articles") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(db.articles));
  }

  if (req.method === "GET" && req.url === "/bons") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(db.bons));
  }

  if (req.method === "GET" && req.url.match(/^\/articles\/\d+$/)) {
    const id = parseInt(req.url.split("/")[2]);
    const article = db.articles.find(a => a.id === id);

    if (!article) {
      res.writeHead(404);
      return res.end(JSON.stringify({ error: "Article non trouvé" }));
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(article));
  }

  if (req.method === "POST" && req.url === "/articles") {
    let body = "";

    req.on("data", chunk => (body += chunk.toString()));
    req.on("end", () => {
      try {
        const data = JSON.parse(body);

        if (!data.nom || !data.reference) {
          res.writeHead(400);
          return res.end(JSON.stringify({ error: "Nom et référence requis" }));
        }

        const article = {
          id: Date.now(),
          reference: data.reference,
          nom: data.nom,
          categorie: data.categorie || "",
          quantite: data.quantite || 0,
          unite: data.unite || "pièce",
          seuilMin: data.seuilMin || 0,
          emplacement: data.emplacement || "",
          fournisseur: data.fournisseur || "",
          prixUnitaire: data.prixUnitaire || 0,
          createdAt: new Date().toISOString().split("T")[0]
        };

        db.articles.push(article);
        writeDB(db);

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(article));
      } catch {
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Erreur serveur" }));
      }
    });

    return;
  }

  if (req.method === "PUT" && req.url.match(/^\/articles\/\d+$/)) {
    const id = parseInt(req.url.split("/")[2]);
    let body = "";

    req.on("data", chunk => (body += chunk.toString()));
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        const index = db.articles.findIndex(a => a.id === id);

        if (index === -1) {
          res.writeHead(404);
          return res.end(JSON.stringify({ error: "Article non trouvé" }));
        }

        db.articles[index] = {
          ...db.articles[index],
          ...data,
          id
        };

        writeDB(db);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(db.articles[index]));
      } catch {
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Erreur serveur" }));
      }
    });

    return;
  }

  if (req.method === "POST" && req.url === "/bons") {
    let body = "";

    req.on("data", chunk => (body += chunk.toString()));
    req.on("end", () => {
      try {
        const { type, date, articles, motif, utilisateur } = JSON.parse(body);

        if (!type || !articles || !articles.length) {
          res.writeHead(400);
          return res.end(JSON.stringify({ error: "Bon invalide" }));
        }

        if (type === "SORTIE") {
          for (const item of articles) {
            const article = db.articles.find(a => a.id === item.articleId);
            if (!article || item.quantity > article.quantite) {
              res.writeHead(400);
              return res.end(JSON.stringify({ error: "Stock insuffisant" }));
            }
          }
        }

        articles.forEach(item => {
          const article = db.articles.find(a => a.id === item.articleId);
          if (type === "ENTREE") article.quantite += item.quantity;
          else article.quantite -= item.quantity;
        });

        const bon = {
          id: Date.now(),
          ref: generateBonRef(type),
          type,
          date,
          articles,
          motif: motif || "",
          utilisateur: utilisateur || "Admin",
          createdAt: new Date().toISOString()
        };

        db.bons.push(bon);
        writeDB(db);

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(bon));
      } catch {
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Erreur serveur" }));
      }
    });

    return;
  }

  if (req.method === "DELETE" && req.url.match(/^\/bons\/\d+$/)) {
    const id = parseInt(req.url.split("/")[2]);
    const index = db.bons.findIndex(b => b.id === id);

    if (index === -1) {
      res.writeHead(404);
      return res.end(JSON.stringify({ error: "Bon non trouvé" }));
    }

    const bon = db.bons[index];

    bon.articles.forEach(item => {
      const article = db.articles.find(a => a.id === item.articleId);
      if (bon.type === "ENTREE") article.quantite -= item.quantity;
      else article.quantite += item.quantity;
    });

    db.bons.splice(index, 1);
    writeDB(db);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Bon supprimé" }));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: "Route non trouvée" }));
});

server.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
