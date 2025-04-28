/*
  ///////////////////////////////////////////////

  Profile Dropdown
 
  ///////////////////////////////////////////////
*/

const profile__menu = document.querySelector(".profile__menu");   //ret: first element having class 'profile__menu' (menu element in 'cart.ejs' page)
const profileBtn = document.getElementById("profileBtn");   //ret: first element having id 'profileBtn' (button element in same page)

/*
  -----------------------------------------------
  Event Handlers
  -----------------------------------------------
*/

//Toggle the DropDown Menu and Scale the ProfieBtn
function toggleProfileDropdown(event) {   //profile_btn, dropMenu: toggle hover,scale
     //element.class
  event.target.classList.toggle("icon-hover");            //hover: Toggle scale the CSS 'icon-hover'cls for only profileBtn (target ele)
  event.target.classList.toggle("icon-active");           //onclick: Sudden scale the CSS 'profileBtn'cls for only profileBtn (target ele)
  profile__menu.classList.toggle("profile__menu-active"); //Toggle the dropdown menu for profileBtn
}
/**event → The object was created at click

  *event.target → ~=ELEMENT that was clicked (triggered the event).

  *classList → A built-in object that allows add/remove/toggle classes on an element. 
  
  *Ex 'icon-hover': init+Eff_in_CSS,  mentioned_in_HTML+JS
  */

//Closes Profile Dropdown Menu
function closeProfileDropdown(event) {
  if (event.target.id != "profileBtn") {  //if clicked anywhere remove dmenu
    if (profile__menu.classList.contains("profile__menu-active")) {
      profileBtn.classList.remove("icon-active");
      profileBtn.classList.toggle("icon-hover");
      profile__menu.classList.remove("profile__menu-active");
    }
  }
}

/*
  -----------------------------------------------
  Event Listeners
  -----------------------------------------------
*/

//Adding Click Event on ProfileBtn
profileBtn.addEventListener("click", toggleProfileDropdown);

// Adding Click Event on Document to Close Profile Dropdown
document.addEventListener("click", closeProfileDropdown);

/*
  ///////////////////////////////////////////////

  Functions for  Increase, Decrease or Delete CART Item Quantity
 
  ///////////////////////////////////////////////
*/

const decBtns = document.querySelectorAll(".dec");  //ret: all elements having class 'dec' (decrement button in 'cart.ejs' page)
const incBtns = document.querySelectorAll(".inc");
const removeBtns = document.querySelectorAll(".remove__item");

/*
  -----------------------------------------------
  Patch Cart Request or Update Quantity
  -----------------------------------------------
*/
async function patchCart(id, newQty) {
  const url = `cart/${id}`;
  const response = await fetch(url, {   //fetch: make an HTTP request,  It sends the request to cart/id
    method: "PATCH",        // request Type -> PATCH: update part resource

    headers: {              // request metadata's
      "Content-Type": "application/json", // type=json (of content being sent)
    },

    // The content to update
    body: JSON.stringify({  // request data -> stringify: convert JS object to JSON string
      qty: newQty,
    }),
  });
  location.reload();    // reload the page to imm upd the changes in cart visually
}

/*
  -----------------------------------------------
  Delete Cart Request or Delete Item
  -----------------------------------------------
*/
async function deleteCart(id) {
  const url = `cart/${id}`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    // The content to update
    body: JSON.stringify({}), //No Body Or Payload
  });
  location.reload();
}

/*
  -----------------------------------------------
  Event Handlers
  -----------------------------------------------
*/

//Decrease Quantity
function decQty(event) {
  let itemId = null;
  let currentQty = null;

  const btn = event.target;
  const children = btn.parentElement.children;  //siblings ele of btn

  //Converting HTML Collection to Array for Using forEach
  Array.from(children).forEach((element) => {   // array= all ele siblings of btn
    if (element.id == "itemId") {   // get itemId ele value
      itemId = element.value;
    }
    if (element.id == "qty") {      // INC qty ele value
      currentQty = +element.value;
    }
  });
  const newQty = currentQty - 1;
  if (newQty == 0) {
    deleteCart(itemId);    //delete item
  } else {
    patchCart(itemId, newQty); //patch decrease item
  }
}

//Increase Quantity
function incQty(event) {
  let itemId = null;
  let currentQty = null;

  const btn = event.target;
  const children = btn.parentElement.children;

  //Converting HTML Collection to Array for Using forEach
  Array.from(children).forEach((element) => {
    if (element.id == "itemId") {
      itemId = element.value;
    }
    if (element.id == "qty") {
      currentQty = +element.value;
    }
  });
  const newQty = currentQty + 1;
  patchCart(itemId, newQty);  //patch increase item
}

//Remove Item
function removeItem(event) {
  let itemId = null;

  const btn = event.target;
  const children = btn.parentElement.parentElement.children;

  //Converting HTML Collection to Array for Using forEach
  Array.from(children).forEach((element) => {
    if (element.id == "itemId") {
      itemId = element.value;
    }
  });
  deleteCart(itemId);  //delete Item directly
}

/*
  -----------------------------------------------
  Event Listeners
  -----------------------------------------------
*/

//Adding Click Event on Decrement Button        //ret: all elements having class 'dec' (decrement button in 'cart.ejs' page)
decBtns.forEach((btn) => {
  btn.addEventListener("click", decQty);
});

//Adding Click Event on Increment Button
incBtns.forEach((btn) => {
  btn.addEventListener("click", incQty);
});

