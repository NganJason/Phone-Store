import React, { useState, useEffect } from "react";
import { storeProducts, detailProduct } from "./data";

const ProductContext = React.createContext();

function ProductProvider(props) {
  const [productObjects, setProductObjects] = useState({
    products: storeProducts,
    detailProduct: detailProduct,
    cart: [],
    modalOpen: false,
    modalProduct: detailProduct,
    cartSubtotal: 0,
    cartTax: 0,
    cartTotal: 0,
    cartClear: 1,
  });

  useEffect(() => {
    setProducts();
  }, []);

  useEffect(() => {
    addTotal();
    console.log(productObjects.cartTotal);
  }, [productObjects.cart]);

  function setProducts() {
    let tempProducts = [];

    storeProducts.forEach((item) => {
      const singleItem = { ...item };
      tempProducts = [...tempProducts, singleItem];
    });

    let tempProductObjects = {
      ...productObjects,
      products: tempProducts,
    };

    setProductObjects(tempProductObjects);
  }

  function addToCart(id) {
    let tempProducts = [];
    productObjects.products.forEach((item) => {
      const singleItem = { ...item };
      tempProducts = [...tempProducts, singleItem];
    });
    const product = tempProducts.find((item) => item.id === id);
    product.total = product.price;
    product.inCart = true;
    product.count = 1;
    let carts = [...productObjects.cart, product];
    setProductObjects({
      ...productObjects,
      products: tempProducts,
      cart: carts,
      modalProduct: product,
      modalOpen: true,
    });
  }

  // function openModal(id) {
  //   const product = getItem(id);
  //   setProductObjects({
  //     ...productObjects,
  //     modalProduct: product,
  //     modalOpen: true,
  //   });
  // }

  function closeModal() {
    setProductObjects({ ...productObjects, modalOpen: false });
  }

  function getItem(id) {
    const product = productObjects.products.find((item) => item.id === id);
    return product;
  }

  function handleDetail(id) {
    const product = getItem(id);
    setProductObjects({ ...productObjects, detailProduct: product });
  }

  function increment(id) {
    let tempCart = [...productObjects.cart];
    let incrementProduct = tempCart.find((item) => item.id === id);
    incrementProduct.count = incrementProduct.count + 1;
    incrementProduct.total = incrementProduct.price * incrementProduct.count;
    setProductObjects({
      ...productObjects,
      cart: tempCart,
    });
  }

  function decrement(id) {
    let tempCart = [...productObjects.cart];
    let incrementProduct = tempCart.find((item) => item.id === id);
    incrementProduct.count = incrementProduct.count - 1;
    if (incrementProduct.count === 0) {
      removeItem(id);
    } else {
      incrementProduct.total = incrementProduct.price * incrementProduct.count;
      setProductObjects({
        ...productObjects,
        cart: tempCart,
      });
    }
  }

  function removeItem(id) {
    let tempProducts = [...productObjects.products];
    let tempCart = [...productObjects.cart];
    tempCart = tempCart.filter((item) => item.id !== id);

    let removedProduct = tempProducts.find((item) => item.id === id);
    removedProduct.inCart = false;
    removedProduct.count = 0;
    removedProduct.total = 0;

    setProductObjects({
      ...productObjects,
      products: tempProducts,
      cart: tempCart,
    });
  }

  function clearCart(id) {
    let tempProducts = [];

    storeProducts.forEach((item) => {
      const singleItem = { ...item };
      tempProducts = [...tempProducts, singleItem];
    });

    let tempProductObjects = {
      ...productObjects,
      products: tempProducts,
      cart: [],
    };
    setProductObjects(tempProductObjects);
  }

  function addTotal() {
    let subTotal = 0;
    productObjects.cart.map((item) => {
      subTotal += item.total;
    });

    const tempTax = subTotal * 0.1;
    const tax = parseFloat(tempTax.toFixed(2));
    const total = subTotal + tax;
    setProductObjects({
      ...productObjects,
      cartSubtotal: subTotal,
      cartTax: tax,
      cartTotal: total,
    });
  }
  return (
    <ProductContext.Provider
      value={{
        ...productObjects,
        handleDetail: handleDetail,
        addToCart: addToCart,
        closeModal: closeModal,
        increment: increment,
        decrement: decrement,
        removeItem: removeItem,
        clearCart: clearCart,
      }}
    >
      {props.children}
    </ProductContext.Provider>
  );
}

const ProductConsumer = ProductContext.Consumer;

export { ProductProvider, ProductConsumer };
