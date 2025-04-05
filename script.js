document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  setupCart();
});

// Завантаження товарів з JSON
async function loadProducts() {
  try {
      const response = await fetch("products.json");
      const products = await response.json();
      displayProducts(products);
  } catch (error) {
      console.error("Помилка завантаження товарів:", error);
  }
}

// Відображення товарів
function displayProducts(products) {
  const productsContainer = document.getElementById("products");
  productsContainer.innerHTML = "";

  products.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");

      productCard.innerHTML = `
          <img src="${product.image}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <p><strong>${product.price} грн</strong></p>
          <button class="add-to-cart" data-id="${product.id}">Додати в кошик</button>
      `;

      productsContainer.appendChild(productCard);
  });

  // Додавання товарів у кошик
  document.querySelectorAll(".add-to-cart").forEach((button) => {
      button.addEventListener("click", (event) => {
          const productId = event.target.dataset.id;
          addToCart(productId, products);
      });
  });
}

// Кошик
let cart = [];

// Завантаження кошика з localStorage
function setupCart() {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
      cart = JSON.parse(savedCart);
  }
  updateCartCount();
}

// Додавання в кошик
function addToCart(productId, products) {
  const product = products.find((p) => p.id == productId);
  if (!product) return;

  const existingProduct = cart.find((p) => p.id == productId);
  if (existingProduct) {
      existingProduct.quantity += 1;
  } else {
      cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// Оновлення лічильника кошика
function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
}

// Відкриття кошика
document.getElementById("cart-btn").addEventListener("click", openCart);

function openCart() {
  const cartModal = document.getElementById("cart-modal");
  const cartItemsContainer = document.getElementById("cart-items");
  const totalPriceContainer = document.getElementById("total-price");

  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p>Кошик порожній</p>";
  } else {
      cart.forEach((item) => {
          // Перевірка значень перед відображенням
          const price = item.price || 0; // Якщо ціна не визначена, використовуємо 0
          const quantity = item.quantity || 1; // Якщо кількість не визначена, використовуємо 1
          const totalPrice = price * quantity;

          const cartItem = document.createElement("li");
          cartItem.innerHTML = `
              <img src="${item.image}" alt="${item.name}" class="cart-img">
              <div>
                  <p><strong>${item.name}</strong></p>
                  <p>${item.description || "Опис відсутній"}</p>
                  <p>${price} грн x ${quantity} = ${totalPrice} грн</p>
                  <button class="remove-item" data-id="${item.id}">❌</button>
              </div>
          `;
          cartItemsContainer.appendChild(cartItem);
      });

      document.querySelectorAll(".remove-item").forEach((button) => {
          button.addEventListener("click", (event) => {
              removeFromCart(event.target.dataset.id);
          });
      });

      updateCartTotal(); // Оновлення загальної суми після оновлення кошика
  }

  cartModal.style.display = "block";
}

// Оновлення загальної суми в кошику
function updateCartTotal() {
  const totalPriceContainer = document.getElementById("total-price");

  // Враховуємо ціни та кількість для кожного елемента
  const total = cart.reduce((sum, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 1;
      return sum + price * quantity;
  }, 0);

  totalPriceContainer.textContent = `Загальна сума: ${total} грн`;
}

// Видалення з кошика
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id != productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  openCart();
}

// Закриття модального вікна
document.getElementById("close-cart").addEventListener("click", () => {
  document.getElementById("cart-modal").style.display = "none";
});

// Фільтрація товарів
document.getElementById("apply-filters").addEventListener("click", applyFilters);

function applyFilters() {
  const categoryFilter = document.getElementById("category-filter").value;
  const minPrice = parseFloat(document.getElementById("min-price").value) || 0;
  const maxPrice = parseFloat(document.getElementById("max-price").value) || Infinity;

  const filteredProducts = products.filter((product) => {
      const isCategoryMatch = categoryFilter === "all" || product.category === categoryFilter;
      const isPriceInRange = product.price >= minPrice && product.price <= maxPrice;

      return isCategoryMatch && isPriceInRange;
  });

  displayProducts(filteredProducts);
}

