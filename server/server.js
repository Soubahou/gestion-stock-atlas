const fs = require("fs");
const path = require("path");
const http = require("http");

const PORT = 5000;
const DB_FILE = path.join(__dirname, "db.json");

/* =========================
   DB HELPERS
========================= */

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

/* =========================
   UTILS
========================= */

const generateBonRef = (type, counter) => {
  const prefix = type === "ENTREE" ? "BON-ENT" : "BON-SOR";
  return `${prefix}-${String(counter).padStart(4, "0")}`;
};

/* =========================
   SERVER
========================= */

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }

  const db = readDB();

  /* =========================
     GET
  ========================= */

  if (req.method === "GET") {
    if (req.url === "/articles") {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(db.articles));
    }

    if (req.url === "/bons") {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(db.bons));
    }

    if (req.url.match(/^\/articles\/\d+$/)) {
      const id = parseInt(req.url.split("/")[2]);
      const article = db.articles.find((a) => a.id === id);

      if (!article) {
        res.writeHead(404);
        return res.end(JSON.stringify({ error: "Article non trouvé" }));
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(article));
    }
  }

  /* =========================
     POST ARTICLES
  ========================= */

  if (req.method === "POST" && req.url === "/articles") {
    let body = "";

    req.on("data", (chunk) => (body += chunk.toString()));
    req.on("end", () => {
      try {
        const articleData = JSON.parse(body);

        if (!articleData.nom || !articleData.reference) {
          res.writeHead(400);
          return res.end(
            JSON.stringify({ error: "Nom et référence requis" })
          );
        }

        const newArticle = {
          id: Date.now(),
          reference: articleData.reference,
          nom: articleData.nom,
          categorie: articleData.categorie || "",
          quantite: articleData.quantite || 0,
          unite: articleData.unite || "pièce",
          seuilMin: articleData.seuilMin || 0,
          emplacement: articleData.emplacement || "",
          fournisseur: articleData.fournisseur || "",
          prixUnitaire: articleData.prixUnitaire || 0,
          createdAt: new Date().toISOString().split("T")[0],
        };

        db.articles.push(newArticle);
        writeDB(db);

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(newArticle));
      } catch {
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Erreur serveur" }));
      }
    });

    return;
  }

  /* =========================
     POST BONS
  ========================= */

  if (req.method === "POST" && req.url === "/bons") {
    let body = "";

    req.on("data", (chunk) => (body += chunk.toString()));
    req.on("end", () => {
      try {
        const { type, date, articles, motif, utilisateur } = JSON.parse(body);

        if (!type || !articles || articles.length === 0) {
          res.writeHead(400);
          return res.end(JSON.stringify({ error: "Bon invalide" }));
        }

        // Validate stock for SORTIE
        if (type === "SORTIE") {
          for (const item of articles) {
            const article = db.articles.find((a) => a.id === item.articleId);
            if (!article) {
              res.writeHead(404);
              return res.end(JSON.stringify({ error: "Article introuvable" }));
            }
            if (item.quantity > article.quantite) {
              res.writeHead(400);
              return res.end(
                JSON.stringify({
                  error: `Stock insuffisant pour ${article.nom}`,
                  stockDisponible: article.quantite,
                })
              );
            }
          }
        }

        // Generate ref
        db.counters[type] += 1;
        const ref = generateBonRef(type, db.counters[type]);

        // Update stock
        articles.forEach((item) => {
          const article = db.articles.find((a) => a.id === item.articleId);
          if (type === "ENTREE") article.quantite += item.quantity;
          else article.quantite -= item.quantity;
        });

        const bon = {
          id: Date.now(),
          ref,
          type,
          date,
          articles,
          motif: motif || "",
          utilisateur: utilisateur || "Admin",
          createdAt: new Date().toISOString(),
        };

        db.bons.push(bon);
        writeDB(db);

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(bon));
      } catch (error) {
        console.error(error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Erreur serveur" }));
      }
    });

    return;
  }

  /* =========================
     DELETE BON
  ========================= */

  if (req.method === "DELETE" && req.url.match(/^\/bons\/\d+$/)) {
    const id = parseInt(req.url.split("/")[2]);
    const bonIndex = db.bons.findIndex((b) => b.id === id);

    if (bonIndex === -1) {
      res.writeHead(404);
      return res.end(JSON.stringify({ error: "Bon non trouvé" }));
    }

    const bon = db.bons[bonIndex];

    // Validate reversal
    if (bon.type === "ENTREE") {
      for (const item of bon.articles) {
        const article = db.articles.find((a) => a.id === item.articleId);
        if (!article || article.quantite < item.quantity) {
          res.writeHead(400);
          return res.end(
            JSON.stringify({
              error: "Suppression impossible : stock insuffisant pour annulation",
            })
          );
        }
      }
    }

    // Reverse stock
    bon.articles.forEach((item) => {
      const article = db.articles.find((a) => a.id === item.articleId);
      if (bon.type === "ENTREE") article.quantite -= item.quantity;
      else article.quantite += item.quantity;
    });

    db.bons.splice(bonIndex, 1);
    writeDB(db);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Bon supprimé avec succès" }));
    return;
  }

  // 404
  res.writeHead(404);
  res.end(JSON.stringify({ error: "Route non trouvée" }));
});

server.listen(PORT, () => {
  console.log(`✅ Serveur en cours sur http://localhost:${PORT}`);
});
