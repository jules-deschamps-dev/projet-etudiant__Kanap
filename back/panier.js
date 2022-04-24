//import { post } from "./routes/product";

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



//  AFFICHE LES PRODUITS DANS LE PANIER
const cartSynthesis = async () => {
  document.getElementById("order").setAttribute("onmouseover", "postForm()")
  let parent = document.getElementById("cart__items");
  let panierLocal = JSON.parse(localStorage.getItem("panier"));

  for (element of panierLocal){
    const result = await fetch("http://localhost:3000/api/products/" + element._id);
    let item =  await result.json();
    let itemResume = newElement('article', {"class" : "cart__item", "data-id" : element._id, "data-color" : element.color}, null, parent);
    let itemImg = newElement('div', {"class" : "cart__item__img"}, null, itemResume);
    newElement('img', {"src" : item.imageUrl, "alt" : "Photographie d'un canapé"}, null, itemImg);
    
    let itemContent = newElement('div', {"class" : "cart__item__content"}, null, itemResume);
    let itemContent_describe = newElement('div', {"class" : "cart__item__content__description"}, null, itemContent);
    newElement("h2", null, item.name, itemContent_describe);
    newElement("p", null, element.color, itemContent_describe);
    newElement("p", null, item.price * element.quantity + ' €', itemContent_describe);
    
    let itemContent_parameter = newElement('div', {"class" : "cart__item__content__settings"}, null, itemContent);
    newElement('p', null, element.quantity, itemContent_parameter);
    newElement('input', {'type' : "number", 'class' : 'itemQuantity', 'min' : '1', 'max' : '100', 'value' : element.quantity, 'onclick' : 'changeQuantity()'}, null, itemContent_parameter)

    let itemContent_delete = newElement('div', {"class" : "cart__item__content__settings__delete"}, null, itemContent);
    newElement('p', {'class' : 'deleteItem', 'onclick' : 'removeItem()'}, 'Supprimer', itemContent_delete);
  }
  total();
}



//  FORMULAIRE //
const postForm = () => {
  //let contact = new Object;
  for (element of document.getElementsByTagName("input")){
    if (element.type != "submit" && element.type != "number"){
      //manageForm(element);    //controle le format des donnees du formulaire  //do not remove
      //contact[element.name] = element.value;  //do not remove
    }
  }
  //let products = getAllId();  //recupere les id des products //do not remove



  let contact = {
    firstName: "Jules",
    lastName: "Deschamps",
    address: "178address",
    city: "Nimes",
    email: "bbbbbb@aaaaa.com",
  }
  let products = ["dezfzesdf1"];

  console.log(typeof contact.firstName, typeof contact.lastName, typeof contact.email, typeof contact.address, typeof contact.city);
  console.log(typeof products[0])
  console.log("products", products);
  console.log("contact", contact);

  products = JSON.stringify(products);
  contact = JSON.stringify(contact)

 


  fetch(
    "http://localhost:3000/api/products/order", {
    'method': "POST",
    'body' : {
      "contact" : contact,
      "products" : products
    },
    'Headers' : {
      'Content-Type': "text/plain;charset=UTF-8",
      'Host': "localhost:3000"
    }
  });







   /*
  let data = {
    "contact" : contact,
    "products" : products,
  }
  console.log(typeof data);
  */
  /*
  let option = {
    'method': "POST",
    'body' : {
      "contact" : contact,
      "products" : products,
    },
    'Headers' : {"Content-Type" : "application/json"}
  }s
  */
  //
  
  //console.log(products)
  //console.log(data);
  //option = JSON.stringify(option);
}


const getAllId = () => {
  let panier = JSON.parse(localStorage.panier);
  let allId = new Array();
  for (element of panier){
    allId.push(element._id);
  }
  return allId;
}


const manageForm = (element) => {
  if (element.name == 'firstName' || element.name == "lastName"){
    if (! element.value.match(/^([a-zA-Z ]+)$/)){
      document.getElementById(String(element.name + "ErrorMsg")).textContent = "Veillez saisir une donnée valide";
      validateData = false;
    } else{
      document.getElementById(String(element.name + "ErrorMsg")).textContent = null;
      validateData = true;
    }
  }
}
// ________________________________________________________________________








const selectItem = () => {
  let target = event.target.closest("article");
  let id = target.dataset.id;
  let color = target.dataset.color;
  let data = {
    "target" : target,
    "id" : id,
    "color" : color
  }
  return data;
}

const changeQuantity = () =>{
  let cart = getCart();
  let data = selectItem();
  let newQuantity = event.target.closest("div").childNodes[1].value;
  cart.filter(element => element._id == data.id || element.color == data.color)[0].quantity = newQuantity;
  let newQuantityPrint = event.target.closest("div").childNodes[0];
  newQuantityPrint.textContent = newQuantity;
  saveCart(cart);
}

const removeItem = () =>{
  let cart = getCart();
  let data = selectItem();
  data.target.remove();
  let result = cart.filter(element => element._id != data.id || element.color != data.color);
  saveCart(result);
}

const getCart = () => {
  let cart = JSON.parse(localStorage.panier);
  return cart;
}

const saveCart = (cart) => {
  localStorage.setItem("panier", JSON.stringify(cart));
  total();
}

//  CALCUL DU TOTAL
const total = async () => {
  let totalPrice = 0;
  let totalQuantity = 0;
  let panierLocal = JSON.parse(localStorage.getItem('panier'));
  for (element of panierLocal){
    const result = await fetch("http://localhost:3000/api/products/" + element._id);
    let item =  await result.json();
    if (item._id == element._id ){
      totalPrice += item.price * element.quantity;
      totalQuantity += parseInt(element.quantity);
    }
  }
  
  document.getElementById("totalPrice").textContent = totalPrice;
  document.getElementById("totalQuantity").textContent = totalQuantity;
}// ________________________________________________________________________
