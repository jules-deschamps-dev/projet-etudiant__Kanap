
//import { newElement } from "global.js";
// ______________________________GLOBAL_______________________________
function newElement(tagname, attributs, inner, parentNode) {
  //tagname
  let newItem = document.createElement(tagname);
  //attributs
  if (attributs != null){
    for (let attribut in attributs){
      newItem.setAttribute(attribut, attributs[attribut]);
    }
  }
  //inner
  if (inner != null){
    newItem.textContent = inner;
  }
  //node
  if (parentNode != null){
    parentNode.appendChild(newItem);
  }
  return newItem;
}
// ________________________________________________________________________
// __________________________________________________________________________



//  AFFICHE LES PRODUITS DANS LA PAGE INDEX
const itemGenesis = async () => {
  const result = await fetch("http://localhost:3000/api/products");
  const value = await result.json();
  let parent = document.getElementById("items");               
  for (let element of value){
    //créer array pour attributs !
    let itemLink = newElement('a', {"href" : "product.html?id=" + element._id}, null, parent);
    let itemArticle = newElement('article', null, null, itemLink);
    newElement('img', {"src" : element.imageUrl, "alt" : element.altTxt}, null, itemArticle);
    newElement("h3", null, element.name, itemArticle);
    newElement("p", null, element.description, itemArticle);
  }
} // ________________________________________________________________________
