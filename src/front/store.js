const cartFromStorage = JSON.parse(localStorage.getItem("cart")) || [];

const normalizedCart = cartFromStorage.map(item => ({
  ...item,
  quantity: item.quantity || 1
}));

export const initialStore = () => {
  return {
    /* WE USE LOCALSTORAGE TO SAVE THE TOKEN AND USEFUL STUFF */
    auth: !!localStorage.getItem("token"),
    user: JSON.parse(localStorage.getItem("user")) || null,
    message: null,
    products: [],
    subscriptionPlans: [],
    cart: normalizedCart,
    sub: false
  }
}

export default function storeReducer(store, action = {}) {
  switch (action.type) {

    case "setProfileImage": {
      const updatedUser = {
        ...store.user,
        profile_image: action.payload
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      return {
        ...store,
        user: updatedUser
      };
    }


    case 'getSubsPlan':
      return {
        ...store,
        subscriptionPlans: action.payload
      };

    case "setSubscriptionPlan":
      return {
        ...store,
        sub: action.payload
      }

    case "clearCart":
      return {
        ...store,
        cart: []
      };

    /* INCREASE ITEM QUANTITY IN CART */
    case "increaseQuantity":
      return {
        ...store,
        cart: store.cart.map(item =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      };

    /* DECREASE ITEM QUANTITY IN CART */
    case "decreaseQuantity":
      return {
        ...store,
        cart: store.cart
          .map(item =>
            item.id === action.payload
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter(item => item.quantity > 0)
      };

    /* DELETE CART ITEM */
    case 'deleteItem': {
      const updatedCart = store.cart.filter(
        item => item.id !== action.payload
      );

      localStorage.setItem("cart", JSON.stringify(updatedCart));

      return {
        ...store,
        cart: updatedCart
      };
    }

    /* ADD CART ITEM */
    case 'addItem': {
      const exists = store.cart.find(item => item.id === action.payload.id);

      let updatedCart;

      if (exists) {
        updatedCart = store.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [
          ...store.cart,
          { ...action.payload, quantity: 1 }
        ];
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart));

      return {
        ...store,
        cart: updatedCart
      };
    }

    /* GET PRODUCTS */

    case 'getProducts':
      return {
        ...store,
        products: action.payload
      };

    /* LOGIN/REGISTER */

    case "logout":
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      return {
        ...store,
        auth: false,
        user: null,
      };

    case "auth":
      localStorage.setItem("user", JSON.stringify(action.payload.user));

      return {
        ...store,
        auth: true,
        user: action.payload.user,
      };

    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };

    case 'add_task':

      const { id, color } = action.payload

      return {
        ...store,
        todos: store.todos.map((todo) => (todo.id === id ? { ...todo, background: color } : todo))
      };
  }
}
