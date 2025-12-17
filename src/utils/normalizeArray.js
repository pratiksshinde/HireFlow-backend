const normalizeArray = (value) => {
  if (Array.isArray(value)) return value;

  if (typeof value === "string" && value.trim() !== "") {
    return value.split(",").map(v => v.trim());
  }

  return [];
};

module.exports = normalizeArray;
