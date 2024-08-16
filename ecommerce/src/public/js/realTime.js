document.addEventListener("DOMContentLoaded", () => {
    const socket = io();
  
    socket.on("products", (products) => {
      console.log(products);
      const productsContainer = document.getElementById("products-container");
      productsContainer.innerHTML = "";
      products.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";
  
        const productImage = document.createElement("img");
        productImage.src =
          product.thumbnails[0] || "https://via.placeholder.com/250";
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
  
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => deleteProduct(product.id);
        productCard.appendChild(deleteButton);
  
        productsContainer.appendChild(productCard);
      });
    });
  
    function deleteProduct(productId) {
      socket.emit("deleteProduct", productId);
    }
  
    document.getElementById("add-product-form").addEventListener("submit", (event) => {
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
  
      socket.emit("addProduct", newProduct);
  
      event.target.reset();
    });
  });