const { Console } = require("console");
const express = require("express");
const Order = require("./Order");

const OrderState = Object.freeze({
  WELCOMING:   Symbol("welcoming"),
  CHOICE : Symbol("choice"),
  SIZE:   Symbol("size"),
  TOPPINGS:   Symbol("toppings"),
  DRINKS:  Symbol("drinks"),
  DESSERT: Symbol("dessert"),
  PAYMENT: Symbol("payment")
});

module.exports = class ShwarmaOrder extends Order{
    constructor(sNumber, sUrl){
        super(sNumber, sUrl);
        this.stateCur = OrderState.WELCOMING;
        this.sSize = "";
        this.sToppings = "";
        this.sDrinks = "";
        this.sItem = "shawarama";
        this.sDessert = "";
        this.sPrice = 0;
        this.sChoice = "";
        this.sTotalBill = 0;
        this.sRequiredTime = 0;
        this.Order = [];
        this.OrderEntry = [];
        this.TotalOrder = [];
    }
    handleInput(sInput){
        let aReturn = [];
        switch(this.stateCur){
          case OrderState.WELCOMING:
              this.stateCur = OrderState.CHOICE;
              aReturn.push("Welcome to Surbhi's Fastfood.");
              aReturn.push("What you would like to have 'Burger' Or 'Fries'");
              break;
          case OrderState.CHOICE:
              if(sInput.toLowerCase() != "burger" && sInput.toLowerCase() != "fries"){
                  this.stateCur = OrderState.CHOICE;
                  aReturn.push("We do not sell " + sInput);
                  aReturn.push("Do you want 'Burger' or 'Fries'?");
                  return aReturn;
              }
              this.stateCur = OrderState.SIZE;
              this.sChoice = sInput;
              if(this.sChoice.toLowerCase() == 'burger'){
                  aReturn.push("Burger comes in regular size only. ($6)");
                  this.sSize = "Regular Size";
                  this.sRequiredTime = this.sRequiredTime + 7;
                  this.sPrice = 6;
                  this.sTotalBill = this.sTotalBill + 6;
                  this.stateCur = OrderState.TOPPINGS;
                  aReturn.push("What type of burger you would like to have? 'Chicken' or 'Vegetarian'");
              }else{
                  aReturn.push("1. Small Size :- $4");
                  aReturn.push("2. Regular Size :- $5");
                  aReturn.push("3. Large Size :- $6");
                  aReturn.push(`What size ${this.sChoice} would you like?`);
                  this.sRequiredTime = this.sRequiredTime + 10;
              }
              break;
          case OrderState.SIZE:
              if(sInput.toLowerCase() != "1" && sInput.toLowerCase() != "2" && sInput.toLowerCase() != "3" && 
              sInput.toLowerCase() != "regular" && sInput.toLowerCase() != "small" && sInput.toLowerCase() != "large" &&
              sInput.toLowerCase() != "regular size" && sInput.toLowerCase() != "small size" && sInput.toLowerCase() != "large size"){
                  aReturn.push("Please Select Valid Size!");
                  aReturn.push("1. Small Size :- $4");
                  aReturn.push("2. Regular Size :- $5");
                  aReturn.push("3. Large Size :- $6");
                  aReturn.push(`What size ${this.sChoice} would you like?`);
                  this.stateCur = OrderState.SIZE;
              }
              else{
                  this.stateCur = OrderState.TOPPINGS;
                  this.sSize = sInput;
                  if(this.sSize == "1" || this.sSize == "small" || this.sSize == "small size"){
                      this.sSize = "Small Size";
                      this.sTotalBill = this.sTotalBill + 4;
                      this.sPrice = 4;
                  }else if(this.sSize == "2" || this.sSize == "regular" || this.sSize == "regular size"){
                      this.sSize = "Regular Size";
                      this.sPrice = 5;
                      this.sTotalBill = this.sTotalBill + 5;
                  }else if(this.sSize == "3" || this.sSize == "large" || this.sSize == "large size"){
                      this.sSize = "Large Size";
                      this.sTotalBill = this.sTotalBill + 6;
                      this.sPrice = 6;
                  }
                  this.sRequiredTime = this.sRequiredTime + 10;
                  aReturn.push(`What sauce Would You Like With Your ${this.sChoice}?`);
              }
              break;
          case OrderState.TOPPINGS:
              this.stateCur = OrderState.DRINKS;
              this.sToppings = sInput;
              aReturn.push("Would you like any drinks with that?");
              break;
          case OrderState.DRINKS:
              this.stateCur = OrderState.DESSERT;
              if(sInput.toLowerCase() != "no"){
                  this.sDrinks = sInput;
                  this.sTotalBill = this.sTotalBill + 3;
              }else{
                  this.sDrinks = "-";
              }
              aReturn.push("Would you like Dessert with that?");
              break;
          case OrderState.DESSERT:
              if(sInput.toLowerCase() != "no"){
                  this.sDessert = sInput;
                  this.sTotalBill = this.sTotalBill + 2;
              }else{
                  this.sDessert = "-"; 
              }
              this.Order.push(this.sChoice);
              this.Order.push(this.sSize);
              this.Order.push(this.sToppings);
              this.Order.push(this.sDrinks);
              this.Order.push(this.sDessert);
              this.Order.push(this.sPrice);
              this.TotalOrder.push(this.Order);
              this.Order = [];
              this.sChoice = "";
              this.sSize = "";
              this.sToppings = "";
              this.sDrinks = "";
              this.sItem = "";
              this.sDessert = "";
              aReturn.push("Your Order Summary");
              for(var i =0; i<this.TotalOrder.length; i++){
                  aReturn.push("-----------------");
                  aReturn.push("Order Item :- " + (i+1));
                  aReturn.push("Item :- " + this.TotalOrder[i][0]);
                  aReturn.push("Size :- " + this.TotalOrder[i][1]);
                  aReturn.push("Sauce :- " + this.TotalOrder[i][2]);
                  aReturn.push("Drinks :- " + this.TotalOrder[i][3]);
                  aReturn.push("Dessert :- " + this.TotalOrder[i][4]);
                  aReturn.push("Price :- " + this.TotalOrder[i][5]);
              }
              this.TotalOrder = [];
              aReturn.push("-----------------");
              aReturn.push("Thank-you for your order");
              aReturn.push(`Your Order total is : ${this.sTotalBill} .`);
              this.nOrder = this.sTotalBill;
              aReturn.push(`Please pay for your order here`);
              aReturn.push(`${this.sUrl}/payment/${this.sNumber}/`);
              break;
          case OrderState.PAYMENT:
                console.log(sInput);
                this.isDone(true);
                let d = new Date();
                d.setMinutes(d.getMinutes() + 20);
                aReturn.push(`Your order will be delivered at ${d.toTimeString()}`);
              break;
        }
        return aReturn;
    }
    renderForm(sTitle = "-1", sAmount = "-1"){
      // your client id should be kept private
      if(sTitle != "-1"){
        this.sItem = sTitle;
      }
      if(sAmount != "-1"){
        this.nOrder = sAmount;
      }
      const sClientID = process.env.SB_CLIENT_ID || 'put your client id here for testing ... Make sure that you delete it before committing'
      return(`
      <!DOCTYPE html>
  
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- Ensures optimal rendering on mobile devices. -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <!-- Optimal Internet Explorer compatibility -->
      </head>
      
      <body>
        <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
        <script
          src="https://www.paypal.com/sdk/js?client-id=${sClientID}"> // Required. Replace SB_CLIENT_ID with your sandbox client ID.
        </script>
        Thank you ${this.sNumber} for your ${this.sItem} order of $${this.nOrder}.
        <div id="paypal-button-container"></div>
  
        <script>
          paypal.Buttons({
              createOrder: function(data, actions) {
                // This function sets up the details of the transaction, including the amount and line item details.
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: '${this.nOrder}'
                    }
                  }]
                });
              },
              onApprove: function(data, actions) {
                // This function captures the funds from the transaction.
                return actions.order.capture().then(function(details) {
                  // This function shows a transaction success message to your buyer.
                  $.post(".", details, ()=>{
                    window.open("", "_self");
                    window.close(); 
                  });
                });
              }
          
            }).render('#paypal-button-container');
          // This function displays Smart Payment Buttons on your web page.
        </script>
      
      </body>
          
      `);
  
    }
}