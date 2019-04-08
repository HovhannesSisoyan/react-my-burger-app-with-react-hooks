    import React from 'react';
    import Aux from '../../hoc/Aux/Aux';
    import Burger from '../../components/Burger/Burger';
    import BuildControls from '../../components/Burger/BuildControls/BuildControls';
    import Modal from '../../components/UI/Modal/Modal';
    import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
    import axios from '../../axios-orders';
    import WithErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';
    import Spinner from '../../components/UI/Spinner/Spinner';



    const INGREDIENT_PRICES = {
        salad: 0.5,
        cheese: 0.4,
        meat: 1.3,
        bacon: 0.7
    }

    class BurgerBuilder extends React.Component {

        state = {
            ingredients: {
                salad: 0,
                bacon: 0,
                cheese: 0,
                meat:  0
            },
            totalPrice: 4,
            purchaseable: false,
            purchaising: false,
            loading: false

        }

        updatePurchaseState (ingredients) {
            const sum = Object.keys(ingredients)
                .map(igKey => {
                    return ingredients[igKey];
                })
                .reduce((sum, el) => {
                    return sum + el;
                }, 0)
            this.setState ({ purchaseable: sum > 0 })
        }
       
        addIngredientHandler = (type) => {
            const oldCount = this.state.ingredients[type];
            const updatedCount = oldCount + 1;
            const updatedIngredients = {
                ...this.state.ingredients
            }
            updatedIngredients[type] = updatedCount;
            const priceAddition = INGREDIENT_PRICES[type];
            const oldPrice = this.state.totalPrice;
            const newPrice = oldPrice + priceAddition;
            this.setState({ ingredients: updatedIngredients, totalPrice: newPrice });
            this.updatePurchaseState(updatedIngredients);
        }
       
        removeIngredientHandler = (type) => {
            const oldCount = this.state.ingredients[type];
            if( oldCount <= 0 ) {
                return;
            }
            const updatedCount = oldCount - 1;
            const updatedIngredients = {
                ...this.state.ingredients
            }
            updatedIngredients[type] = updatedCount;
            const priceDeduction = INGREDIENT_PRICES[type];
            const oldPrice = this.state.totalPrice;
            const newPrice = oldPrice - priceDeduction;
            this.setState({ ingredients: updatedIngredients, totalPrice: newPrice });
            this.updatePurchaseState(updatedIngredients);
        }

        purchaseHandler = () => {
            this.setState({ purchaising: true })
        }

        purchaiseCancelHandler = () =>{
            this.setState({ purchaising: false })
        }

        purchaiseContinueHandler = () => {
            //alert('You bought the burger!')
            this.setState({ loading: true })
            const order = {
                ingredients: this.state.ingredients,
                price: this.state.totalprice,
                customer: {
                    name: 'Max',
                    address: {
                        street: 'testStreet',
                        zipCode: '123456',
                        country: 'Arm'
                    },
                    email: 'test@test.com'
                },
                deliveryMethod: 'fastest'
            }
            
            axios.post('/orders.json',order)
                .then(response => {
                    this.setState({ loading: false, purchasing: false });
                })
                .catch(error => {
                    this.setState({ loading: false, purchasing: false });
                });

        }

        render() {
            const disableInfo = {
                ...this.state.ingredients
            };
            for (let key in disableInfo) {
                disableInfo[key] = disableInfo[key] <= 0;
            }

            let orderSummary = <OrderSummary
                ingredients={this.state.ingredients}
                purchaseCancelled={this.purchaiseCancelHandler}
                purchaseContinued={this.purchaiseContinueHandler}
                price={this.state.totalPrice} />

            if(this.state.loading) {
                orderSummary = <Spinner/>;
            }
            return (
                <React.Fragment>
                    <Modal  show={this.state.purchaising} 
                            modalClosed={this.purchaiseCancelHandler}>
                        {orderSummary}
                    </Modal>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disableInfo}
                        price={this.state.totalPrice}
                        purchaseable={this.state.purchaseable}
                        ordered={this.purchaseHandler}
                    />
                </React.Fragment>
            );
        }
    }

    export default WithErrorHandler(BurgerBuilder, axios);