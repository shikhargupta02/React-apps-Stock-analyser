export const API_KEY = "RZOSIHBR6MCJ0GG8";
export const transformSeasrchRsults = (results) => {
  const data = [];
  const key = "4. region";
  const nameKey = "2. name";
  if (results?.bestMatches?.length > 0) {
    for (let item of results.bestMatches) {
      if (item[key] === "United States")
        data.push({ ...item, name: item[nameKey] });
    }
  }
  return data;
};
