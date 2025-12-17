const fs = require("fs");
const path = require("path");
const http = require("http");

const PORT = 5000;
const DB_FILE = path.join(__dirname, "db.json");

const readDB = () => {
  try {
    const data = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return { articles: [], mouvements: [] };
  }
};

const writeDB = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === "GET") {
    const db = readDB();

    if (req.url === "/articles") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(db.articles));
      return;
    }

    if (req.url === "/mouvements") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(db.mouvements));
      return;
    }

    if (req.url.match(/^\/articles\/\d+$/)) {
      const id = parseInt(req.url.split("/")[2]);
      const article = db.articles.find((a) => a.id === id);

      if (article) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(article));
      } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Article non trouvé" }));
      }
      return;
    }

    if (req.url.match(/^\/mouvements\/\d+$/)) {
      const id = parseInt(req.url.split("/")[2]);
      const mouvement = db.mouvements.find((m) => m.id === id);

      if (mouvement) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(mouvement));
      } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Mouvement non trouvé" }));
      }
      return;
    }
  }

  if (req.method === "POST" && req.url === "/articles") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const articleData = JSON.parse(body);

        const db = readDB();

        if (!articleData.nom || !articleData.reference) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Nom et référence requis" }));
          return;
        }

        const newId =
          db.articles.length > 0
            ? Math.max(...db.articles.map((a) => a.id)) + 1
            : 1;

        const nouvelArticle = {
          id: newId,
          ...articleData,
          quantite: articleData.quantite || 0,
          seuilMin: articleData.seuilMin || 10,
          unite: articleData.unite || "pièce",
          prixUnitaire: articleData.prixUnitaire || 0,
          createdAt: new Date().toISOString().split("T")[0],
        };

        db.articles.push(nouvelArticle);

        writeDB(db);

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(nouvelArticle));
      } catch (error) {
        console.log("Erreur:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Erreur serveur" }));
      }
    });

    return;
  }

  if (req.method === "PUT" && req.url.match(/^\/articles\/\d+$/)) {
    const id = parseInt(req.url.split("/")[2]);
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const articleData = JSON.parse(body);
        const db = readDB();

        const articleIndex = db.articles.findIndex((a) => a.id === id);

        if (articleIndex === -1) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Article non trouvé" }));
          return;
        }

        const article = db.articles[articleIndex];
        const articleMisAJour = {
          ...article,
          ...articleData,
          id: id,
        };

        db.articles[articleIndex] = articleMisAJour;

        writeDB(db);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(articleMisAJour));
      } catch (error) {
        console.error("Erreur:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Erreur serveur" }));
      }
    });

    return;
  }

  if (req.method === "DELETE" && req.url.match(/^\/articles\/\d+$/)) {
    const id = parseInt(req.url.split("/")[2]);

    const db = readDB();

    const articleIndex = db.articles.findIndex((a) => a.id === id);

    if (articleIndex === -1) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: "Article non trouvé" }));
      return;
    }

    const hasMouvements = db.mouvements.some((m) => m.articleId === id);
    if (hasMouvements) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          error:
            "Impossible de supprimer cet article car il a des mouvements associés",
        })
      );
      return;
    }

    db.articles.splice(articleIndex, 1);

    writeDB(db);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Article supprimé" }));
    return;
  }

  if (req.method === "POST" && req.url === "/mouvements") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const mouvement = JSON.parse(body);
        const db = readDB();

        if (!mouvement.articleId || !mouvement.type || !mouvement.quantite) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Données manquantes" }));
          return;
        }

        const articleIndex = db.articles.findIndex(
          (a) => a.id === mouvement.articleId
        );

        if (articleIndex === -1) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Article non trouvé" }));
          return;
        }

        const article = db.articles[articleIndex];

        if (
          mouvement.type === "sortie" &&
          mouvement.quantite > article.quantite
        ) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              error: "Stock insuffisant",
              stockDisponible: article.quantite,
            })
          );
          return;
        }

        const nouveauStock =
          mouvement.type === "entrée"
            ? article.quantite + mouvement.quantite
            : article.quantite - mouvement.quantite;

        db.articles[articleIndex].quantite = nouveauStock;

        const newId =
          db.mouvements.length > 0
            ? Math.max(...db.mouvements.map((m) => m.id)) + 1
            : 1;

        const nouveauMouvement = {
          id: newId,
          ...mouvement,
          createdAt: new Date().toISOString(),
        };

        db.mouvements.push(nouveauMouvement);

        writeDB(db);

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(nouveauMouvement));
      } catch (error) {
        console.log("Erreur:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Erreur serveur" }));
      }
    });

    return;
  }

  if (req.method === "DELETE" && req.url.match(/^\/mouvements\/\d+$/)) {
    const id = parseInt(req.url.split("/")[2]);

    const db = readDB();

    const mouvementIndex = db.mouvements.findIndex((m) => m.id === id);

    if (mouvementIndex === -1) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: "Mouvement non trouvé" }));
      return;
    }

    const mouvement = db.mouvements[mouvementIndex];

    const articleIndex = db.articles.findIndex(
      (a) => a.id === mouvement.articleId
    );

    if (articleIndex !== -1) {
      const article = db.articles[articleIndex];
      const nouveauStock =
        mouvement.type === "entrée"
          ? article.quantite - mouvement.quantite
          : article.quantite + mouvement.quantite;

      db.articles[articleIndex].quantite = nouveauStock;
    }

    db.mouvements.splice(mouvementIndex, 1);

    writeDB(db);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Mouvement supprimé" }));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: "Route non trouvée" }));
});

server.listen(PORT, () => {
  console.log(`✅ Serveur en cours sur http://localhost:${PORT}`);
});
