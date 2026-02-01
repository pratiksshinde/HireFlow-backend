const Razorpay = require("razorpay");
const crypto = require("crypto");
const { User } = require("../models");
const { verify } = require("jsonwebtoken");

const initiatePayment = async (req, res) => {
  try {
    const { plan, currency } = req.body;

    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const PLAN_PRICES = {
        Student: 99,
        Fresher: 199,
        Experienced: 499
        };
    
        const amount = PLAN_PRICES[plan];

    const options = {
        amount: amount*100,
        currency,
        receipt: "Receipt"+req.user.id 
    }
    const order = await razorpay.orders.create(options);

    if(!order){
        return res.status(500).json({ message: "Failed to create order" });
    }
    return res.status(201).json({    
        message: "Order created successfully",
        order
    });

  } catch (error) {
    console.error(error?.response?.data || error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    try {
        const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                            .update(sign.toString())
                            .digest('hex');

    if(expectedSign !== razorpay_signature){
        return res.status(400).json({ message: "Payment Verificaiton Failed!" });
    } 


    await User.update({subscriptionStatus: "PRIME"}, {where: {id: req.user.id}});

    return res.status(200).json({ message: "Payment Verified Successfully!" }); 
    } catch (error) {
        console.error(error?.response?.data || error.message);
        return res.status(500).json({ message: "Server error" });
    }
    
}   

const fetchPayments = async (req, res) => {
    const { payment_id } = req.params;
    try{
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const payments = await razorpay.payments.fetch({ payment_id })
        if(!payments){
            return res.status(404).json({ message: "No payments found" });
        }
        return res.status(200).json({
            message: "Payment fetched successfully",
            payments
        });
    }catch(error){
        console.error(error?.response?.data || error.message);
        return res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    initiatePayment,
    fetchPayments,
    verifyPayment
};