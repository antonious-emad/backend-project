const stripe = require('../config/stripeConfig');
const Cart = require('../models/cart');
const Order = require('../models/order');
const Item = require('../models/menu'); // Make sure to import your Item model

exports.getCheckoutSession = async (req, res) => {
    try {
        console.log('Checkout session initiated');
        const user = res.locals.user;
        
        if (!user) {
            throw new Error('User not authenticated');
        }

        // Get cart without populating (since schema doesn't support it)
        const cart = await Cart.findOne({ userId: user._id });
        
        if (!cart || cart.items.length === 0) {
            return res.redirect('/cart');
        }

        // Get all item details separately
        const itemIds = cart.items.map(item => item.itemId);
        const items = await Item.find({ itemId: { $in: itemIds } });

        // Create a map for quick lookup
        const itemMap = {};
        items.forEach(item => {
            itemMap[item.itemId] = item;
        });

        // Convert cart items to Stripe line items
        const line_items = cart.items.map(cartItem => {
            const item = itemMap[cartItem.itemId];
            if (!item) {
                throw new Error(`Item with ID ${cartItem.itemId} not found`);
            }

            const unitAmount = Math.round(Number(item.price) * 100);
            
            if (isNaN(unitAmount)) {
                throw new Error(`Invalid price for item: ${item.name}`);
            }

            return {
                price_data: {
                    currency: 'egp',
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: unitAmount,
                },
                quantity: cartItem.qty,
            };
        });

        // Add delivery charge
        const deliveryAmount = Math.round(30 * 100);
        line_items.push({
            price_data: {
                currency: 'egp',
                product_data: {
                    name: 'Delivery Charge',
                },
                unit_amount: deliveryAmount,
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            customer_email: user.email,
            metadata: {
                userId: user._id.toString(),
            },
            success_url: `${process.env.BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.BASE_URL}/cart`,
        });

        res.redirect(303, session.url);
    } catch (error) {
        console.error('Stripe checkout error:', error);
        res.redirect('/cart?error=payment_failed');
    }
};

exports.handlePaymentSuccess = async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
        const user = res.locals.user;
        
        if (session.payment_status === 'paid') {
            // Get cart and items separately
            const cart = await Cart.findOne({ userId: user._id });
            const itemIds = cart.items.map(item => item.itemId);
            const items = await Item.find({ itemId: { $in: itemIds } });
            const itemMap = {};
            items.forEach(item => {
                itemMap[item.itemId] = item;
            });

            // Calculate totals
            const subTotal = cart.items.reduce((sum, cartItem) => {
                const item = itemMap[cartItem.itemId];
                return sum + (item?.price || 0) * cartItem.qty;
            }, 0);
            
            const deliveryCharge = 30; // Assuming fixed delivery charge
            const tax = subTotal * 0.14; // Assuming 14% tax
            const grandTotal = subTotal + deliveryCharge + tax;

            // Create order with all required fields
            const order = new Order({
                userId: user._id,
                items: cart.items.map(cartItem => ({
                    itemId: cartItem.itemId,
                    itemName: itemMap[cartItem.itemId]?.name || 'Unknown Item',
                    itemPrice: itemMap[cartItem.itemId]?.price || 0,
                    itemQty: cartItem.qty,
                    itemServe: 'regular' // Default value or get from cart
                })),
                bill: {
                    subTotal,
                    deliveryCharge,
                    tax,
                    grandTotal
                },
                totalAmount: session.amount_total / 100,
                paymentId: session.payment_intent,
                address: user.address,
                status: 'paid'
            });
            
            await order.save();
            
            // Clear cart
            await Cart.deleteOne({ userId: user._id });
            
            return res.redirect('/orders?payment=success');
        }
        
        res.redirect('/cart?payment=failed');
    } catch (error) {
        console.error('Payment success handling error:', error);
        res.redirect('/cart?error=payment_verification_failed');
    }
};