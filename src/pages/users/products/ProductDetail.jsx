import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Breadcrumb, Row, Col, Typography, Divider, InputNumber, Tabs, Form, Input, Modal, Rate } from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  DollarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import api from "../../../config/api";
import "./ProductDetail.css";
import { MapInteractionCSS } from "react-map-interaction";
import { CartContext } from "../../../context/CartContext";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; 
import MyEditor from "../../../component/TinyMCE/MyEditor";

const { Title } = Typography;

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [skinTypes, setSkinTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [sameSkinTypeProducts, setSameSkinTypeProducts] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [value, setValue] = useState({ scale: 1, translation: { x: 0, y: 0 } }); 
  const { addToCart } = useContext(CartContext);
  const [showAllSimilar, setShowAllSimilar] = useState(false);
  const [showAllSkinType, setShowAllSkinType] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [displayCountReviews, setDisplayCountReviews] = useState(4);



  const [displayCountSimilar, setDisplayCountSimilar] = useState(4); 
  const [displayCountSkinType, setDisplayCountSkinType] = useState(4); 

  const [feedbackForm] = Form.useForm();

  const [averageRating, setAverageRating] = useState(0);
  const [ratingCounts, setRatingCounts] = useState({});
  const [userRating, setUserRating] = useState(0); 

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
      
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
        setMainImage(response.data.productImages[0]?.imageURL);

   
        const allProductsResponse = await api.get("/products/list-name-products");
        const allProducts = allProductsResponse.data;

        
        const similarProducts = allProducts.filter(
          (p) => p.categoryId === response.data.categoryId && p.productId !== id
        );
        setSimilarProducts(similarProducts);

 
        const sameSkinTypeProducts = allProducts.filter(
          (p) => p.skinTypeId === response.data.skinTypeId && p.productId !== id
        );
        setSameSkinTypeProducts(sameSkinTypeProducts);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const brandsResponse = await api.get("/brands/list-name-brands");
        setBrands(brandsResponse.data);

        const skinTypesResponse = await api.get("/skin-types/list-name-skin-types");
        setSkinTypes(skinTypesResponse.data);

        const categoriesResponse = await api.get("/categories/list-name-categories");
        setCategories(categoriesResponse.data);

        const discountsResponse = await api.get("/discounts/list-name-discounts");
        setDiscounts(discountsResponse.data);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        if (!product || !product.productId) {
          console.log("Product ID không hợp lệ");
          return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
          console.log("Không tìm thấy token");
          return;
        }

        let email;
        try {
          const decodedToken = jwtDecode(token);
          email = decodedToken.sub;
          console.log("Email from token for fetching reviews:", email);
        } catch (error) {
          console.error("Lỗi khi giải mã token:", error);
          return;
        }

     
        console.log("Fetching reviews for product:", product.productId);
        // console.log("Full API URL:", `${api.defaults.baseURL}/feedbacks/product/${product.productId}`);

        // const response = await api.get(`/feedbacks/product/${product.productId}?email=${email}`, {
        //   headers: {
        //     'Authorization': `Bearer ${token}`
        //   }
        // });
        console.log("Fetching reviews for product:", product.productName);
        const response = await api.get(`/feedbacks/${email}/${product.productName}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log("Fetched feedbacks response:", response);

        if (response.data) {
       
          const enhancedReviews = response.data.map(review => ({
            ...review,
       
            users: {
              email: review.userId || review.email,
              fullName: review.user_first_name && review.user_last_name
                ? `${review.user_first_name} ${review.user_last_name}`
                : (review.userId?.split('@')[0] || "Người dùng")
            }
          }));

      
          const sortedReviews = enhancedReviews.sort((a, b) =>
            new Date(b.feedbackDate) - new Date(a.feedbackDate)
          );

          setReviews(sortedReviews);
        } else {
          setReviews([]);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        console.log("Error response data:", error.response?.data);
        console.log("Error response status:", error.response?.status);

 
        try {
          const token = localStorage.getItem("token");
          const response = await api.get('/feedbacks', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.data) {
         
            const productFeedbacks = response.data.filter(
              feedback => feedback.productId === product.productId
            );

            const enhancedReviews = productFeedbacks.map(review => ({
              ...review,
              users: {
                email: review.userId || review.email,
                fullName: review.user_first_name && review.user_last_name
                  ? `${review.user_first_name} ${review.user_last_name}`
                  : (review.userId?.split('@')[0] || "Người dùng")
              }
            }));

            const sortedReviews = enhancedReviews.sort((a, b) =>
              new Date(b.feedbackDate) - new Date(a.feedbackDate)
            );

            setReviews(sortedReviews);
            console.log("Successfully fetched reviews using fallback method");
          }
        } catch (fallbackError) {
          console.error("Fallback method also failed:", fallbackError);
          setReviews([]);
        }
      }

      try {
        const cachedReviews = localStorage.getItem(`product_reviews_${product.productId}`);
        if (cachedReviews) {
          const parsedCache = JSON.parse(cachedReviews);
          console.log("Found cached reviews:", parsedCache);
          setReviews(parsedCache);
        }
      } catch (cacheError) {
        console.error("Error reading cache:", cacheError);
      }
    };

    if (product) {
      fetchReviews();
    }
  }, [product]);

  useEffect(() => {
    const fetchRatingData = async () => {
      try {
        if (!product || !product.productId) return;


        const avgResponse = await api.get(`/feedbacks/average-rating/${product.productName}`);
        console.log("Average rating response:", avgResponse.data);


        const avgRating = !isNaN(avgResponse.data) ? avgResponse.data : 0;
        setAverageRating(avgRating);

    
        const countsResponse = await api.get(`/feedbacks/get-star/by-customer/${product.productName}`);
        console.log("Rating counts response:", countsResponse.data);

        const formattedCounts = {};
        for (let i = 1; i <= 5; i++) {
          formattedCounts[i] = countsResponse.data[i] || 0;
        }

        setRatingCounts(formattedCounts);

        console.log("Formatted ratings data:", {
          average: avgRating,
          counts: formattedCounts
        });
      } catch (error) {
        console.error("Error fetching rating data:", error);

        setAverageRating(0);
        setRatingCounts({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
      }
    };

    if (product) {
      fetchRatingData();
    }
  },[product, reviews]);

  const findNameById = (id, data) => {
    const item = data.find(
      (item) =>
        item.brandId === id ||
        item.skinTypeId === id ||
        item.categoryId === id ||
        item.discountId === id
    );
    return item
      ? item.brandName ||
      item.skinName ||
      item.categoryName ||
      item.discountPercent
      : "Loading...";
  };

  // const handleAddToCart = () => {
  //   console.log("Đang thêm sản phẩm vào giỏ hàng:", product);

  //   if (quantity % 1 !== 0) {
  //     toast.error("Số lượng phải là số nguyên (không chấp nhận số thập phân)");
  //     return;
  //   }

  //   if (quantity < 1) {
  //     toast.error("Số lượng không được nhỏ hơn 1");
  //     return;
  //   }

  //   if (quantity > product.quantity) {
  //     toast.error(`Số lượng không được vượt quá ${product.quantity} (số lượng tồn kho)`);
  //     return;
  //   }


  //   addToCart({
  //     ...product,
  //     quantity,
  //   });


  //   try {
  //     const guestCartKey = `cart_guest`;
  //     const savedCart = localStorage.getItem(guestCartKey);
  //     let updatedCart = [];

  //     if (savedCart) {
  //       const parsedCart = JSON.parse(savedCart);
  //       const existingProduct = parsedCart.find(
  //         (item) => item.productId === product.productId
  //       );

  //       if (existingProduct) {
  //         updatedCart = parsedCart.map((item) =>
  //           item.productId === product.productId
  //             ? { ...item, quantity: item.quantity + quantity }
  //             : item
  //         );
  //       } else {
  //         updatedCart = [...parsedCart, { ...product, quantity }];
  //       }
  //     } else {
  //       updatedCart = [{ ...product, quantity }];
  //     }

  //     localStorage.setItem(guestCartKey, JSON.stringify(updatedCart));
  //     console.log("Đã lưu giỏ hàng guest vào localStorage:", updatedCart);
  //   } catch (error) {
  //     console.error("Lỗi khi lưu giỏ hàng guest:", error);
  //   }

  //   toast.success(`Đã thêm ${product.productName} vào giỏ hàng thành công!`);
  // };

  const handleAddToCart = () => {
    console.log("Đang thêm sản phẩm vào giỏ hàng:", product);

    // Chỉ validate khi quantity là 0 hoặc không phải số nguyên
    if (quantity === 0 || quantity === null || quantity === undefined) {
      toast.error("Vui lòng nhập số lượng sản phẩm");
      return;
    }

    if (quantity % 1 !== 0) {
      toast.error("Số lượng phải là số nguyên (không chấp nhận số thập phân)");
      return;
    }

    if (quantity < 1) {
      toast.error("Số lượng không được nhỏ hơn 1");
      return;
    }

    if (quantity > product.quantity) {
      toast.error(`Số lượng không được vượt quá ${product.quantity} (số lượng tồn kho)`);
      return;
    }

    addToCart({
      ...product,
      quantity,
    });

    try {
      const guestCartKey = `cart_guest`;
      const savedCart = localStorage.getItem(guestCartKey);
      let updatedCart = [];

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        const existingProduct = parsedCart.find(
          (item) => item.productId === product.productId
        );

        if (existingProduct) {
          updatedCart = parsedCart.map((item) =>
            item.productId === product.productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          updatedCart = [...parsedCart, { ...product, quantity }];
        }
      } else {
        updatedCart = [{ ...product, quantity }];
      }

      localStorage.setItem(guestCartKey, JSON.stringify(updatedCart));
      console.log("Đã lưu giỏ hàng guest vào localStorage:", updatedCart);
    } catch (error) {
      console.error("Lỗi khi lưu giỏ hàng guest:", error);
    }

    toast.success(`Đã thêm ${product.productName} vào giỏ hàng thành công!`);
  };



  const handleAddToCartAndNavigate = () => {
    console.log("Đang thêm sản phẩm vào giỏ hàng và chuyển hướng:", product);

    if (quantity % 1 !== 0) {
      toast.error("Số lượng phải là số nguyên (không chấp nhận số thập phân)");
      return;
    }


    if (quantity < 1) {
      toast.error("Số lượng không được nhỏ hơn 1");
      return;
    }

    if (quantity > product.quantity) {
      toast.error(`Số lượng không được vượt quá ${product.quantity} (số lượng tồn kho)`);
      return;
    }


    addToCart({
      ...product,
      quantity,
    });


    try {
      const token = localStorage.getItem("token");
      let cartKey;

      if (token) {

        const decoded = jwtDecode(token);
        const email = decoded.sub;
        cartKey = `cart_${email}`;
      } else {

        cartKey = `cart_guest`;
      }

      const savedCart = localStorage.getItem(cartKey);
      let updatedCart = [];

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        const existingProduct = parsedCart.find(
          (item) => item.productId === product.productId
        );

        if (existingProduct) {
          updatedCart = parsedCart.map((item) =>
            item.productId === product.productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          updatedCart = [...parsedCart, { ...product, quantity }];
        }
      } else {
        updatedCart = [{ ...product, quantity }];
      }

      localStorage.setItem(cartKey, JSON.stringify(updatedCart));
      console.log("Đã lưu giỏ hàng vào localStorage:", updatedCart);
    } catch (error) {
      console.error("Lỗi khi lưu giỏ hàng:", error);
    }

  
    const token = localStorage.getItem("token");
    if (token) {
   
      navigate("/shopping-cart");
    } else {
      
      navigate("/login-and-signup", {
        state: {
          fromCart: true,
          message: "Vui lòng đăng nhập để hoàn tất đơn hàng"
        }
      });
    }
  };

  const handleThumbnailClick = (imageURL) => {
    setMainImage(imageURL);
  };

  const resetZoom = () => {
    setValue({ scale: 1, translation: { x: 0, y: 0 } }); 
  };


  const fetchFeedbacks = async () => {
    try {
      const response = await api.get(`/feedbacks/product/${id}`);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };
  const handleSubmitFeedback = async (values) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Bạn chưa đăng nhập! Vui lòng đăng nhập để tạo feedback.");
        return;
      }

      let email;
      try {
        const decodedToken = jwtDecode(token);
        email = decodedToken.sub;
        console.log("Email from token:", email);
      } catch (error) {
        console.error("Lỗi khi giải mã token:", error);
        toast.error("Không thể xác thực thông tin người dùng. Vui lòng đăng nhập lại!");
        return;
      }

      if (!email) {
        toast.error("Không tìm thấy thông tin email người dùng!");
        return;
      }

      const feedbackData = {
        feedbackContent: values.content,
        feedbackDate: new Date().toISOString(),
        productId: product.productId,
        productName: product.productName,
        userId: email,
        status: 0,
        rating: values.rating 
      };

      console.log("Submitting feedback:", feedbackData);

      const response = await api.post(
        `/feedbacks/${email}/${product.productName}`,
        feedbackData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        toast.success("Đánh giá sản phẩm thành công!");
        feedbackForm.resetFields();
        setUserRating(0); // Reset rating sau khi submit

        const returnedData = response.data;
        const newFeedback = {
          ...returnedData,
          feedbackId: returnedData.feedbackId || Date.now().toString(),
          feedbackContent: values.content,
          feedbackDate: new Date().toISOString(),
          productId: product.productId,
          productName: product.productName,
          userId: email,
          rating: values.rating,
          user_first_name: returnedData.user_first_name,
          user_last_name: returnedData.user_last_name,
          users: {
            email: email,
            fullName: returnedData.user_first_name && returnedData.user_last_name
              ? `${returnedData.user_first_name} ${returnedData.user_last_name}`
              : email.split('@')[0]
          }
        };

        // Cập nhật UI ngay lập tức mà không cần chờ API
        const newReviews = [newFeedback, ...reviews];
        const sortedReviews = newReviews.sort((a, b) => 
          new Date(b.feedbackDate) - new Date(a.feedbackDate)
        );
        setReviews(sortedReviews);

        // Tính toán average rating mới ngay lập tức
        const newTotalRating = sortedReviews.reduce((sum, review) => sum + review.rating, 0);
        const newAverage = newTotalRating / sortedReviews.length;
        setAverageRating(newAverage);

        // Cập nhật rating counts ngay lập tức
        const newRatingCounts = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
        sortedReviews.forEach(review => {
          newRatingCounts[review.rating]++;
        });
        setRatingCounts(newRatingCounts);

        // Cập nhật cache local storage
        try {
          localStorage.setItem(
            `product_reviews_${product.productId}`,
            JSON.stringify(sortedReviews)
          );
        } catch (cacheError) {
          console.error("Error caching reviews:", cacheError);
        }

        // Đồng bộ với server (chạy ngầm)
        try {
          const [avgResponse, countsResponse] = await Promise.all([
            api.get(`/feedbacks/average-rating/${product.productName}`),
            api.get(`/feedbacks/get-star/by-customer/${product.productName}`)
          ]);
          
          // Chỉ cập nhật nếu khác với giá trị đã tính
          if (avgResponse.data !== newAverage) {
            setAverageRating(avgResponse.data);
          }
          setRatingCounts(countsResponse.data);
        } catch (error) {
          console.error("Error syncing with server:", error);
        }
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      
      if (error.response) {
        switch (error.response.status) {
          case 500:
            toast.error("Lỗi server: Không thể gửi đánh giá. Vui lòng thử lại sau!");
            break;
          case 404:
            toast.error("Endpoint không tồn tại. Vui lòng kiểm tra lại đường dẫn API!");
            break;
          case 400:
            toast.error("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại!");
            break;
          case 401:
            toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
            break;
          default:
            toast.error(error.response.data?.message || "Có lỗi xảy ra khi gửi đánh giá");
        }
      } else {
        toast.error("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng!");
      }
    }
  };

  // const handleSubmitFeedback = async (values) => {
  //   try {
     
  //     const token = localStorage.getItem("token");

  //     if (!token) {
  //       toast.error("Bạn chưa đăng nhập! Vui lòng đăng nhập để tạo feedback.");
  //       return;
  //     }

  //     let email;
  //     try {
  //       const decodedToken = jwtDecode(token);
  //       email = decodedToken.sub; 
  //       console.log("Decoded token:", decodedToken);
  //       console.log("Email from token:", email);
  //     } catch (error) {
  //       console.error("Lỗi khi giải mã token:", error);
  //       toast.error("Không thể xác thực thông tin người dùng. Vui lòng đăng nhập lại!");
  //       return;
  //     }

  //     if (!email) {
  //       toast.error("Không tìm thấy thông tin email người dùng!");
  //       return;
  //     }


  //     const feedbackData = {
  //       feedbackContent: values.content,
  //       feedbackDate: new Date().toISOString(),
  //       productId: product.productId,
  //       productName: product.productName,
  //       userId: email,
  //       status: 0,
  //       rating: values.rating 
  //     };

  //     console.log("Sending feedback data:", feedbackData);
  //     console.log("API base URL:", api.defaults.baseURL);
  //     console.log("Full API URL:", `${api.defaults.baseURL}/feedbacks/${email}/${product.productName}`);


  //     const response = await api.post(
  //       `/feedbacks/${email}/${product.productName}`,
  //       feedbackData,
  //       {
  //         headers: {
  //           'Authorization': `Bearer ${token}`,
  //           'Content-Type': 'application/json'
  //         }
  //       }
  //     );

  //     console.log("Feedback submit response:", response);

  //     if (response.data) {
  //       toast.success("Đánh giá sản phẩm thành công!");
  //       feedbackForm.resetFields();


  //       const returnedData = response.data;

   
  //       const newFeedback = {
  //         ...returnedData,
  //         feedbackId: returnedData.feedbackId || Date.now().toString(),
  //         feedbackContent: values.content,
  //         feedbackDate: new Date().toISOString(),
  //         productId: product.productId,
  //         productName: product.productName,
  //         userId: email,
  //         rating: values.rating, 
  //         user_first_name: returnedData.user_first_name,
  //         user_last_name: returnedData.user_last_name,
  //         users: {
  //           email: email,
  //           fullName: returnedData.user_first_name && returnedData.user_last_name
  //             ? `${returnedData.user_first_name} ${returnedData.user_last_name}`
  //             : email.split('@')[0]
  //         }
  //       };

  
  //       setReviews(prev => {
  //         const updatedReviews = [newFeedback, ...prev];
  //         return updatedReviews.sort((a, b) =>
  //           new Date(b.feedbackDate) - new Date(a.feedbackDate)
  //         );
  //       });

      
  //       try {
  //         const cachedReviews = localStorage.getItem(`product_reviews_${product.productId}`);
  //         let updatedCache = [];

  //         if (cachedReviews) {
  //           updatedCache = JSON.parse(cachedReviews);
  //           updatedCache.unshift(newFeedback);
  //         } else {
  //           updatedCache = [newFeedback];
  //         }

  //         localStorage.setItem(`product_reviews_${product.productId}`, JSON.stringify(updatedCache));
  //       } catch (cacheError) {
  //         console.error("Error caching reviews:", cacheError);
  //       }

  
  //       try {
  //         const avgResponse = await api.get(`/feedbacks/average-rating/${product.productName}`);
  //         setAverageRating(avgResponse.data);

  //         const countsResponse = await api.get(`/feedbacks/get-star/by-customer/${product.productName}`);
  //         setRatingCounts(countsResponse.data);
  //       } catch (error) {
  //         console.error("Error updating rating data after submission:", error);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error submitting feedback:", error);
  //     console.log("Error response:", error.response?.data);
  //     console.log("Error status:", error.response?.status);

  //     if (error.response) {
  //       if (error.response.status === 500) {
  //         toast.error("Lỗi server: Không thể gửi đánh giá. Vui lòng thử lại sau!");
  //       } else if (error.response.status === 404) {
  //         toast.error("Endpoint không tồn tại. Vui lòng kiểm tra lại đường dẫn API!");
  //       } else if (error.response.status === 400) {
  //         toast.error("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại!");
  //       } else {
  //         toast.error(error.response.data?.message || "Có lỗi xảy ra khi gửi đánh giá");
  //       }
  //     } else {
  //       toast.error("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng!");
  //     }
  //   }
  // };


  const handleCancel = () => {
    feedbackForm.resetFields();
  };

  if (loading || !product) return <p>Loading...</p>;

  


  const tabItems = [
    {
      key: "1",
      label: "Mô tả",
      children: (
        <div className="tabContentStyle">
          <p dangerouslySetInnerHTML={{ __html: product.description }} />
        </div>
      ),
    },
    {
      key: "2",
      label: "Thông số",
      children: (
        <div className="tabContentStyle">
          <strong>Danh mục:</strong>
          <p>{findNameById(product.categoryId, categories)}</p>

          <strong>Dung tích:</strong>
          <p>{product.netWeight} ml</p>

          <strong>Thương hiệu:</strong>
          <p>{findNameById(product.brandId, brands)}</p>

          <strong>Loại da:</strong>
          <p>{findNameById(product.skinTypeId, skinTypes)}</p>
        </div>
      ),
    },
    {
      key: "3",
      label: "Thành phần",
      children: (
        <div className="tabContentStyle">
           <p dangerouslySetInnerHTML={{ __html: product.ingredients }} />
        </div>
      ),
    },
    {
      key: "4",
      label: "Cách dùng",
      children: (
        <div className="tabContentStyle">
          <p dangerouslySetInnerHTML={{ __html: product.usageInstruction }} />
        </div>
      ),
    },
    {
      key: "5",
      label: "Đánh giá",
      children: (
        <div className="tabContentStyle">
          <div className="mt-4">
            <h3>Đánh giá sản phẩm</h3>
            <div className="d-flex align-items-center mb-3">
              <span className="h2 me-2">
                {averageRating ? averageRating.toFixed(1) : "0.0"}
              </span>
              <div className="d-flex flex-column">
                <div className="d-flex">
                  {/* <Rate disabled defaultValue={averageRating} allowHalf /> */}
                  <Rate 
                disabled 
                value={averageRating} 
                allowHalf
                key={`rating-${product?.productId || 'loading'}`}
              />
                </div>
                <span className="text-muted">
                  {reviews.length > 0
                    ? `${reviews.length} đánh giá`
                    : "Chưa có đánh giá"}
                </span>
              </div>
            </div>

    
            {Object.keys(ratingCounts).length > 0 && (
              <div className="mb-4">
                <h5 className="mb-3">Phân bố đánh giá</h5>
                {[5, 4, 3, 2, 1].map(star => {
             
                  const count = ratingCounts[star] || 0;
                  const total = reviews.length;
                  const percentage = total > 0 ? (count / total) * 100 : 0;

                  return (
                    <div key={star} className="d-flex align-items-center mb-2">
                      <div style={{ width: '60px', textAlign: 'right' }}>
                        <strong>{star}</strong> <span className="text-warning">★</span>
                      </div>
                      <div className="progress flex-grow-1 mx-3" style={{ height: '12px' }}>
                        <div
                          className="progress-bar bg-warning"
                          role="progressbar"
                          style={{ width: `${percentage}%` }}
                          aria-valuenow={count}
                          aria-valuemin="0"
                          aria-valuemax={total}
                        ></div>
                      </div>
                      <div style={{ width: '50px' }}>
                        <span>{count}</span>
                        <small className="text-muted ms-1">
                          ({percentage.toFixed(0)}%)
                        </small>
                      </div>
                    </div>
                  );
                })}
                <div className="mt-2 text-center text-muted small">
                  Tổng cộng: {reviews.length} đánh giá • Trung bình: {averageRating.toFixed(1)}/5
                </div>
              </div>
            )}

    
            <div className="mb-4 p-3 border rounded">
              <h4>Viết đánh giá của bạn</h4>
              <Form form={feedbackForm} onFinish={handleSubmitFeedback} layout="vertical">
                <Form.Item
                  name="rating"
                  label="Đánh giá của bạn"
                  initialValue={0}
                  rules={[{
                    required: true,
                    type: 'number',
                    min: 1,
                    message: 'Vui lòng chọn số sao đánh giá'
                  }]}
                >
                  <Rate
                    onChange={value => {
                      setUserRating(value);
             
                      feedbackForm.setFieldsValue({ rating: value });
                    }}
                    value={userRating}
                    style={{ fontSize: '28px' }}
                  />
                </Form.Item>
                <Form.Item
                  name="content"
                  rules={[{ required: true, message: 'Vui lòng nhập nội dung đánh giá' }]}
                >
                  <MyEditor
                    rows={4}
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này"
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Gửi đánh giá
                  </Button>
                </Form.Item>
              </Form>
            </div>

            {reviews.length > 0 ? (
              <>
                {reviews.length > displayCountReviews && (
                  <Button
                    type="link"
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    style={{ marginBottom: '10px' }}
                  >
                    {showAllReviews ? "Ẩn bớt" : "Xem tất cả"}
                  </Button>
                )}
                {reviews.slice(0, showAllReviews ? reviews.length : displayCountReviews).map((review, index) => (
                  <div key={index} className="mb-3 p-3 border rounded">
                    <div className="d-flex align-items-center">
                      <UserOutlined className="me-2" />
                      <strong className="me-2">
                        {review.users?.fullName ||
                          (review.user_first_name && review.user_last_name
                            ? `${review.user_first_name} ${review.user_last_name}`
                            : review.userId?.split('@')[0] || "Người dùng")}
                      </strong>
                      <span className="text-muted">
                        {new Date(review.feedbackDate).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="mt-1">
                      <Rate disabled value={review.rating || 5} />
                    </div>
                    <div className="mt-2" dangerouslySetInnerHTML={{ __html: review.feedbackContent }} />
                    <p className="text-muted small">
                      Sản phẩm: {review.productName || product.productName}
                    </p>
                  </div>
                ))}
              </>
            ) : (
              <p>Chưa có đánh giá nào cho sản phẩm này</p>
            )}
            {!showAllReviews && reviews.length > displayCountReviews && (
              <Button
                type="link"
                onClick={() => setDisplayCountReviews(displayCountReviews + 4)}
                style={{ width: '100%', marginTop: '10px' }}
              >
                Xem thêm đánh giá
              </Button>
            )}
          </div>
        </div>
      ),
    },
  ];

  // const handleQuantityChange = (value) => {

  //   if (value % 1 !== 0) {
  //     toast.error("Số lượng phải là số nguyên (không chấp nhận số thập phân)");
  //     setQuantity(Math.floor(value)); 
  //     return;
  //   }

  //   if (value < 1) {
  //     toast.error("Số lượng không được nhỏ hơn 1");
  //     setQuantity(1);
  //     return;
  //   }

  //   if (value > product.quantity) {
  //     toast.error(`Số lượng không được vượt quá ${product.quantity}`);
  //     setQuantity(product.quantity);
  //     return;
  //   }

  //   setQuantity(value);
  // };

  const handleQuantityChange = (value) => {
    // Chỉ cập nhật state mà không validate ở đây
    setQuantity(value);
  };

  return (
    <>
      <ToastContainer />
      
        <div style={{ maxWidth: "1200px", margin: "auto", padding: "20px" }}>

         
          <h1>Chi tiết sản phẩm</h1>

          <Row gutter={32}>
      
            <Col xs={24} md={12}>
              <div className="border rounded-4 mb-3 d-flex justify-content-center">
                <MapInteractionCSS value={value} onChange={setValue}>
                  <img
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100vh",
                      margin: "auto",
                      width: "800px",
                      height: "400px",
                    }}
                    className="rounded-4 fit"
                    src={mainImage}
                    alt={product.productName}
                  />
                </MapInteractionCSS>
              </div>
              <Button onClick={resetZoom} style={{ marginBottom: "20px" }}>
                Đặt lại hình ảnh
              </Button>
              <div className="d-flex justify-content-center mb-3">
                {product.productImages.map((image, index) => (
                  <div
                    key={index}
                    className={`border mx-1 rounded-2 ${mainImage === image.imageURL ? "thumbnail-active" : ""
                      }`}
                    onClick={() => handleThumbnailClick(image.imageURL)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      width={60}
                      height={60}
                      className="rounded-2"
                      src={image.imageURL}
                      alt={`Thumbnail ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </Col>

   
            <Col xs={24} md={12}>
              <div className="ps-lg-3" style={{ padding: 10 }}>
                <Title level={2} className="title text-dark">
                  {product.productName}
                </Title>
                <div className="d-flex flex-row my-3">
                  <span className="text-muted">
                    <i className="fas fa-shopping-basket fa-sm mx-1" />
                    {product.quantity}
                  </span>
                  <span className="text-success ms-2">Trong kho</span>
                </div>
                <p style={{ color: "red" }}>
                  <strong style={{ color: "black" }}>Đã bán: </strong>
                  {product.soldQuantity}
                </p>
                <div className="mb-3">
                  <span className="h5">
                    {formatPrice(product.discountPrice)}
                    <span style={{ textDecoration: "underline" }}>đ</span>
                  </span>
                  <span className="text-muted"> /mỗi hộp</span>
                </div>
                {product.discountId && ( 
                  <p style={{ textDecoration: "line-through", color: "gray" }}>
                    {formatPrice(product.unitPrice)}
                    <span style={{ textDecoration: "underline" }}>đ</span>
                  </p>
                )}

                <div className="row" style={{ color: "black" }}>
                  <div className="row" style={{ fontSize: 25, color: "red" }}>
                    <dt className="col-3">Giảm giá:</dt>
                    <dd className="col-9">
                      {product.discountId ? `${findNameById(product.discountId, discounts)} %` : "Không có giảm giá"}
                    </dd>
                  </div>

                  <dt className="col-3">Thương hiệu:</dt>
                  <dd className="col-9">
                    {findNameById(product.brandId, brands)}
                  </dd>
                </div>
                <hr />
                <div className="row mb-4">
                  <div className="col-md-4 col-6 mb-3">
                    <label className="mb-2 d-block">Số lượng</label>
                    <InputNumber
                      defaultValue={1}
                      min={1}
                      max={product.quantity}
                      onChange={handleQuantityChange}
                      style={{ width: "100%" }}
                      precision={0}
                      title="Số lượng phải là số nguyên từ 1 đến số lượng tồn kho"
                    />
                  </div>
                </div>
                <Button

                  className="button-buy"
                  onClick={handleAddToCartAndNavigate}

                  icon={<DollarOutlined />}
                >

                  Mua ngay
                </Button>
                <Button

                  className="button-add-to-card"
                  onClick={handleAddToCart}
                  style={{ padding: 5 }}
                  icon={<ShoppingCartOutlined />}
                >

                  Thêm vào giỏ hàng
                </Button>
               
              </div>
            </Col>
          </Row>

  
          <section className="bg-light border-top py-4">
            <div className="container">
              <div className="row gx-4">
                <div className="col-lg-8 mb-4">
                  <div className="tabStyle">
                    <Tabs defaultActiveKey="1" items={tabItems} />
                  </div>

                </div>
                <div className="col-lg-4">
                  <div className="px-0 border rounded-2 shadow-0">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">Các sản phẩm tương tự</h5>
                        {similarProducts.slice(0, displayCountSimilar).map((product) => (
                          <div className="d-flex mb-3" key={product.productId}>
                            <Link
                              to={`/products/${product.productId}`}
                              className="me-3"
                            >
                              <img
                                src={product.productImages[0]?.imageURL}
                                style={{ width: 150, height: 100 }}
                                className="img-md img-thumbnail"
                                alt={product.productName}
                              />
                            </Link>
                            <div className="info">
                              <Link
                                to={`/products/${product.productId}`}
                                className="nav-link mb-1"
                              >
                                {product.productName}
                              </Link>
                              <strong className="text-dark">
                                {product.discountPrice}
                                <span style={{ textDecoration: "underline" }}>
                                  đ
                                </span>
                              </strong>
                            </div>
                          </div>
                        ))}
                        {similarProducts.length > displayCountSimilar && (
                          <Button
                            type="link"
                            onClick={() => setDisplayCountSimilar(displayCountSimilar + 4)} 
                            style={{ width: '100%', marginTop: '10px' }}
                          >
                            Xem thêm
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="px-0 border rounded-2 shadow-0 mt-4">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">Gợi ý sản phẩm cùng loại da</h5>
                        {sameSkinTypeProducts.slice(0, displayCountSkinType).map((product) => (
                          <div className="d-flex mb-3" key={product.productId}>
                            <Link
                              to={`/products/${product.productId}`}
                              className="me-3"
                            >
                              <img
                                src={product.productImages[0]?.imageURL}
                                style={{ width: 150, height: 100 }}
                                className="img-md img-thumbnail"
                                alt={product.productName}
                              />
                            </Link>
                            <div className="info">
                              <Link
                                to={`/products/${product.productId}`}
                                className="nav-link mb-1"
                              >
                                {product.productName}
                              </Link>
                              <strong className="text-dark">
                                {product.discountPrice}
                                <span style={{ textDecoration: "underline" }}>
                                  đ
                                </span>
                              </strong>
                            </div>
                          </div>
                        ))}
                        {sameSkinTypeProducts.length > displayCountSkinType && (
                          <Button
                            type="link"
                            onClick={() => setDisplayCountSkinType(displayCountSkinType + 4)}
                            style={{ width: '100%', marginTop: '10px' }}
                          >
                            Xem thêm
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
     
    </>
  );
}

//-----------------------------------------------------------------------------
// import React, { useEffect, useState, useContext } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Card, Button, Breadcrumb, Row, Col, Typography, Divider, InputNumber, Tabs, Form, Input, Modal, Rate } from "antd";
// import {
//   ShoppingCartOutlined,
//   HeartOutlined,
//   DollarOutlined,
//   UserOutlined,
// } from "@ant-design/icons";
// import api from "../../../config/api";
// import "./ProductDetail.css";
// import { MapInteractionCSS } from "react-map-interaction";
// import { CartContext } from "../../../context/CartContext";
// import { toast, ToastContainer } from "react-toastify";
// import { Link } from "react-router-dom";
// import { jwtDecode } from "jwt-decode"; 
// import MyEditor from "../../../component/TinyMCE/MyEditor";

// const { Title } = Typography;

// export default function ProductDetail() {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const [brands, setBrands] = useState([]);
//   const [skinTypes, setSkinTypes] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [discounts, setDiscounts] = useState([]);
//   const [similarProducts, setSimilarProducts] = useState([]);
//   const [sameSkinTypeProducts, setSameSkinTypeProducts] = useState([]);
//   const [mainImage, setMainImage] = useState("");
//   const [value, setValue] = useState({ scale: 1, translation: { x: 0, y: 0 } }); 
//   const { addToCart } = useContext(CartContext);
//   const [showAllSimilar, setShowAllSimilar] = useState(false);
//   const [showAllSkinType, setShowAllSkinType] = useState(false);
//   const [reviews, setReviews] = useState([]);
//   const [showAllReviews, setShowAllReviews] = useState(false);
//   const [displayCountReviews, setDisplayCountReviews] = useState(4);
//   const [displayCountSimilar, setDisplayCountSimilar] = useState(4); 
//   const [displayCountSkinType, setDisplayCountSkinType] = useState(4); 
//   const [feedbackForm] = Form.useForm();
//   const [averageRating, setAverageRating] = useState(0);
//   const [ratingCounts, setRatingCounts] = useState({});
//   const [userRating, setUserRating] = useState(0); 

//   const formatPrice = (price) => {
//     return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
//   };

//   const fetchUpdatedProduct = async () => {
//     try {
//       const response = await api.get(`/products/${id}`);
//       const updatedProduct = response.data;
      
//       if (!product) {
//         setProduct(updatedProduct);
//         return;
//       }

//       const hasChanges = 
//         updatedProduct.discountPrice !== product.discountPrice ||
//         updatedProduct.productName !== product.productName ||
//         updatedProduct.quantity !== product.quantity ||
//         JSON.stringify(updatedProduct.productImages) !== JSON.stringify(product.productImages);

//       if (hasChanges) {
//         setProduct(updatedProduct);
//         setMainImage(updatedProduct.productImages[0]?.imageURL);
//         toast.info("Thông tin sản phẩm đã được cập nhật");
//       }
//     } catch (error) {
//       console.error("Error fetching updated product:", error);
//     }
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (id && product) {
//         fetchUpdatedProduct();
//       }
//     }, 3000); // Kiểm tra mỗi 3 giây

//     return () => clearInterval(interval);
//   }, [id, product]);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const response = await api.get(`/products/${id}`);
//         setProduct(response.data);
//         setMainImage(response.data.productImages[0]?.imageURL);

//         const allProductsResponse = await api.get("/products/list-name-products");
//         const allProducts = allProductsResponse.data;

//         const similarProducts = allProducts.filter(
//           (p) => p.categoryId === response.data.categoryId && p.productId !== id
//         );
//         setSimilarProducts(similarProducts);

//         const sameSkinTypeProducts = allProducts.filter(
//           (p) => p.skinTypeId === response.data.skinTypeId && p.productId !== id
//         );
//         setSameSkinTypeProducts(sameSkinTypeProducts);
//       } catch (error) {
//         console.error("Error fetching product:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [id]);

//   // ... (giữ nguyên các useEffect, hàm helper và hàm xử lý khác)

//   const findNameById = (id, data) => {
//     const item = data.find(
//       (item) =>
//         item.brandId === id ||
//         item.skinTypeId === id ||
//         item.categoryId === id ||
//         item.discountId === id
//     );
//     return item
//       ? item.brandName ||
//           item.skinName ||
//           item.categoryName ||
//           item.discountPercent
//       : "Loading...";
//   };

//   const handleAddToCart = () => {
//     if (quantity === 0 || quantity === null || quantity === undefined) {
//       toast.error("Vui lòng nhập số lượng sản phẩm");
//       return;
//     }

//     if (quantity % 1 !== 0) {
//       toast.error("Số lượng phải là số nguyên");
//       return;
//     }

//     if (quantity < 1) {
//       toast.error("Số lượng không được nhỏ hơn 1");
//       return;
//     }

//     if (quantity > product.quantity) {
//       toast.error(`Số lượng không được vượt quá ${product.quantity} (số lượng tồn kho)`);
//       return;
//     }

//     addToCart({
//       ...product,
//       quantity,
//     });

//     try {
//       const guestCartKey = `cart_guest`;
//       const savedCart = localStorage.getItem(guestCartKey);
//       let updatedCart = [];

//       if (savedCart) {
//         const parsedCart = JSON.parse(savedCart);
//         const existingProduct = parsedCart.find(
//           (item) => item.productId === product.productId
//         );

//         if (existingProduct) {
//           updatedCart = parsedCart.map((item) =>
//             item.productId === product.productId
//               ? { ...item, quantity: item.quantity + quantity }
//               : item
//           );
//         } else {
//           updatedCart = [...parsedCart, { ...product, quantity }];
//         }
//       } else {
//         updatedCart = [{ ...product, quantity }];
//       }

//       localStorage.setItem(guestCartKey, JSON.stringify(updatedCart));
//     } catch (error) {
//       console.error("Lỗi khi lưu giỏ hàng guest:", error);
//     }

//     toast.success(`Đã thêm ${product.productName} vào giỏ hàng thành công!`);
//   };

//   const handleQuantityChange = (value) => {
//     setQuantity(value);
//   };

//   // ... (giữ nguyên các hàm xử lý khác)

  
// const resetZoom = () => {
//   setValue({ scale: 1, translation: { x: 0, y: 0 } });
// };

// const handleThumbnailClick = (imageURL) => {
//   setMainImage(imageURL);
// };

// const handleSubmitFeedback = async (values) => {
//   try {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("Vui lòng đăng nhập để đánh giá");
//       return;
//     }

//     const decoded = jwtDecode(token);
//     const email = decoded.sub;

//     const feedbackData = {
//       feedbackContent: values.content,
//       rating: values.rating,
//       productId: product.productId,
//       userId: email
//     };

//     await api.post("/feedbacks", feedbackData, {
//       headers: { Authorization: `Bearer ${token}` }
//     });

//     toast.success("Đánh giá thành công!");
//     feedbackForm.resetFields();
//     // Gọi lại API để cập nhật danh sách đánh giá
//     const response = await api.get(`/feedbacks/product/${product.productId}`);
//     setReviews(response.data);
//   } catch (error) {
//     console.error("Error submitting feedback:", error);
//     toast.error("Gửi đánh giá thất bại");
//   }
// };

//   const handleAddToCartAndNavigate = () => {
//     if (quantity % 1 !== 0) {
//       toast.error("Số lượng phải là số nguyên");
//       return;
//     }
  
//     if (quantity < 1) {
//       toast.error("Số lượng không được nhỏ hơn 1");
//       return;
//     }
  
//     if (quantity > product.quantity) {
//       toast.error(`Số lượng không được vượt quá ${product.quantity}`);
//       return;
//     }
  
//     addToCart({
//       ...product,
//       quantity,
//     });
  
//     // Xử lý navigation
//     const token = localStorage.getItem("token");
//     if (token) {
//       navigate("/shopping-cart");
//     } else {
//       navigate("/login-and-signup", {
//         state: { fromCart: true }
//       });
//     }
//   };

//   if (loading || !product) return <p>Loading...</p>;

//   const tabItems = [
    
//     {
//       key: "1",
//       label: "Mô tả",
//       children: (
//         <div className="tabContentStyle">
//           <p dangerouslySetInnerHTML={{ __html: product.description }} />
//         </div>
//       ),
//     },
//     {
//       key: "2",
//       label: "Thông số",
//       children: (
//         <div className="tabContentStyle">
//           <strong>Danh mục:</strong>
//           <p>{findNameById(product.categoryId, categories)}</p>

//           <strong>Dung tích:</strong>
//           <p>{product.netWeight} ml</p>

//           <strong>Thương hiệu:</strong>
//           <p>{findNameById(product.brandId, brands)}</p>

//           <strong>Loại da:</strong>
//           <p>{findNameById(product.skinTypeId, skinTypes)}</p>
//         </div>
//       ),
//     },
//     {
//       key: "3",
//       label: "Thành phần",
//       children: (
//         <div className="tabContentStyle">
//           <p>{product.ingredients}</p>
//         </div>
//       ),
//     },
//     {
//       key: "4",
//       label: "Cách dùng",
//       children: (
//         <div className="tabContentStyle">
//           <p dangerouslySetInnerHTML={{ __html: product.usageInstruction }} />
//         </div>
//       ),
//     },
//     {
//       key: "5",
//       label: "Đánh giá",
//       children: (
//         <div className="tabContentStyle">
//           <div className="mt-4">
//             <h3>Đánh giá sản phẩm</h3>
//             <div className="d-flex align-items-center mb-3">
//               <span className="h2 me-2">
//                 {averageRating ? averageRating.toFixed(1) : "0.0"}
//               </span>
//               <div className="d-flex flex-column">
//                 <div className="d-flex">
//                   <Rate disabled defaultValue={averageRating} allowHalf />
//                 </div>
//                 <span className="text-muted">
//                   {reviews.length > 0
//                     ? `${reviews.length} đánh giá`
//                     : "Chưa có đánh giá"}
//                 </span>
//               </div>
//             </div>

//             {Object.keys(ratingCounts).length > 0 && (
//               <div className="mb-4">
//                 <h5 className="mb-3">Phân bố đánh giá</h5>
//                 {[5, 4, 3, 2, 1].map(star => {
             
//                   const count = ratingCounts[star] || 0;
//                   const total = reviews.length;
//                   const percentage = total > 0 ? (count / total) * 100 : 0;

//                   return (
//                     <div key={star} className="d-flex align-items-center mb-2">
//                       <div style={{ width: '60px', textAlign: 'right' }}>
//                         <strong>{star}</strong> <span className="text-warning">★</span>
//                       </div>
//                       <div className="progress flex-grow-1 mx-3" style={{ height: '12px' }}>
//                         <div
//                           className="progress-bar bg-warning"
//                           role="progressbar"
//                           style={{ width: `${percentage}%` }}
//                           aria-valuenow={count}
//                           aria-valuemin="0"
//                           aria-valuemax={total}
//                         ></div>
//                       </div>
//                       <div style={{ width: '50px' }}>
//                         <span>{count}</span>
//                         <small className="text-muted ms-1">
//                           ({percentage.toFixed(0)}%)
//                         </small>
//                       </div>
//                     </div>
//                   );
//                 })}
//                 <div className="mt-2 text-center text-muted small">
//                   Tổng cộng: {reviews.length} đánh giá • Trung bình: {averageRating.toFixed(1)}/5
//                 </div>
//               </div>
//             )}

    
//             <div className="mb-4 p-3 border rounded">
//               <h4>Viết đánh giá của bạn</h4>
//               <Form form={feedbackForm} onFinish={handleSubmitFeedback} layout="vertical">
//                 <Form.Item
//                   name="rating"
//                   label="Đánh giá của bạn"
//                   initialValue={0}
//                   rules={[{
//                     required: true,
//                     type: 'number',
//                     min: 1,
//                     message: 'Vui lòng chọn số sao đánh giá'
//                   }]}
//                 >
//                   <Rate
//                     onChange={value => {
//                       setUserRating(value);
             
//                       feedbackForm.setFieldsValue({ rating: value });
//                     }}
//                     value={userRating}
//                     style={{ fontSize: '28px' }}
//                   />
//                 </Form.Item>
//                 <Form.Item
//                   name="content"
//                   rules={[{ required: true, message: 'Vui lòng nhập nội dung đánh giá' }]}
//                 >
//                   <MyEditor
//                     rows={4}
//                     placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này"
//                   />
//                 </Form.Item>
//                 <Form.Item>
//                   <Button type="primary" htmlType="submit">
//                     Gửi đánh giá
//                   </Button>
//                 </Form.Item>
//               </Form>
//             </div>

//             {reviews.length > 0 ? (
//               <>
//                 {reviews.length > displayCountReviews && (
//                   <Button
//                     type="link"
//                     onClick={() => setShowAllReviews(!showAllReviews)}
//                     style={{ marginBottom: '10px' }}
//                   >
//                     {showAllReviews ? "Ẩn bớt" : "Xem tất cả"}
//                   </Button>
//                 )}
//                 {reviews.slice(0, showAllReviews ? reviews.length : displayCountReviews).map((review, index) => (
//                   <div key={index} className="mb-3 p-3 border rounded">
//                     <div className="d-flex align-items-center">
//                       <UserOutlined className="me-2" />
//                       <strong className="me-2">
//                         {review.users?.fullName ||
//                           (review.user_first_name && review.user_last_name
//                             ? `${review.user_first_name} ${review.user_last_name}`
//                             : review.userId?.split('@')[0] || "Người dùng")}
//                       </strong>
//                       <span className="text-muted">
//                         {new Date(review.feedbackDate).toLocaleDateString('vi-VN', {
//                           year: 'numeric',
//                           month: 'long',
//                           day: 'numeric',
//                           hour: '2-digit',
//                           minute: '2-digit'
//                         })}
//                       </span>
//                     </div>
//                     <div className="mt-1">
//                       <Rate disabled value={review.rating || 5} />
//                     </div>
//                     <div className="mt-2" dangerouslySetInnerHTML={{ __html: review.feedbackContent }} />
//                     <p className="text-muted small">
//                       Sản phẩm: {review.productName || product.productName}
//                     </p>
//                   </div>
//                 ))}
//               </>
//             ) : (
//               <p>Chưa có đánh giá nào cho sản phẩm này</p>
//             )}
//             {!showAllReviews && reviews.length > displayCountReviews && (
//               <Button
//                 type="link"
//                 onClick={() => setDisplayCountReviews(displayCountReviews + 4)}
//                 style={{ width: '100%', marginTop: '10px' }}
//               >
//                 Xem thêm đánh giá
//               </Button>
//             )}
//           </div>
//         </div>
//       ),
//     },
//   ];


//   return (
//     <>
//       <ToastContainer />
//       <div style={{ maxWidth: "1200px", margin: "auto", padding: "20px" }}>
//         <h1>Chi tiết sản phẩm</h1>

//         <Row gutter={32}>
//           <Col xs={24} md={12}>
//             <div className="border rounded-4 mb-3 d-flex justify-content-center">
//               <MapInteractionCSS value={value} onChange={setValue}>
//                 <img
//                   style={{
//                     maxWidth: "100%",
//                     maxHeight: "100vh",
//                     margin: "auto",
//                     width: "800px",
//                     height: "400px",
//                   }}
//                   className="rounded-4 fit"
//                   src={mainImage}
//                   alt={product.productName}
//                 />
//               </MapInteractionCSS>
//             </div>
//             <Button onClick={resetZoom} style={{ marginBottom: "20px" }}>
//               Đặt lại hình ảnh
//             </Button>
//             <div className="d-flex justify-content-center mb-3">
//               {product.productImages.map((image, index) => (
//                 <div
//                   key={index}
//                   className={`border mx-1 rounded-2 ${mainImage === image.imageURL ? "thumbnail-active" : ""
//                     }`}
//                   onClick={() => handleThumbnailClick(image.imageURL)}
//                   style={{ cursor: "pointer" }}
//                 >
//                   <img
//                     width={60}
//                     height={60}
//                     className="rounded-2"
//                     src={image.imageURL}
//                     alt={`Thumbnail ${index + 1}`}
//                   />
//                 </div>
//               ))}
//             </div>
//           </Col>

//           <Col xs={24} md={12}>
//             <div className="ps-lg-3" style={{ padding: 10 }}>
//               <Title level={2} className="title text-dark">
//                 {product.productName}
//               </Title>
//               <div className="d-flex flex-row my-3">
//                 <span className="text-muted">
//                   <i className="fas fa-shopping-basket fa-sm mx-1" />
//                   {product.quantity}
//                 </span>
//                 <span className="text-success ms-2">Trong kho</span>
//               </div>
//               <p style={{ color: "red" }}>
//                 <strong style={{ color: "black" }}>Đã bán: </strong>
//                 {product.soldQuantity}
//               </p>
//               <div className="mb-3">
//                 <span className="h5">
//                   {formatPrice(product.discountPrice)}
//                   <span style={{ textDecoration: "underline" }}>đ</span>
//                 </span>
//                 <span className="text-muted"> /mỗi hộp</span>
//               </div>
//               {product.discountId && ( 
//                 <p style={{ textDecoration: "line-through", color: "gray" }}>
//                   {formatPrice(product.unitPrice)}
//                   <span style={{ textDecoration: "underline" }}>đ</span>
//                 </p>
//               )}

//               <div className="row" style={{ color: "black" }}>
//                 <div className="row" style={{ fontSize: 25, color: "red" }}>
//                   <dt className="col-3">Giảm giá:</dt>
//                   <dd className="col-9">
//                     {product.discountId ? `${findNameById(product.discountId, discounts)} %` : "Không có giảm giá"}
//                   </dd>
//                 </div>

//                 <dt className="col-3">Thương hiệu:</dt>
//                 <dd className="col-9">
//                   {findNameById(product.brandId, brands)}
//                 </dd>
//               </div>
//               <hr />
//               <div className="row mb-4">
//                 <div className="col-md-4 col-6 mb-3">
//                   <label className="mb-2 d-block">Số lượng</label>
//                   <InputNumber
//                     defaultValue={1}
//                     min={1}
//                     max={product.quantity}
//                     onChange={handleQuantityChange}
//                     style={{ width: "100%" }}
//                     precision={0}
//                     title="Số lượng phải là số nguyên từ 1 đến số lượng tồn kho"
//                   />
//                 </div>
//               </div>
//               <Button
//                 className="button-buy"
//                 onClick={handleAddToCartAndNavigate}
//                 icon={<DollarOutlined />}
//               >
//                 Mua ngay
//               </Button>
//               <Button
//                 className="button-add-to-card"
//                 onClick={handleAddToCart}
//                 style={{ padding: 5 }}
//                 icon={<ShoppingCartOutlined />}
//               >
//                 Thêm vào giỏ hàng
//               </Button>
//             </div>
//           </Col>
//         </Row>

//         <section className="bg-light border-top py-4">
//           <div className="container">
//             <div className="row gx-4">
//               <div className="col-lg-8 mb-4">
//                 <div className="tabStyle">
//                   <Tabs defaultActiveKey="1" items={tabItems} />
//                 </div>
//               </div>
//               <div className="col-lg-4">
//                 <div className="px-0 border rounded-2 shadow-0">
//                   <div className="card">
//                     <div className="card-body">
//                       <h5 className="card-title">Các sản phẩm tương tự</h5>
//                       {similarProducts.slice(0, displayCountSimilar).map((product) => (
//                         <div className="d-flex mb-3" key={product.productId}>
//                           <Link
//                             to={`/products/${product.productId}`}
//                             className="me-3"
//                           >
//                             <img
//                               src={product.productImages[0]?.imageURL}
//                               style={{ width: 150, height: 100 }}
//                               className="img-md img-thumbnail"
//                               alt={product.productName}
//                             />
//                           </Link>
//                           <div className="info">
//                             <Link
//                               to={`/products/${product.productId}`}
//                               className="nav-link mb-1"
//                             >
//                               {product.productName}
//                             </Link>
//                             <strong className="text-dark">
//                               {product.discountPrice}
//                               <span style={{ textDecoration: "underline" }}>
//                                 đ
//                               </span>
//                             </strong>
//                           </div>
//                         </div>
//                       ))}
//                       {similarProducts.length > displayCountSimilar && (
//                         <Button
//                           type="link"
//                           onClick={() => setDisplayCountSimilar(displayCountSimilar + 4)} 
//                           style={{ width: '100%', marginTop: '10px' }}
//                         >
//                           Xem thêm
//                         </Button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="px-0 border rounded-2 shadow-0 mt-4">
//                   <div className="card">
//                     <div className="card-body">
//                       <h5 className="card-title">Gợi ý sản phẩm cùng loại da</h5>
//                       {sameSkinTypeProducts.slice(0, displayCountSkinType).map((product) => (
//                         <div className="d-flex mb-3" key={product.productId}>
//                           <Link
//                             to={`/products/${product.productId}`}
//                             className="me-3"
//                           >
//                             <img
//                               src={product.productImages[0]?.imageURL}
//                               style={{ width: 150, height: 100 }}
//                               className="img-md img-thumbnail"
//                               alt={product.productName}
//                             />
//                           </Link>
//                           <div className="info">
//                             <Link
//                               to={`/products/${product.productId}`}
//                               className="nav-link mb-1"
//                             >
//                               {product.productName}
//                             </Link>
//                             <strong className="text-dark">
//                               {product.discountPrice}
//                               <span style={{ textDecoration: "underline" }}>
//                                 đ
//                               </span>
//                             </strong>
//                           </div>
//                         </div>
//                       ))}
//                       {sameSkinTypeProducts.length > displayCountSkinType && (
//                         <Button
//                           type="link"
//                           onClick={() => setDisplayCountSkinType(displayCountSkinType + 4)}
//                           style={{ width: '100%', marginTop: '10px' }}
//                         >
//                           Xem thêm
//                         </Button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//     </>
//   );
// }