import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Orders.css";

export default function Orders({ userEmail }) {
    const [orders, setOrders] = useState([]);
    const [newOrder, setNewOrder] = useState({
        name: "",
        date: "",
        category: "",
        price: "",
        amount: "",
    });
    const [editingOrderId, setEditingOrderId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/get-orders", {
                    params: {
                        user: userEmail,
                    },
                });
                setOrders(response.data.orders);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [editingOrderId]);

    const handleDelete = async (orderId) => {
        try {
            const response = await axios.delete(`/remove-order/${orderId}`);

            if (response.status === 200) {
                const updatedOrders = orders.filter((order) => order._id !== orderId);
                setOrders(updatedOrders);
            } else {
                console.error("Failed to delete order");
            }
        } catch (error) {
            console.error("Error deleting order:", error);
        }
    };

    const handleEdit = (orderId) => {
        setEditingOrderId(orderId);
    };

    const handleEditChange = (field, value) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order._id === editingOrderId ? { ...order, [field]: value } : order
            )
        );
    };

    const handleSaveEdit = async (orderId) => {
        try {
            const response = await axios.patch(`/update-order/${orderId}`, orders.find((order) => order._id === orderId));
            setEditingOrderId(null);
        } catch (error) {
            console.error("Error updating order:", error);
        }
    };

    const handleAddNewOrder = async () => {
        try {
            const response = await axios.post("/create-order", {
                ...newOrder,
                user: userEmail,
            });

            if (response.status === 201) {
                const createdOrder = response.data;
                setOrders([...orders, createdOrder]);
                setNewOrder({
                    name: "",
                    date: "",
                    category: "",
                    price: "",
                    amount: "",
                });
            } else {
                console.error("Failed to add new order");
            }
        } catch (error) {
            console.error("Error adding new order:", error);
        }
    };

    return (
        <div className="bg-white p-3 rounded-bottom">
            <h1>Orders</h1>
            <table className="table">
                <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Name</th>
                    <th scope="col">Date</th>
                    <th scope="col">Category</th>
                    <th scope="col">Price</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Actions</th>
                </tr>
                </thead>
                <tbody>
                {orders.map((item, index) => (
                    <tr key={item._id}>
                        <th scope="row">{index + 1}</th>
                        <td>
                            {editingOrderId === item._id ? (
                                <input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) => handleEditChange("name", e.target.value)}
                                    className="form-control"
                                />
                            ) : (
                                item.name
                            )}
                        </td>
                        <td>
                            {editingOrderId === item._id ? (
                                <input
                                    type="text"
                                    value={item.date}
                                    onChange={(e) => handleEditChange("date", e.target.value)}
                                    className="form-control"
                                />
                            ) : (
                                item.date
                            )}
                        </td>
                        <td>
                            {editingOrderId === item._id ? (
                                <input
                                    type="text"
                                    value={item.category}
                                    onChange={(e) => handleEditChange("category", e.target.value)}
                                    className="form-control"
                                />
                            ) : (
                                item.category
                            )}
                        </td>
                        <td>
                            {editingOrderId === item._id ? (
                                <input
                                    type="text"
                                    value={item.price}
                                    onChange={(e) => handleEditChange("price", e.target.value)}
                                    className="form-control"
                                />
                            ) : (
                                item.price
                            )}
                        </td>
                        <td>
                            {editingOrderId === item._id ? (
                                <input
                                    type="text"
                                    value={item.amount}
                                    onChange={(e) => handleEditChange("amount", e.target.value)}
                                    className="form-control"
                                />
                            ) : (
                                item.amount
                            )}
                        </td>
                        <td>
                            {editingOrderId === item._id ? (
                                <button className="save-but" onClick={() => handleSaveEdit(item._id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                         className="bi bi-check2" viewBox="0 0 16 16">
                                        <path
                                            d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                                    </svg>
                                </button>
                            ) : (
                                <button key={`edit-${item._id}`} className="edit-but" onClick={() => handleEdit(item._id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                         className="bi bi-pen" viewBox="0 0 16 16">
                                        <path
                                            d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                                    </svg>
                                </button>
                            )}
                            <button key={`delete-${item._id}`} className="del-but" onClick={() => handleDelete(item._id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-trash" viewBox="0 0 16 16">
                                    <path
                                        d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                    <path
                                        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                </svg>
                            </button>
                        </td>
                    </tr>
                ))}
                <tr>
                    <th scope="row">{orders.length + 1}</th>
                    <td>
                        <input
                            type="text"
                            value={newOrder.name}
                            onChange={(e) => setNewOrder({ ...newOrder, name: e.target.value })}
                            className="form-control mb-3"
                        />
                    </td>
                    <td>
                        <input
                            type="text"
                            value={newOrder.date}
                            onChange={(e) => setNewOrder({ ...newOrder, date: e.target.value })}
                            className="form-control mb-3"
                        />
                    </td>
                    <td>
                        <input
                            type="text"
                            value={newOrder.category}
                            onChange={(e) => setNewOrder({ ...newOrder, category: e.target.value })}
                            className="form-control mb-3"
                        />
                    </td>
                    <td>
                        <input
                            type="text"
                            value={newOrder.price}
                            onChange={(e) => setNewOrder({ ...newOrder, price: e.target.value })}
                            className="form-control mb-3"
                        />
                    </td>
                    <td>
                        <input
                            type="text"
                            value={newOrder.amount}
                            onChange={(e) => setNewOrder({ ...newOrder, amount: e.target.value })}
                            className="form-control mb-3"
                        />
                    </td>
                    <td>
                        <button className="add-but" onClick={handleAddNewOrder}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-check2" viewBox="0 0 16 16">
                                <path
                                    d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                            </svg>
                        </button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}
