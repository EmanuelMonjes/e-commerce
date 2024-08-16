document.addEventListener("DOMContentLoaded", () => {
    async function fetchProducts() {
      try {
        const response = await fetch("http://localhost:8080/api/products");
        const products = await response.json();
        products.forEach((product) => {
          console.log(product);
          const productsContainer = document.getElementById("products-container");
          productsContainer.innerHTML = "";
          products.forEach((product) => {
            const productCard = document.createElement("div");
            productCard.className = "product-card";
  
            const productImage = document.createElement("img");
            productImage.src = product.thumbnails[0] || "https://via.placeholder.com/250";
            productImage.alt = product.title;
            productCard.appendChild(productImage);
  
            const productTitle = document.createElement("h2");
            productTitle.textContent = product.title;
            productCard.appendChild(productTitle);
  
            const productDescription = document.createElement("p");
            productDescription.textContent = product.description;
            productCard.appendChild(productDescription);
  
            const productPrice = document.createElement("p");
            productPrice.className = "price";
            productPrice.textContent = `$${product.price}`;
            productCard.appendChild(productPrice);
  
            productsContainer.appendChild(productCard);
          });
        });
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
  
    fetchProducts();
  });