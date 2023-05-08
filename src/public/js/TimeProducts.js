console.log("home js")
const socketClient = io();


socketClient.on("products", (products) => {});
socketClient.on("productAdded", (product) => {});
socketClient.on("productDeleted", (productId) => {});

// Obtener los datos del formulario de creación y enviarlos al servidor cuando se envíe el formulario
const createProductForm = document.getElementById("createProductForm");
createProductForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const code = document.getElementById("code").value;
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const product = { code, name, price };

  // Enviar el producto al servidor a través de websockets
  socketClient.emit("addProduct", product);
  // Limpiar el formulario después de enviar los datos
  createProductForm.reset();
});

// Obtener los datos del formulario de eliminación y enviarlos al servidor cuando se envíe el formulario
const deleteProductForm = document.getElementById("deleteProductForm");
deleteProductForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const productId = document.getElementById("productId").value;

  // Enviar el ID del producto al servidor a través de websockets para eliminarlo
  socketClient.emit("deleteProduct", productId);
  // Limpiar el formulario después de enviar los datos
  deleteProductForm.reset();
});

// Escuchar el evento "products" para recibir los productos actualizados del servidor
socketClient.on("products", (products) => {
  // Actualizar la vista con los productos recibidos
  const productsContainer = document.getElementById("productsContainer");
  productsContainer.innerHTML = "";

  products.forEach((product) => {
    const productElement = document.createElement("div");
    productElement.innerHTML = `<p>ID: ${product.id}</p><p>Código: ${product.code}</p><p>Nombre: ${product.name}</p><p>Precio: ${product.price}</p>`;
    productsContainer.appendChild(productElement);
  });
});

// Escuchar el evento "productAdded" para recibir la confirmación de que se agregó un nuevo producto
socketClient.on("productAdded", (product) => {
  // Actualizar la vista con el nuevo producto agregado
  const productsContainer = document.getElementById("productsContainer");
  const productElement = document.createElement("div");
  productElement.innerHTML = `<p>ID: ${product.id}</p><p>Código: ${product.code}</p><p>Nombre: ${product.name}</p><p>Precio: ${product.price}</p>`;
  productsContainer.appendChild(productElement);
});

// Escuchar el evento "productDeleted" para recibir la confirmación de que se eliminó un producto
socketClient.on("productDeleted", (productId) => {
  // Actualizar la vista para reflejar la eliminación del producto con el ID recibido
  const productsContainer = document.getElementById("productsContainer");
  const productElement = Array.from(productsContainer.children).find((element) => {
    return element.querySelector("p#id").textContent === productId;
  });
  if (productElement) {
    productElement.remove();
  }
});
 