//Adding Click Event on Remove Button
removeBtns.forEach((btn) => {
  btn.addEventListener("click", removeItem);
});

/*
  ///////////////////////////////////////////////

  Functions to Edit and Patch DELIVERY ADDRESS
 
  ///////////////////////////////////////////////
*/

let addressInput = document.getElementById("newAddress");
let updateBtn = document.getElementById("updateBtn");     // made inside the new HTML of addressContainer
let editBtn = document.getElementById("editBtn");
let addressContainer = document.getElementById("addressContainer");
let proceedContainer = document.getElementById("proceedContainer");

function getvariables() {   //refresh
  addressInput = document.getElementById("newAddress");   //duplicate assign: in case the page changed dynamically (content upd and new ele appeared).
  updateBtn = document.getElementById("updateBtn");
  // const editBtn = document.getElementById("editBtn");
  // const addressContainer = document.getElementById("addressContainer");
}

/*
  -----------------------------------------------
  Patch Address Request or Update Address
  -----------------------------------------------
*/
async function patchAddress(newAddress) {
  const url = "/user/u/address";
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    // The content to update
    body: JSON.stringify({
      newValue: newAddress,
    }),
  });
  location.reload();
}

/*
  -----------------------------------------------
  Event Handlers
  -----------------------------------------------
*/

//Update ADDRESS
function updateAddress() {     //send modified addr
  const newAddress = addressInput.value;
  patchAddress(newAddress);
}

//Edit Address
function editAddress() {
  addressContainer.innerHTML = `<input type="text" id="newAddress" name="address" class="address__input" placeholder="Enter your address" spellcheck="false">
  <button class="update__btn" id="updateBtn">Update</button>`;    // insert this childrens to the parent
  proceedContainer.innerHTML = `<input type="button" class="proceed__btn" title="Please update your address before placing order." value="Place Order&#9205;">`;
  getvariables(); //Getting Update button and addressInput again b'coz there isn't before
  updateBtn.addEventListener("click", updateAddress);   //adds an event listener to the new updateBtn that was just created
}
/**
 * Before .innerHTML modification:
      If the user has a saved address (entered before), it’s displayed as a paragraph + edit button.
      If no address is saved, an input field for a new address is shown only

 *After .innerHTML modification (in editAddress()):
      The address section turns into an input field + update button 
 */

/*
  -----------------------------------------------
  Event Listeners
  -----------------------------------------------
*/

//Adding Click Event on Update Button
if (updateBtn) {
  updateBtn.addEventListener("click", updateAddress);
}

//Adding Click Event on Edit Button
if (editBtn) {
  editBtn.addEventListener("click", editAddress);
}

/*
  ///////////////////////////////////////////////

  Functions to Post/Place Order, Clear Cart and Order Placed Popup

  ///////////////////////////////////////////////
*/

const itemName = document.getElementById("itemName").value.split(",");
const itemServe = document.getElementById("itemServe").value.split(",");
const itemQty = document.getElementById("itemQty").value.split(",");
const itemPrice = document.getElementById("itemPrice").value.split(",");
const subTotal = document.getElementById("subTotal").value;
const tax = document.getElementById("tax").value;
const deliveryCharge = document.getElementById("deliveryCharge").value;
const grandTotal = document.getElementById("grandTotal").value;

const placeOrderBtn = document.getElementById("placeOrderBtn");
const popup = document.getElementById("popup");
const overlay = document.getElementById("overlay");

/*
  -----------------------------------------------
  Popup Handler
  -----------------------------------------------
*/

function popupActive() {  //show end popup msg
  popup.classList.add("active");      // add(): add cls'active' to cls'popup' (.popup -> .popup.active)
  overlay.classList.add("active");    // overlay: add cls'active' to cls'overlay' (.overlay -> .overlay.active)
  return;
}
//.active is NOT pre-defined in css

/*
  -----------------------------------------------
  Clear Cart Request
  -----------------------------------------------
*/
async function clearCart(orderId) {    // remove whole cart after btn'placeOrder' clicked
  const url = `/cart/clear/all`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    // The content to update
    body: JSON.stringify({
      orderId: orderId,
    }),
  });
  popupActive();
  const reloadPage = setTimeout(() => {
    location.reload();  //showing the updated state (empty cart)
  }, 2200);   // do reload after 2.2 sec (time for popup to show)
}

/*
  -----------------------------------------------
  Post Order Request or Place Order
  -----------------------------------------------
*/
async function postOrder(items, bill) {
  const url = `/orders/new`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // The content to update
    body: JSON.stringify({
      items: items,
      bill: bill,
    }),
  });
  const order = await response.json();
  clearCart(order._id);
}

/*
  -----------------------------------------------
  Event Handlers
  -----------------------------------------------
*/

//Edit Address
//make oreder -> send order
//placeOrder() -> postOrder()    ( -> clearCart() -> popupActive() -> reloadPage)
// function placeOrder() {
//   let items = [];
//   for (let i = 0; i < itemName.length; i++) {
//     items.push({
//       itemName: itemName[i],
//       itemServe: itemServe[i],
//       itemQty: itemQty[i],
//       itemPrice: itemPrice[i],
//     });
//   }
//   const bill = { subTotal, tax, deliveryCharge, grandTotal };
//   // console.log(items.json());
//   postOrder(items, bill);
// }

/*
  -----------------------------------------------
  Event Listeners
  -----------------------------------------------
*/

//Adding Click Event on placeOrderBtn Button
// placeOrderBtn.addEventListener("click", placeOrder);
