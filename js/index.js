const btnCart = document.querySelector('.container-cart-icon');
const containerCartProducts = document.querySelector('.container-cart-products');
const productsList = document.querySelector('.container-items');
const rowProduct = document.querySelector('.row-product');
const valorTotal = document.querySelector('.total-pagar');
const countProducts = document.querySelector('#contador-productos');
const cartEmpty = document.querySelector('.cart-empty');
const cartTotal = document.querySelector('.cart-total');

let allProducts = [];

// localStorage 
window.addEventListener('load', () => {
  const storedProducts = JSON.parse(localStorage.getItem('cartProducts')) || [];
  allProducts = storedProducts;
  showHTML();
});

btnCart.addEventListener('click', () => {
  containerCartProducts.classList.toggle('hidden-cart');
});

async function obtenerProductos() {
  try {

    const response = await fetch('datos.json')
    const data = await response.json()
    allProducts.push(...data.productos)
    cargarProductos(allProducts)

  } catch (error) {
    console.error('Error al cargar productos:', error);
  }
}

obtenerProductos()


productsList.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-add-cart')) {
    const product = e.target.parentElement;
    const infoProduct = {
      quantity: 1,
      title: product.querySelector('h2').textContent,
      price: product.querySelector('p').textContent,
    };

    const exists = allProducts.some((product) => product.title === infoProduct.title);

    if (exists) {
      const products = allProducts.map((product) => {
        if (product.title === infoProduct.title) {
          product.quantity++;
        }
        return product;
      });
      allProducts = [...products];
      showToast('Cantidad del producto actualizada');
    } else {
      allProducts = [...allProducts, infoProduct];
      showToast('Producto añadido al carrito');
    }


    localStorage.setItem('cartProducts', JSON.stringify(allProducts));

    showHTML();
  }
});

rowProduct.addEventListener('click', (e) => {
  if (e.target.classList.contains('icon-close')) {
    const product = e.target.parentElement;
    const title = product.querySelector('p').textContent;

    allProducts = allProducts.filter((product) => product.title !== title);


    localStorage.setItem('cartProducts', JSON.stringify(allProducts));

    showToast('Producto eliminado del carrito');
    showHTML();
  }
});

const showHTML = () => {
  if (!allProducts.length) {
    cartEmpty.classList.remove('hidden');
    rowProduct.classList.add('hidden');
    cartTotal.classList.add('hidden');
  } else {
    cartEmpty.classList.add('hidden');
    rowProduct.classList.remove('hidden');
    cartTotal.classList.remove('hidden');
  }

  rowProduct.innerHTML = '';

  let total = 0;
  let totalOfProducts = 0;

  allProducts.forEach((product) => {
    const containerProduct = document.createElement('div');
    containerProduct.classList.add('cart-product');

    const priceNumeric = parseFloat(product.price.replace('€', '').trim());

    containerProduct.innerHTML = `
        <div class="info-cart-product">
          <span class="cantidad-producto-carrito">${product.quantity}</span>
          <p class="titulo-producto-carrito">${product.title}</p>
          <span class="precio-producto-carrito">${product.price}</span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="icon-close"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      `;

    rowProduct.append(containerProduct);

    total = total + parseFloat(product.quantity * priceNumeric);
    totalOfProducts = totalOfProducts + product.quantity;
  });

  valorTotal.innerText = `€${total}`;
  countProducts.innerText = totalOfProducts;
};

function showToast(message) {
  Toastify({
    text: message,
    duration: 3000,
    gravity: 'bottom',
    position: 'right',
    backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)',
    stopOnFocus: true,
  }).showToast();
}


const btnComprar = document.querySelector('.btn-comprar');

btnComprar.addEventListener('click', () => {
  if (allProducts.length > 0) {

    console.log('Procesando la compra:', allProducts);
    showToast('Compra realizada con éxito');
  } else {
    showToast('El carrito está vacío. Añade productos antes de comprar.');
  }
});

