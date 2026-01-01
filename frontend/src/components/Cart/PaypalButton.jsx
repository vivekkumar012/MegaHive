import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PaypalButton = ({amount, onSuccess, onError}) => {
  return (
    <PayPalScriptProvider
      options={{
        "client-id":
          "AT-mrXsJrkKdXz98vwDjGaWDHVpWq80WAvobsZwUqbQnF_g0JztGocnxThldvf6oETwRn8fvjZzmE-1p",
      }}
    >
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [{ amount: { value: amount } }],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then(onSuccess);
        }}
        onError={onError}
      />
    </PayPalScriptProvider>
  );
};

export default PaypalButton;
