const cartdrawer = document.getElementById('cart_drawer');
const overlay = document.getElementById('overlay');
const closeCartDrawer = document.getElementById('closeCartDrawer');
const cartToggleBtn = document.getElementById('cartToggleBtn');
const cartItems = document.getElementById('cartItems');
let cartlist = [];

// Api url
const apiUrl = 'https://mocki.io/v1/539c3a78-25e4-4fc6-8b35-6f1550d2b7c6';

// open drawer event //
cartToggleBtn.addEventListener('click', () => {
  cartdrawer.style.display = "block";
  overlay.style.display = "block";
});


// close drawer event //
closeCartDrawer.addEventListener('click', () => {
  cartdrawer.style.display = "none"
  overlay.style.display = "none"
});


// Fetch data function //
const fetchData = async () => {

  const container = document.getElementById('itemsLikelists');
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    resdata = data
    data.forEach((item) => {

      // creating element for related content
      const postDiv = document.createElement('div');
      postDiv.classList.add('itemsLikelist');

      
      postDiv.innerHTML =
        ` <div class="col2"><img src="http:${item.featured_image}"></div>
                    <div class="col5 itemsLikelistMiddle">
                        <div class="itemName">${item.title}</div>
                        <div class="itemsLikelistsPrice">
                            <span class="discountPrice">Rs ${item.price} /- </span>
                            <span class="actualPrice">Rs ${item.price_max} /-</span>
                        </div>
                       
                        <div class="size">
                            <ul>
                                <li class="active">S</li>
                                <li>M</li>
                                <li>L</li>
                                <li>XS</li>
                                <li>XL</li>
                            </ul>
                        </div>
                    </div>
                    <div class="col4 cartbtnSec">
                       <button class="cartbtn" id="cartbtn"><img src="img/mi_shopping-cart-add.png"></button>
                    </div>
                `;
      // Add click event for "Add to Cart" button
      postDiv.querySelector('.cartbtn').addEventListener('click', () => addCart(JSON.parse(JSON.stringify(item))));

      // Append to the container
      container.appendChild(postDiv);

      // Add to cart on load of data
      addCart(JSON.parse(JSON.stringify(item)));
    });
    // console.log('Data fetched:', data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Add to cart function
function addCart(item) {
  item.quantity = 1;
  cartlist.push(item);
  cartData(item)
  // console.log(item)
}



function cartData(item) {
  // creating cart item element
  const cartdiv = document.createElement('div');
  cartdiv.classList.add('itemsLikelist');
  cartdiv.innerHTML = `
        <div class="cartItem">
          <div class="cartItemimg col2"><img src="http:${item.featured_image}"></div>
          <div class="cartItemMiddle col3">
              <div class="itemName">${item.title}</div>
              <button class="delete"><img src="img/delete.png"></button>
          </div>
          <div class="cartItemlast col2">
              <p class="price">Rs ${item.price * item.quantity} /-</p>
              <div class="itemCountChnage"><button class="decrement">-</button><span class="quantity">${item.quantity}</span><button    class="increment">+</button></div>
          </div>
        </div>`
  cartItems.appendChild(cartdiv);


  /// buttons elements 
  const decrBtn = cartdiv.querySelector('.decrement');
  const increBtn = cartdiv.querySelector('.increment');
  const deleteBtn = cartdiv.querySelector('.delete');

  /// span elements
  const qtySpan = cartdiv.querySelector('.quantity');
  const priceSpan = cartdiv.querySelector('.price');


  // Add click event for "Add to Cart" button
  deleteBtn.addEventListener('click', () => {
    cartItems.removeChild(cartdiv);
    deleteCart(item, cartItems);

    updateCart();
  });

  // Add click event for "Decrement" button
  decrBtn.addEventListener('click', () => {
    if (item.quantity > 1) {
      item.quantity -= 1;
      qtySpan.textContent = item.quantity;
      priceSpan.textContent = `Rs ${item.price * item.quantity} /-`;
    } else {
      let clickEvent = new Event('click');
      deleteBtn.dispatchEvent(clickEvent)
    }

    // update cart after decrement of quantity
    updateCart();
  });


  // Add click event for "increment" button
  increBtn.addEventListener('click', () => {
    item.quantity += 1;
    qtySpan.textContent = item.quantity;
    priceSpan.textContent = `Rs ${item.price * item.quantity} /-`;

    // update cart after increment of quantity
    updateCart();
  });

  updateCart();
}

// delete item from cartlist array
function deleteCart(item, cartItems) {
  cartlist = cartlist.filter(cart => cart.id != item.id);
}


// funtion to update quantity and price in ui
function updateCart() {
  const cartHeader = cartdrawer.querySelector('.cart_drawer_header');
  const totalItems = cartHeader.querySelector('.cartCount');
  const totalPrice = cartHeader.querySelector('.cartsPrice');

  let items = cartlist.length;
  let price = cartlist.reduce((acc, cur) => {
    return acc += cur.price * cur.quantity;
  }, 0);

  totalItems.textContent = items + ' Items ';
  totalPrice.textContent = `Rs ${price} /-`;

  // update total amount and discount
  calculateFinalAmt(price);

}


// function to calculate the final price , discount and update the shipping bar
function calculateFinalAmt(price) {

  let finalDiscount = 0;

  // query selectors for total price and discount
  const totalSection = cartdrawer.querySelector('.totalSection');
  const discPrice = totalSection.querySelector('.discPrice');
  const totalPrice = totalSection.querySelector('.totalPrice');

  // query selectors for shipping bar
  const allCount = cartdrawer.querySelectorAll('.shippingCount');
  const firtsShip = cartdrawer.querySelector('.firstShip');
  const secondShip = cartdrawer.querySelector('.secondShip');

  // remove active class of shipping discount count
  allCount.forEach((item) => {
    item.classList.remove('shipingYes');
  });

  // condition to calculate final discount price and activate the shipping bar
  if (price > 40000) {
    secondShip.style.setProperty('--after-width', `140px`);
    firtsShip.style.setProperty('--after-width', `140px`);
    allCount.forEach((item, i) => {
      item.classList.add('shipingYes');
    })
    finalDiscount = (20 / 100) * price;

  } else if (price > 20000) {
    const pricePercent = price / 40000 * 100;
    const afterPx = (pricePercent / 100) * 140
    secondShip.style.setProperty('--after-width', `${afterPx}px`);
    firtsShip.style.setProperty('--after-width', `140px`);

    allCount.forEach((item, i) => {
      if (i <= 1) {
        item.classList.add('shipingYes');
      } else {
        item.classList.remove('shipingYes');
      }
    })
    finalDiscount = (10 / 100) * price;

  } else if (price > 5000) {
    const pricePercent = price / 20000 * 100;
    const afterPx = (pricePercent / 100) * 140;
    secondShip.style.setProperty('--after-width', `0px`);
    firtsShip.style.setProperty('--after-width', `${afterPx}px`);

    allCount.forEach((item, i) => {
      if (i == 0) {
        item.classList.add('shipingYes');
      } else {
        item.classList.remove('shipingYes');
      }
    });

  } else {
    secondShip.style.setProperty('--after-width', `0px`);
    firtsShip.style.setProperty('--after-width', `0px`);
  }

  // console.log(finalDiscount);

  discPrice.textContent = `Rs ${finalDiscount.toFixed(2)} /-`;
  totalPrice.textContent = `Rs ${(price - finalDiscount).toFixed(2)} /-`;

}


fetchData();
// cartData();
