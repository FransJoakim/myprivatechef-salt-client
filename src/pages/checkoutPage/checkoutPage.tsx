import CheckoutButton from "../../components/checkoutButton/CheckoutButton";
import { useAppSelector } from "../../features/hooks";
import { updateShoppingList } from "../../features/cart/cartSlice";
import { changeModalShowState } from "../../features/modal/modalSlice";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import OrderCard from "../../components/orderCard/orderCard";
import HeroSub from "../../components/header/HeroSub";
import Button from "../../components/button/Button";
import "./checkoutPage.scss";
function CheckoutPage() {
  const cart = useAppSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [displaySn, setDisplaySn] = useState(false);
  const [display, setDisplay] = useState(true);

  const shoppingList: Ingre[] = [];

  useEffect(() => {
    cart.dishes.forEach((el) => {
      el.ingredients.forEach((e) => {
        shoppingList.push({
          name: e.name,
          quantity: e.quantity * el.serving,
          unit: e.unit,
        });
      });
    });

    let ingredientsSummary: Ingre[] = [];

    const convertUnits = () => {
      ingredientsSummary.forEach((el) => {
        switch (el.unit) {
          case "gr":
            if (el.quantity >= 1000) {
              el.quantity = el.quantity / 1000;
              el.unit = "kg";
            }
            break;
          case "ml":
            if (el.quantity >= 1000) {
              el.quantity = el.quantity / 1000;
              el.unit = "Liter";
            }
            break;
        }
      });
    };

    ingredientsSummary = shoppingList.reduce(
      (ingredients: Ingre[], currentIngre) => {
        const index = ingredients.findIndex(
          (v) => v.name === currentIngre.name
        );
        if (index === -1) {
          ingredients.push(currentIngre);
        } else {
          const newIngre = {
            ...currentIngre,
            quantity: ingredients[index].quantity + currentIngre.quantity,
          };
          ingredients[index] = newIngre;
        }
        return ingredients;
      },
      []
    );

    convertUnits();
    dispatch(updateShoppingList(ingredientsSummary));
  }, []);

  console.log("check page", cart);

  return (
    <>
      <HeroSub title={"Checkout"} />
      <OrderCard
        name={cart.chef.name}
        time={cart.totalhours}
        date={cart.date}
        price={cart.totalPrice}
        shopping={cart.shoppingList}
        dishes={cart.dishes}
      />
      <div className="checkout-button-container">
        <div
          className="checkout-button-container__btn"
          style={{ display: displaySn ? "none" : "block" }}
        >
          <Button
            className="Btn"
            btnText="Log in"
            bgColor="#f9fcf2"
            hoverColor="#dbeeb7"
            txtColor="#6B7755"
            disabled={false}
            handleClick={() => {
              setDisplaySn(true);
              setDisplay(false);
              dispatch(
                changeModalShowState({
                  show: true,
                  type: "login",
                })
              );
            }}
          />
        </div>
        <div
          className="checkout-button-container__btn"
          style={{ display: displaySn ? "none" : "block" }}
        >
          <Button
            className="Btn"
            btnText="Sign up"
            bgColor="#f9fcf2"
            hoverColor="#dbeeb7"
            txtColor="#6B7755"
            disabled={false}
            handleClick={() => {
              setDisplaySn(true);
              setDisplay(false);
              dispatch(
                changeModalShowState({
                  show: true,
                  type: "signup",
                })
              );
            }}
          />
        </div>
      </div>
      <div
        className="checkout-button-container__btn checkout"
        style={{ display: display ? "none" : "block" }}
      >
        <CheckoutButton />
      </div>
    </>
  );
}

export default CheckoutPage;
