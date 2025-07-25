// frontend/src/index.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ethers } from 'ethers'; // Ethers'ı import et

// --- ENS HATASINI ÇÖZEN KOD BLOKU ---
// Ethers provider'ının ENS adres çözümleme fonksiyonunu devre dışı bırakıyoruz.
// Bu, yerel Hardhat ağında "network does not support ENS" hatasını önler.
ethers.JsonRpcProvider.prototype.resolveName = async function (name) {
  return name;
};
// ------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);