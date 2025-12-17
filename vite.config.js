/**
 * Configuration de Vite
 * 1.Serveur de développement
 * 2.Build de production
 */

import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server:{
    port: 5173,
    host: true // autoriser les autres personnes a utiliser le projet
  },
  preview:{
    port: 5174,
    host: true
  },
  build:{
    outDir: 'dist' // dossier ou seront générés les fichiers optimisés pour la production 
  }
})