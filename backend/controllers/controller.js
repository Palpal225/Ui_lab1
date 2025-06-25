const connection = require('../db/db');
const Order = require("../models/order");

exports.signUp = (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    console.log('Received data:', { username, email, password });

    connection.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (selectError, selectResults) => {
            if (selectError) {
                console.error('Error selecting from database:', selectError);
                return res.status(500).json({ error: 'Internal Server Error - Select' });
            }

            if (selectResults.length > 0) {
                return res.status(400).json({ error: 'Cannot create a new user. Email already used.' });
            }

            connection.query(
                'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                [username, email, password],
                (insertError, insertResult) => {
                    if (insertError) {
                        console.error('Error inserting into database:', insertError);
                        return res.status(500).json({ error: 'Internal Server Error - Insert' });
                    }

                    console.log('User created:', insertResult);
                    return res.status(200).json({ message: 'User created successfully!' });
                }
            );
        }
    );
};

exports.logIn = (req, res) => {
    const {email, password} = req.body;

    connection.query(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [email, password],
        (err, rows) => {
            if (err) {
                console.error('Error selecting from database:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            if (rows.length > 0) {
                const userData = {
                    email: rows[0].email,
                };
                res.status(200).json({message: 'Success logging', user: userData});
            } else {
                res.status(400).json({error: 'Incorrect login or password'});
            }
        }
    );
};

exports.getUserData = (req, res) => {
    const email = req.query.user;

    connection.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (err, rows) => {
            if (err) {
                console.error('Error selecting from database:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            if (rows.length > 0) {
                const userData = {
                    username: rows[0].username,
                    email: rows[0].email,
                    password: rows[0].password,
                    photo: rows[0].photo ? rows[0].photo.toString('base64') : null,
                    mimetype: rows[0].mimetype,
                };
                res.status(200).json({message: 'Success', user: userData});
            } else {
                res.status(400).json({error: 'Data not found'});
            }
        }
    );
};


exports.changeUsername = (req, res) => {
    const {email, username} = req.body;

    connection.query(
        'UPDATE users SET username = ? WHERE email = ?',
        [username, email],
        (err, updateResult) => {
            if (err) {
                console.error('Error updating username:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            if (updateResult.affectedRows > 0) {
                res.status(200).json({message: 'Username successfully updated'});
            } else {
                res.status(404).json({error: 'User not found'});
            }
        }
    );
};

exports.changePassword = (req, res) => {
    const {email, password} = req.body;

    connection.query(
        'UPDATE users SET password = ? WHERE email = ?',
        [password, email],
        (err, updateResult) => {
            if (err) {
                console.error('Error updating password:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            if (updateResult.affectedRows > 0) {
                res.status(200).json({message: 'Password successfully updated'});
            } else {
                res.status(404).json({error: 'User not found'});
            }
        }
    );
};

exports.changePhoto = (req, res) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png'];

    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const {email} = req.body;

    const photoBuffer = req.file.buffer;
    const mimetype = req.file.mimetype;

    if (!allowedMimeTypes.includes(mimetype)) {
        return res.status(400).json({ message: 'Invalid file type. Allowed types: jpeg, png' });
    }

    connection.query(
        'UPDATE users SET photo = ?, mimetype = ? WHERE email = ?',
        [photoBuffer, mimetype, email],
        (err, updateResult) => {
            if (err) {
                console.error('Error updating photo:', err);
                return res.status(500).send('Internal Server Error');
            }

            if (updateResult.affectedRows > 0) {
                res.status(200).json({message: 'Photo successfully updated', data: {
                        photo: photoBuffer.toString('base64'), mimetype: mimetype
                    }});
            } else {
                res.status(404).json({error: 'User not found'});
            }
        }
    );
};

exports.deletePhoto = (req, res) => {

    const {photo, mimetype, email} = req.body;

    connection.query(
        'UPDATE users SET photo = ?, mimetype = ? WHERE email = ?',
        [photo, mimetype, email],
        (err, updateResult) => {
            if (err) {
                console.error('Error deleting photo:', err);
                return res.status(500).send('Internal Server Error');
            }

            if (updateResult.affectedRows > 0) {
                res.status(200).json({message: 'Photo successfully deleted'});
            } else {
                res.status(404).json({error: 'User not found'});
            }
        }
    );
};

exports.getOrders = async (req, res) => {
    const userEmail = req.query.user;

    if (!userEmail) {
        return res.status(400).json({message: "Email is not specified"});
    }

    try {
        const orders = await Order.find({user: userEmail}).exec();
        res.json({userEmail, orders});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


exports.createOrder = async (req, res) => {
    const {name, date, category, price, amount, user} = req.body;

    try {
        const newOrder = await Order.create({
            name,
            date,
            category,
            price,
            amount,
            user
        });
        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};


exports.updateOrder = async (req, res) => {
    const orderId = req.params.id;
    const {name, date, category, price, amount, user} = req.body;

    try {
        const updatedOrder = await Order.updateOne(
            {_id: orderId},
            {
                name,
                date,
                category,
                price,
                amount,
                user
            }
        );
        res.status(201).json(updatedOrder);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


exports.removeOrder = async (req, res) => {
    const orderId = req.params.id;

    try {
        const deletedOrder = await Order.findOneAndDelete({_id: orderId}).exec();

        if (!deletedOrder) {
            return res.status(404).json({message: "Order not found"});
        }

        res.json({message: "The order was successfully deleted", deletedOrder});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: error.message});
    }
};