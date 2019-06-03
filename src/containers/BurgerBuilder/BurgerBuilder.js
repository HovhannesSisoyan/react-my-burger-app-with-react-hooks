import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import WithErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';

const BurgerBuilder = props => {
    
    const [purchasing, setPurchasing] = useState(false);

    const updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0)
        return sum > 0;
    };

    useEffect(() => {
        props.onInitIngredients(); 
    },[])

   
    const purchaseHandler = () => {
        if(props.isAuthenticated) {
            setPurchasing(true)
        } else {
            props.onSetRedirectPath('./checkout');
            props.history.push('./auth');
        }
    };

    const purchaseCancelHandler = () => {
        setPurchasing(false);
    };

    const purchaiseContinueHandler = () => {
        props.onInitPurchase();
        props.history.push('./checkout');
    };

        const disableInfo = {
            ...props.ings
        };
        for (let key in disableInfo) {
            disableInfo[key] = disableInfo[key] <= 0;
        }
        let orderSummary = null;
        let burger = props.error ? <p>Ingredients can't be loaded!</p> : <Spinner/>
        
        if (props.ings) {
        burger = (
            <Aux>
                <Burger ingredients={props.ings}/>
                <BuildControls
                    ingredientAdded={props.onIngredientAdded}
                    ingredientRemoved={props.onIngredientRemoved}
                    disabled={disableInfo}
                    price={props.price}
                    purchaseable={updatePurchaseState(props.ings)}
                    ordered={purchaseHandler}
                    isAuth={props.isAuthenticated}
                />
            </Aux>
            );
            orderSummary = (
                <OrderSummary
                    ingredients={props.ings}
                    purchaseCancelled={purchaseCancelHandler}
                    purchaseContinued={purchaiseContinueHandler}
                    price={props.price} 
                />
            );
        }
        
        return (
            <React.Fragment>
                <Modal  show={purchasing} 
                        modalClosed={purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </React.Fragment>
        );
    }

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch (actions.purchaseInit()),
        onSetRedirectPath: (path) => dispatch (actions.setAuthRedirectPath(path))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WithErrorHandler(BurgerBuilder, axios));
