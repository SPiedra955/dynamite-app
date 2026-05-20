export const initialStore = () => {
  return {
    /* WE USE LOCALSTORAGE TO SAVE THE TOKEN */
    auth: !!localStorage.getItem("token"),
    user: JSON.parse(localStorage.getItem("user")) || null,
    message: null,
    products: [],
    cart: JSON.parse(localStorage.getItem("cart")) || [],
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      }
    ]
  }
}

export default function storeReducer(store, action = {}) {
  switch (action.type) {

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
      if (store.cart.some(item => item.id === action.payload.id)) {
        return store;
      }

      const updatedCart = [...store.cart, action.payload];

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
    default:
      throw Error('Unknown action.');
  }
}
