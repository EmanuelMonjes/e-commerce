document.addEventListener("DOMContentLoaded", () => {
  checkCart();
  fetchProducts();
});

async function fetchProducts(URI = "http://localhost:3000/api/products") {
  try {
    const response = await fetch(URI);
    const data = await response.json();
    console.log(data);

    const products = data.payload;
    const cartId = localStorage.getItem("cartId");

    const productsContainer = document.getElementById("products-container");
    productsContainer.innerHTML = "";

    const productsHTML = products
      .map((product) => `
        <div class="product-card">
          <img src="${product.thumbnails[0] || "https://via.placeholder.com/250"}" alt="${product.title}">
          <h2>${product.title}</h2>
          <p>${product.description}</p>
          <p class="price">$${product.price}</p>
          <button class="add-to-cart-button" onclick="addToCart('${cartId}', '${product._id}')">Agregar al carrito</button>
        </div>
      `).join("");

    productsContainer.innerHTML = productsHTML;

    const paginationContainer = document.getElementById("pagination-container");
    paginationContainer.innerHTML = "";

    const prevButton = document.createElement("a");
    prevButton.href = "#";
    prevButton.innerHTML = "&laquo; Previous";
    data.prevLink
      ? prevButton.addEventListener("click", () => fetchProducts(data.prevLink))
      : prevButton.classList.add("disabled");

    paginationContainer.appendChild(prevButton);

    const pageNumber = document.createElement("span");
    pageNumber.innerText = data.page;
    pageNumber.classList.add("page-number");
    paginationContainer.appendChild(pageNumber);

    const nextButton = document.createElement("a");
    nextButton.href = "#";
    nextButton.innerHTML = "Next &raquo;";
    data.nextLink
      ? nextButton.addEventListener("click", () => fetchProducts(data.nextLink))
      : nextButton.classList.add("disabled");

    paginationContainer.appendChild(nextButton);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

document.getElementById("add-product-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = document.getElementById("product-title").value;
  const description = document.getElementById("product-description").value;
  const code = document.getElementById("product-code").value;
  const price = parseFloat(document.getElementById("product-price").value);
  const stock = parseInt(document.getElementById("product-stock").value, 10);
  const category = document.getElementById("product-category").value;
  const thumbnail = document.getElementById("product-thumbnail").value;

  const newProduct = {
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails: thumbnail ? [thumbnail] : [],
  };

  try {
    const response = await fetch("http://localhost:3000/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    fetchProducts();
  } catch (error) {
    console.error("There was an error adding the product:", error);
  }

  event.target.reset();
});

async function checkCart() {
  const cartIdElement = document.querySelector("h3");

  let cartId = localStorage.getItem("cartId");

  if (!cartId) {
    try {
      const response = await fetch("http://localhost:3000/api/carts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        cartId = data._id; 
        localStorage.setItem("cartId", cartId);
      } else {
        console.error("Error al crear el carrito");
      }
    } catch (error) {
      console.error("Error en la solicitud de creación del carrito:", error);
    }
  }

  cartIdElement.innerHTML = `Cart ID: <a href='http://localhost:3000/api/carts/${cartId}'>${cartId}</a>`;
}

async function addToCart(cartId, productId) {
  try {
    const response = await fetch(`http://localhost:3000/api/carts/${cartId}/products/${productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      console.log(`Producto ${productId} agregado al carrito ${cartId}`);
    } else {
      console.error("Error al agregar el producto al carrito");
    }
  } catch (error) {
    console.error("Error en la solicitud de agregar al carrito:", error);
  }
}