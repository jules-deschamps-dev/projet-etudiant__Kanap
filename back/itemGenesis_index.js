

  //PAGE INDEX 
  // - - - - -


newElement();

const __itemGenesis_index = async (localisation) => {
  const result = await fetch("http://localhost:3000/api/products");
  const value = await result.json();
  let parent = document.getElementById("items");

  for (let element of value){
    let itemLink = newElement('a', {"href" : "product.html?id=" + element._id}, null, parent);
    let itemArticle = newElement('article', null, null, itemLink);
    newElement('img', {"src" : element.imageUrl, "alt" : element.altTxt}, null, itemArticle);
    newElement("h3", null, element.name, itemArticle);
    newElement("p", null, element.description, itemArticle);
  }
}