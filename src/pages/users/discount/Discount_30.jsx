import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Row, Col, Spin, notification } from "antd";
import Header from "../../../component/Header/Header";
import Footer from "../../../component/Footer/Footer";
import "./Discount_30.css";

const Discount30 = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch products from a fake API
        axios
            .get("https://fakestoreapi.com/products")
            .then((response) => {
                // Apply discount to each product
                const discountedProducts = response.data.map((product) => ({
                    ...product,
                    price: (product.price * 0.7).toFixed(2), // Apply 30% discount
                }));
                setProducts(discountedProducts);
                setLoading(false);
            })
            .catch((error) => {
                notification.error({
                    message: "Error fetching products",
                    description: error.message,
                });
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <>
            <Header />


            <div >
                <div className="container mt-5">
                    <h1 className="text-center mb-4">Products with 30% Discount</h1>
                    <Row gutter={[16, 16]}>
                        {products.map((product) => (
                            <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                                <Card
                                    hoverable
                                    cover={<img alt={product.title} src={product.image} style={{ height: "200px", objectFit: "contain" }} />}
                                    className="mb-4"
                                >
                                    <Card.Meta title={product.title} description={product.category} />
                                    <p className="mt-2 text-danger">${product.price}</p>
                                    <Button className="btn-discount"
                                        type="outline"
                                        block
                                        onClick={() => notification.success({
                                            message: "Added to cart",
                                            description: `${product.title} has been added to your cart!`,
                                        })}
                                    >
                                        Add to Cart
                                    </Button>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>



            <Footer />
        </>
    );
};

export default Discount30;