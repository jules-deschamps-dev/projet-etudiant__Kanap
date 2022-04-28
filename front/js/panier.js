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
  document.getElementById("order").setAttribute("onclick", "postForm()")
  let parent = document.getElementById("cart__items");
  let panierLocal = JSON.parse(window.localStorage.getItem("panier"));

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
  let controlForm = 0;
  let controlCart = document.getElementById("totalQuantity").textContent;
  event.preventDefault();
  let contact = new Object;
  for (element of document.getElementsByTagName("input")){
    if (element.type != "submit" && element.type != "number"){
      controlForm += manageForm(element);    //controle le format des donnees du formulaire  //do not remove
      contact[element.name] = element.value;  //do not remove
    }
  }
  let products = getAllId();  //recupere les id des products //do not remove



  console.log(typeof contact.firstName, typeof contact.lastName, typeof contact.email, typeof contact.address, typeof contact.city);
  console.log(typeof products[0])
  console.log("products", products);
  console.log("contact", contact);


  let data = {
    contact : contact,
    products : products
  }

  console.log(controlForm)
  if (controlForm == 0 && controlCart > 0){
    fetch(
      "http://localhost:3000/api/products/order", {
      method: "POST",
      body : JSON.stringify(
        data
      ),
      headers : {
        'Content-Type': "application/json",
        'Accept' : 'application/json'
      }
    })
    .then( (res) => {
      console.log(res);
      return res.json();
    })
    .then( (data) => {
      console.log(data);
      document.location.href="confirmation.html?order=" + data.orderId; 
    });
  } else if (controlForm > 0 && controlCart > 0){
      alert("Le formulaire contient des erreurs");
  } else if (controlCart == 0 && controlCart < 1){
      alert("Votre panier est vide");
  }
}


const getAllId = () => {
  let panier = JSON.parse(window.localStorage.panier);
  let allId = new Array();
  for (element of panier){
    allId.push(element._id);
  }
  return allId;
}


const manageForm = (element) => {
  let control = 0;
  if (element.name == 'firstName' || element.name == "lastName"){
    if (! element.value.match(/^([a-zA-Z ]+)$/)){
      document.getElementById(String(element.name + "ErrorMsg")).textContent = "Veillez saisir une donnée valide";
      control++;
    } else{
      document.getElementById(String(element.name + "ErrorMsg")).textContent = null;
    }
  }
  else if (element.name == 'email'){
    if (! element.value.match(/^\S+@\S+\.\S+$/)){
      document.getElementById(String(element.name + "ErrorMsg")).textContent = "Veillez saisir une donnée valide";
      control++;
    } else{
      document.getElementById(String(element.name + "ErrorMsg")).textContent = null;
    }
  }
  else if (element.name == 'address'){
    if (! element.value.match(/^[a-zA-Z0-9]{3,80}$/)){
    document.getElementById(String(element.name + "ErrorMsg")).textContent = "Veillez saisir une donnée valide";
    control++;
  } else{
    document.getElementById(String(element.name + "ErrorMsg")).textContent = null;
  }
    
  }
  else if (element.name == 'city'){
    if (! element.value.match(/^([a-zA-Z ]+)$/)){
      document.getElementById(String(element.name + "ErrorMsg")).textContent = "Veillez saisir une donnée valide";
      control++;
    } else{
      document.getElementById(String(element.name + "ErrorMsg")).textContent = null;
    }
  }
  console.log(control);
  return control;
}
// ________________________________________________________________________


// GESTION DES ITEMS
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
  let cart = JSON.parse(window.localStorage.panier);
  return cart;
}

const saveCart = (cart) => {
  window.localStorage.setItem("panier", JSON.stringify(cart));
  total();
}
// ________________________________________________________________________


//  CALCUL DU TOTAL
const total = async () => {
  let totalPrice = 0;
  let totalQuantity = 0;
  let panierLocal = JSON.parse(window.localStorage.getItem('panier'));
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
}
// ________________________________________________________________________
