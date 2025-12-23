import { bonsApi } from "../../api/mockApi";

export const fetchBonsAPI = async () => {
  const res = await bonsApi.getAll();
  return res.data;
};

export const createBonAPI = async (bon) => {
  const res = await bonsApi.create(bon);
  return res.data;
};

export const deleteBonAPI = async (id) => {
  const res = await bonsApi.delete(id);
  return res.data;
};
