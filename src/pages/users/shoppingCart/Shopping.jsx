import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../../context/CartContext"; // Import CartContext
import api from "../../../config/api";
import { toast, ToastContainer } from "react-toastify";
import { jwtDecode } from "jwt-decode"; 

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

  const totalAmount = cart.reduce(
    (total, item) => total + item.discountPrice * item.quantity,
    0
  );

  const handleCheckout = async () => {
    // Get the token from local storage
    const token = localStorage.getItem("token"); // Adjust based on where you store your token
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    // Decode the token to get the email
    let email;
    try {
      const decodedToken = jwtDecode(token);
      email = decodedToken.sub; // Use 'sub' field for email
    } catch (error) {
      console.error("Token decoding failed:", error);
      toast.error("Failed to decode token. Please log in again.");
      return;
    }

    const checkoutItems = cart.map(item => ({
      productName: item.productName,
      quantity: item.quantity,
      discountPrice: item.discountPrice
    }));

    const checkoutRequestDTO = {
      email: email,
      cartItemRequests: checkoutItems,
      totalPrice: totalAmount
    };

    try {
      await api.post("/cart/checkout", checkoutRequestDTO);
      toast.success("Checkout successfully!");
      setCart([]); // Clear the cart after a successful checkout
      navigate("/cart");
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Checkout failed! Please try again."); // Show error message
    }
  };

  return (
    <>
      <ToastContainer />
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
    </>
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
                    <td>{item.discountPrice} VND</td>
                    <td>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => decreaseQuantity(item.productId)}
                      >
                        <i class="fa-solid fa-minus"></i>
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => increaseQuantity(item.productId)}
                      >
                        <i class="fa-solid fa-plus"></i>
                      </button>
                    </td>
                    <td>{item.discountPrice * item.quantity} VND</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => deleteItem(item.productId)}
                      >
                        <i class="fa-solid fa-xmark"></i> Remove
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