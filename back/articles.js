let validAdd = true;


//  CREE DE NOUVEAU ELEMENT
const newElement = (tagname, attributs, inner, parentNode) => {
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
}// ________________________________________________________________________





//  AFFICHE LES PRODUITS DANS LA PAGE INDEX
const itemGenesis_index = async () => {
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


  


//  AFFICHE L'ITEM DANS LA PAGE PRODUIT
const itemGenesis_produce = async () => {
  const result = await fetch("http://localhost:3000/api/products");
  const value = await result.json();
  let parent = document.getElementById("items");          
  for (let element of value) {                           
    if (element["_id"] == __urlId() ){
      let item = value[value.indexOf(element)];
      document.getElementById("title").textContent = item.name;
      document.getElementById("description").textContent = item.description;
      document.getElementById("price").textContent = item.price;
      newElement('img', {"src" : item.imageUrl, "alt" : item.altTxt}, null, document.getElementsByClassName("item__img")[0]);
      for (color in item.colors){
        newElement('option', {"value" : item.colors[color]}, item.colors[color], document.getElementById("colors"));
      }
      document.getElementById("addToCart").setAttribute("onmouseover", "addToCart()");
    }
  }
} // ________________________________________________________________________





//  AFFICHE LES PRODUITS DANS LE PANIER
const cartSynthesis = async () => {
  document.getElementById("order").setAttribute("onmouseover", "postForm()")
  const result = await fetch("http://localhost:3000/api/products");
  const value = await result.json();
  let parent = document.getElementById("cart__items");
  let panierLocal = JSON.parse(localStorage.getItem("panier"));

  for (element of panierLocal){
    let item = value.find(item => item._id == element._id);
    let itemResume = newElement('article', {"class" : "cart__item", "data-id" : element.id, "data-color" : element.color}, null, parent);
    let itemImg = newElement('div', {"class" : "cart__item__img"}, null, itemResume);
    newElement('img', {"src" : item.imageUrl, "alt" : "Photographie d'un canapé"}, null, itemImg);
    
    let itemContent = newElement('div', {"class" : "cart__item__content"}, null, itemResume);
    let itemContent_describe = newElement('div', {"class" : "cart__item__content__description"}, null, itemContent);
    newElement("h2", null, item.name, itemContent_describe);
    newElement("p", null, element.color, itemContent_describe);
    newElement("p", null, item.price * element.quantity + ' €', itemContent_describe);
    
    let itemContent_parameter = newElement('div', {"class" : "cart__item__content__settings"}, null, itemContent);
    newElement('p', null, element.quantity, itemContent_parameter);
  }
  total();
}
  
// ________________________________________________________________________



  

//  RECUPERER L'ID DEPUIS L'URL
const __urlId = () => {
  let parameter = new URLSearchParams(document.location.search);
  return parameter.get('id');
}// ________________________________________________________________________



//  AJOUTE UN ITEM AU PANIER
const addToCart = () => {
  let panierLocal = JSON.parse(localStorage.getItem('panier'));
  let panier = [];
  let item = {
    "_id" : __urlId(),
    "color" : document.getElementById("colors").value,
    "quantity" : document.getElementById("quantity").value,
  }
  control(item);

  if (panierLocal === null && validAdd) {
    panier.push(item);
    localStorage.setItem("panier", JSON.stringify(panier));
  } else if (validAdd){
    let match = false;
    for (element of panierLocal){
      if (item._id == element._id && item.color == element.color){
        element.quantity = parseInt(item.quantity) + parseInt(element.quantity);
        match = true;
      }
    }
    if (match){
      localStorage.setItem("panier", JSON.stringify(panierLocal));
    } else {
      panierLocal.push(item);
      localStorage.setItem("panier", JSON.stringify(panierLocal));
    }
  } 
  console.log(localStorage.getItem("panier"));
}// ________________________________________________________________________





//  PAGE DE VALIDATION
const validation = () => {
  document.getElementById("orderId").textContent = Math.ceil(Math.random() * (Math.pow(10, 9) - Math.pow(10, 8) + Math.pow(10, 8)));
  localStorage.clear();
}// ________________________________________________________________________





//  FORMULAIRE //
const getForm = () => {
  let userData = JSON.parse(localStorage.getItem("userData"));   //ou localStorage.userData
}

const postForm = () => {
  let userData = [];
  for (element of document.getElementsByTagName("input")){
    let data = [];
    if (element.type != "submit"){
      manageForm(element);
      data.push(element.name);
      data.push(element.value);
    }
    userData.push(data);
  }
  if (manageForm(userData)){
    localStorage.setItem("userData", JSON.stringify(userData));
  }
}



const manageForm = (userData) => {
  let validateData = true;
  console.log("alldata", userData);
  userData.forEach(element => {
    if (element.name == 'firstName', 'lastName'){
      console.log("element", element.name); 
      if (element.value.match(/^([a-zA-Z ]+)$/)){
        document.getElementById(element.name).textContent = "Veillez saisir une donnée valide";
      }
    }
  })
  validateData = false;
}
// ________________________________________________________________________





//  CALCUL DU TOTAL
const total = async () => {
  let totalPrice = 0;
  let totalQuantity = 0;
  const result = await fetch("http://localhost:3000/api/products");
  const value = await result.json();
  let panierLocal = JSON.parse(localStorage.getItem('panier'));
  for (element of panierLocal){
    for (item of value) {
      if (item._id == element._id ){
        totalPrice += item.price * element.quantity;
        totalQuantity += parseInt(element.quantity);
      }
    }
  }
  document.getElementById("totalPrice").textContent = totalPrice;
  document.getElementById("totalQuantity").textContent = totalQuantity;
}// ________________________________________________________________________





//  CONTROLE QUE LA COULEUR ET LA QUANTITE ONT BIEN ETE INDIQUE
const control = (item) => {
  console.log("quantity", item.quantity);
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











/*
let validAdd = true;


//  CREE DE NOUVEAU ELEMENT
const newElement = (tagname, attributs, inner, parentNode) => {
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
}// ________________________________________________________________________





//  AFFICHE LES PRODUITS DANS LA PAGE INDEX
const itemGenesis_index = async () => {
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


  


//  AFFICHE L'ITEM DANS LA PAGE PRODUIT
const itemGenesis_produce = async () => {
  const result = await fetch("http://localhost:3000/api/products");
  const value = await result.json();
  let parent = document.getElementById("items");          
  for (let element of value) {                           
    if (element["_id"] == __urlId() ){
      let item = value[value.indexOf(element)];
      document.getElementById("title").textContent = item.name;
      document.getElementById("description").textContent = item.description;
      document.getElementById("price").textContent = item.price;
      newElement('img', {"src" : item.imageUrl, "alt" : item.altTxt}, null, document.getElementsByClassName("item__img")[0]);
      for (color in item.colors){
        newElement('option', {"value" : item.colors[color]}, item.colors[color], document.getElementById("colors"));
      }
      document.getElementById("addToCart").setAttribute("onmouseover", "__addToCart()");
    }
  }
} // ________________________________________________________________________





//  AFFICHE LES PRODUITS DANS LE PANIER
const cartSynthesis = async () => {
  document.getElementById("order").setAttribute("onclick", "controlForm()")
  const result = await fetch("http://localhost:3000/api/products");
  const value = await result.json();
  let parent = document.getElementById("cart__items");
  let panierLocal = JSON.parse(localStorage.getItem("panier"));

  for (let item of value) { //on parcourt la base de donnee json
    let i = 0;   
    for (let element of panierLocal){ //parcourt du local panier
      if (item._id == panierLocal[i]._id ){  //on observe si il y a un match d'id
        let itemResume = newElement(
          'article', 
          {"class" : "cart__item", "data-id" : element.id, "data-color" : element.color}, 
          null, 
          parent);
        let itemImg = newElement('div', {"class" : "cart__item__img"}, null, itemResume);
        newElement('img', {"src" : item.imageUrl, "alt" : "Photographie d'un canapé"}, null, itemImg);
        
        let itemContent = newElement('div', {"class" : "cart__item__content"}, null, itemResume);
        let itemContent_describe = newElement('div', {"class" : "cart__item__content__description"}, null, itemContent);
        newElement("h2", null, item.name, itemContent_describe);
        newElement("p", null, element.color, itemContent_describe);
        newElement("p", null, item.price * element.quantity + ' €', itemContent_describe);
        
        let itemContent_parameter = newElement('div', {"class" : "cart__item__content__settings"}, null, itemContent);
        newElement('p', null, element.quantity, itemContent_parameter);
      }
      i++;// on ajoute une itération pour continuer à parcourir le localStorage
    }
  }
  total();
}// ________________________________________________________________________



  

//  RECUPERER L'ID DEPUIS L'URL
const __urlId = () => {
  let parameter = new URLSearchParams(document.location.search);
  return parameter.get('id');
}// ________________________________________________________________________


const findProduct = async (item) => {
  const result = await fetch("http://localhost:3000/api/products");
  const data = await result.json();
  data.find(item => item._id == panierLocal._id)
}


//  AJOUTE UN ITEM AU PANIER
const __addToCart = () => {
  let panierLocal = JSON.parse(localStorage.getItem('panier'));
  let panier = [];
  let item = {
    "_id" : __urlId(),
    "color" : document.getElementById("colors").value,
    "quantity" : document.getElementById("quantity").value,
  }
  control(item);

  if (panierLocal === null && validAdd) {
    panier.push(item);
    localStorage.setItem("panier", JSON.stringify(panier));
  } else if (validAdd){
    let match = false;
    for (element of panierLocal){
      if (item._id == element._id && item.color == element.color){
        element.quantity = parseInt(item.quantity) + parseInt(element.quantity);
        match = true;
      }
    }
    if (match){
      localStorage.setItem("panier", JSON.stringify(panierLocal));
    } else {
      panierLocal.push(item);
      localStorage.setItem("panier", JSON.stringify(panierLocal));
    }
  } 
  console.log(localStorage.getItem("panier"));
}// ________________________________________________________________________





//  PAGE DE VALIDATION
const validation = () => {
  document.getElementById("orderId").textContent = Math.ceil(Math.random() * (Math.pow(10, 9) - Math.pow(10, 8) + Math.pow(10, 8)));
  localStorage.clear();
}// ________________________________________________________________________





//  VERIFICATION FORMULAIRE
const controlForm = () => {
  if(! firstName.match(/^([a-zA-Z ]+)$/))
    control.log("invalid");
}// ________________________________________________________________________





//  CALCUL DU TOTAL
const total = async () => {
  let totalPrice = 0;
  let totalQuantity = 0;
  const result = await fetch("http://localhost:3000/api/products");
  const value = await result.json();
  let panierLocal = JSON.parse(localStorage.getItem('panier'));
  for (element of panierLocal){
    for (item of value) {
      if (item._id == element._id ){
        totalPrice += item.price * element.quantity;
        totalQuantity += parseInt(element.quantity);
      }
    }
  }
  document.getElementById("totalPrice").textContent = totalPrice;
  document.getElementById("totalQuantity").textContent = totalQuantity;
}// ________________________________________________________________________





//  CONTROLE QUE LA COULEUR ET LA QUANTITE ONT BIEN ETE INDIQUE
const control = (item) => {
  console.log("quantity", item.quantity);
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



















const itemFinder = async () => {
  const result = await fetch("http://localhost:3000/api/products");
  const value = await result.json();
  let panierLocal = JSON.parse(localStorage.getItem('panier'));
  for (let item of value) { //on parcourt la base de donnee json
    let i = 0;   
    for (let element of panierLocal){ //parcourt du local panier
      if (item._id == panierLocal[i]._id ){
        item.push();
        return item;
      }
    }
  }
}
*/