function generateBonRef(type, counter) {
  const prefix = type === "ENTREE" ? "BON-ENT" : "BON-SOR";
  return `${prefix}-${String(counter).padStart(4, "0")}`;
}

module.exports = generateBonRef;