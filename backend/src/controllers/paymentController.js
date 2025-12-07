const Order = require('../models/Order');

// @desc    Process Payment (Simulated)
// @route   POST /api/payment/checkout
// @access  Private
exports.processPayment = async (req, res) => {
    try {
        const { orderId, paymentMethod, paymentDetails } = req.body;

        const order = await Order.findByPk(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        // Check if user is owner
        if (order.customerId !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to pay for this order',
            });
        }

        if (order.paymentStatus === 'paid') {
            return res.status(400).json({
                success: false,
                message: 'Order is already paid',
            });
        }

        // Simulate Payment Processing
        // In real world, use Stripe/Midtrans SDK here
        const isSuccess = true; // Assume success for now

        if (isSuccess) {
            order.paymentStatus = 'paid';
            order.orderStatus = 'purchased'; // Move to purchased/confirmed
            order.paymentMethod = paymentMethod || order.paymentMethod;
            order.paymentProof = 'simulated_payment_id_' + Date.now();

            // Add to status history
            const history = order.statusHistory || [];
            history.push({
                status: 'purchased',
                note: 'Payment successful via ' + paymentMethod,
                timestamp: Date.now()
            });
            order.statusHistory = history;
            order.changed('statusHistory', true);

            await order.save();

            return res.status(200).json({
                success: true,
                message: 'Payment successful',
                data: order
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Payment failed',
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
