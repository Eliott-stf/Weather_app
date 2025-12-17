/**
 * Point d'entrée principal de l'application 
 * 
 * c'est le premier fichier a etre éxecuté lors du démarrage de l'application
 * 
 * Ordre d'exécution:
 * 1.import des style CSS
 * 2.import de la class App(code de l'application)
 * 3.Récupèration de l'élément DOM racine
 * 4.Création de l'instance App
 * 5.Montage de l'application dans le DOM
 */



//1.on importe le css
import "./style.css";

//2. on importe le classe App
import { App } from "./app.js";

//3. on récupère  l'élement DOM racine  (id=app)
const appContainer = document.getElementById("app");

//4.on créer une instance de App
const app = new App(appContainer);

//5.Montage de l'application dans le DOM
app.mount();