import { epochToIST } from './format-time';

export const createChatData = (data) =>
  data?.map((d) => ({ x: epochToIST(d[0]), y: d.slice(1, d.length - 1) }));
