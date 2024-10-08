// db.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const usersFile = path.join(__dirname, './users.json');
const productsFile = path.join(__dirname, './products.json');
const cartsFile = path.join(__dirname, './carts.json');	
const wishlistsFile = path.join(__dirname, './wishlists.json');

const readJSON = (filename) => {
  try {
    const data = fs.readFileSync(filename, 'utf8');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`File ${filename} not found`);
      return [];
    }
    throw error;
  }
};

const writeJSON = (file, data) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
};

export default {
  getUsers: () => readJSON(usersFile),
  saveUsers: (data) => writeJSON(usersFile, data),
  getProducts: () => readJSON(productsFile),
  saveProducts: (data) => writeJSON(productsFile, data),
  getCarts: () => readJSON(cartsFile),
  saveCarts: (data) => writeJSON(cartsFile, data),
  getWishlists: () => readJSON(wishlistsFile),
  saveWishlists: (data) => writeJSON(wishlistsFile, data),
};