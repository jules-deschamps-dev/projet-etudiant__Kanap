
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





//  RECUPERER L'ID DEPUIS L'URL
const getId = () => {
  let parameter = new URLSearchParams(document.location.search);
  return parameter.get('id');
}// ________________________________________________________________________




//  AFFICHE L'ITEM DANS LA PAGE PRODUIT
const itemGenesis = async () => {
  let id = getId();
  const result = await fetch("http://localhost:3000/api/products/" + id );
  const item = await result.json();
  document.getElementById("title").textContent = item.name;
  document.getElementById("description").textContent = item.description;
  document.getElementById("price").textContent = item.price;
  newElement('img', {"src" : item.imageUrl, "alt" : item.altTxt}, null, document.getElementsByClassName("item__img")[0]);
  for (color in item.colors){
    newElement('option', {"value" : item.colors[color]}, item.colors[color], document.getElementById("colors"));
  }
  document.getElementById("addToCart").setAttribute("onclick", "addToCart()");
}// ________________________________________________________________________





//  AJOUTE UN ITEM AU PANIER
const addToCart = () => {
  let panierLocal = JSON.parse(window.localStorage.getItem('panier'));
  let panier = [];
  let item = {
    "_id" : getId(),
    "color" : document.getElementById("colors").value,
    "quantity" : document.getElementById("quantity").value,
  }
  control(item);

  if (panierLocal === null && validAdd) {
    panier.push(item);
    window.localStorage.setItem("panier", JSON.stringify(panier));
  } else if (validAdd){   
    let match = false;
    for (element of panierLocal){
      if (item._id == element._id && item.color == element.color){
        element.quantity = parseInt(item.quantity) + parseInt(element.quantity);
        match = true;
      }
    }
    if (match){
      window.localStorage.setItem("panier", JSON.stringify(panierLocal));
    } else {
      panierLocal.push(item);
      window.localStorage.setItem("panier", JSON.stringify(panierLocal));
    }
  }
}// ________________________________________________________________________





//  CONTROLE QUE LA COULEUR ET LA QUANTITE ONT BIEN ETE INDIQUE
const control = (item) => {
  if (item.quantity > 0){
    document.getElementsByClassName("item__content__settings__quantity")[0].style.color = "inherit";
    document.getElementsByClassName("item__content__settings__quantity")[0].style.fontWeight = "inherit";
    validQuantity = true;
  } else {
    document.getElementsByClassName("item__content__settings__quantity")[0].style.color = "red";
    document.getElementsByClassName("item__content__settings__quantity")[0].style.fontWeight = "bold";
    validQuantity = false;
  }

  if (item.color != ""){
    document.getElementsByClassName("item__content__settings__color")[0].style.color = "inherit";
    document.getElementsByClassName("item__content__settings__color")[0].style.fontWeight = "inherit";
    validColor = true;
  } else {
    document.getElementsByClassName("item__content__settings__color")[0].style.color = "red";
    document.getElementsByClassName("item__content__settings__color")[0].style.fontWeight = "bold";
    validColor = false;
  }
  if (validQuantity && validColor){
    validAdd = true;
  } else{
    validAdd = false;
  }
  return validAdd;
}// ________________________________________________________________________