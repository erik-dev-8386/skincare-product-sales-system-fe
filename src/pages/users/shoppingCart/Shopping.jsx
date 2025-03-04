// import React, { useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { CartContext } from "../../../context/CartContext"; // Import CartContext
// import Header from "../../../component/Header/Header";
// import Footer from "../../../component/Footer/Footer";
// import "./Shopping.css";

// export default function CartPage() {
//   const navigate = useNavigate();
//   const { cart, setCart } = useContext(CartContext); // Use CartContext

//   const increaseQuantity = (id) => {
//     setCart((prevCart) =>
//       prevCart.map((item) =>
//         item.productId === id ? { ...item, quantity: item.quantity + 1 } : item
//       )
//     );
//   };

//   const decreaseQuantity = (id) => {
//     setCart((prevCart) =>
//       prevCart.map((item) =>
//         item.productId === id && item.quantity > 1
//           ? { ...item, quantity: item.quantity - 1 }
//           : item
//       )
//     );
//   };

//   const deleteItem = (id) => {
//     setCart((prevCart) => prevCart.filter((item) => item.productId !== id));
//   };

//   const handleCheckout = () => {
//     navigate("/cart", { state: { cartItems: cart } });
//   };

//   const totalAmount = cart.reduce(
//     (total, item) => total + item.unitPrice * item.quantity,
//     0
//   );

//   return (
//     <div>
//       {/* <Header /> */}
//       <ShoppingCartContent
//         cartItems={cart}
//         increaseQuantity={increaseQuantity}
//         decreaseQuantity={decreaseQuantity}
//         deleteItem={deleteItem}
//         handleCheckout={handleCheckout}
//         totalAmount={totalAmount}
//       />
//       {/* <Footer /> */}
//     </div>
//   );
// }

// const ShoppingCartContent = ({
//   cartItems,
//   increaseQuantity,
//   decreaseQuantity,
//   deleteItem,
//   handleCheckout,
//   totalAmount,
// }) => {
//   return (
//     <div className="container px-3 my-5 clearfix">
//       <div className="card">
//         <div className="card-header">
//           <h2>Shopping Cart</h2>
//         </div>
//         <div className="card-body">
//           <div className="table-responsive">
//             <table className="table table-bordered">
//               <thead>
//                 <tr>
//                   <th>Product</th>
//                   <th>Price</th>
//                   <th>Quantity</th>
//                   <th>Total</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {cartItems.map((item) => (
//                   <tr key={item.productId}>
//                     <td>
//                       <img
//                         src={item.productImages[0]?.imageURL}
//                         className="d-block ui-w-40 ui-bordered mr-4"
//                         alt={item.productName}
//                         width="50"
//                       />
//                       {item.productName}
//                     </td>
//                     <td>{item.unitPrice} VND</td>
//                     <td>
//                       <button
//                         className="btn btn-sm btn-secondary"
//                         onClick={() => decreaseQuantity(item.productId)}
//                       >
//                         ➖
//                       </button>
//                       <span className="mx-2">{item.quantity}</span>
//                       <button
//                         className="btn btn-sm btn-secondary"
//                         onClick={() => increaseQuantity(item.productId)}
//                       >
//                         ➕
//                       </button>
//                     </td>
//                     <td>{item.unitPrice * item.quantity} VND</td>
//                     <td>
//                       <button
//                         className="btn btn-danger"
//                         onClick={() => deleteItem(item.productId)}
//                       >
//                         ❌ Remove
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//         <div className="card-footer text-right">
//           <h4>Total Amount: {totalAmount} VND</h4>
//           <button className="btn btn-primary" onClick={handleCheckout}>
//             Checkout
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../../context/CartContext"; // Import CartContext
import Header from "../../../component/Header/Header";
import Footer from "../../../component/Footer/Footer";
import "./Shopping.css";

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, setCart } = useContext(CartContext); // Use CartContext

  const increaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const deleteItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== id));
  };

  const handleCheckout = () => {
    navigate("/cart", { state: { cartItems: cart } });
  };

  const totalAmount = cart.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0
  );

  return (
    <div>
      {/* <Header /> */}
      <ShoppingCartContent
        cartItems={cart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        deleteItem={deleteItem}
        handleCheckout={handleCheckout}
        totalAmount={totalAmount}
      />
      {/* <Footer /> */}
    </div>
  );
}

const ShoppingCartContent = ({
  cartItems,
  increaseQuantity,
  decreaseQuantity,
  deleteItem,
  handleCheckout,
  totalAmount,
}) => {
  return (
    <div className="container px-3 my-5 clearfix">
      <div className="card">
        <div className="card-header">
          <h2>Shopping Cart</h2>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.productId}>
                    <td>
                      <img
                        src={item.productImages[0]?.imageURL}
                        className="d-block ui-w-40 ui-bordered mr-4"
                        alt={item.productName}
                        width="50"
                      />
                      {item.productName}
                    </td>
                    <td>{item.unitPrice} VND</td>
                    <td>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => decreaseQuantity(item.productId)}
                      >
                        ➖
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => increaseQuantity(item.productId)}
                      >
                        ➕
                      </button>
                    </td>
                    <td>{item.unitPrice * item.quantity} VND</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => deleteItem(item.productId)}
                      >
                        ❌ Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer text-right">
          <h4>Total Amount: {totalAmount} VND</h4>
          <button className="btn btn-primary" onClick={handleCheckout}>
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};
