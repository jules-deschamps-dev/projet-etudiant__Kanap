const getOrder = () => {
  let parameter = new URLSearchParams(document.location.search);
  return parameter.get('order');
}// ________________________________________________________________________

const printOrder = () => {
  document.getElementById('orderId').textContent = getOrder();
}