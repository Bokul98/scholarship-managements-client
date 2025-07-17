import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import PropTypes from "prop-types";
import { useState } from "react";
import { createPaymentIntent } from "../../api/scholarshipApi";

const ScholarshipPayment = ({ amount, onPaymentSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState("");
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!stripe || !elements) {
            return;
        }

        // Debug logs
        console.log("Payment amount:", amount);
        if (!amount || amount <= 0) {
            setError("Invalid payment amount");
            return;
        }

        setProcessing(true);
        setError("");

        try {
            // Get payment intent
            console.log("Creating payment intent for amount:", amount);
            const { clientSecret } = await createPaymentIntent(amount);
            console.log("Got client secret:", clientSecret ? "Yes" : "No");

            // Confirm payment
            const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(
                clientSecret,
                {
                    payment_method: {
                        card: elements.getElement(CardElement),
                    },
                }
            );

            if (paymentError) {
                console.error("Payment error:", paymentError);
                setError(paymentError.message);
            } else if (paymentIntent.status === "succeeded") {
                console.log("Payment succeeded:", paymentIntent);
                onPaymentSuccess(paymentIntent);
            }
        } catch (err) {
            console.error("Payment failed:", err);
            setError("Payment failed. Please try again.");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
            <div className="mb-4">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: "16px",
                                color: "#424770",
                                "::placeholder": {
                                    color: "#aab7c4",
                                },
                            },
                            invalid: {
                                color: "#9e2146",
                            },
                        },
                    }}
                    className="p-3 border rounded-md"
                />
            </div>
            
            {error && (
                <div className="text-red-500 mb-4">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={!stripe || processing}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {processing ? "Processing..." : `Pay $${amount}`}
            </button>
        </form>
    );
};

ScholarshipPayment.propTypes = {
    amount: PropTypes.number.isRequired,
    onPaymentSuccess: PropTypes.func.isRequired,
};

export default ScholarshipPayment; 