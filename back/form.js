




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
