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
            ingredients: null,
            totalPrice: 4,
            purchaseable: false,
            purchasing: false,
            loading: false,
            error: false

        }

        componentDidMount () {
            axios.get('https://react-my-burger-4b3b3.firebaseio.com/ingredients.json')
                .then(response => {
                    this.setState({ ingredients: response.data }); 
                })
                .catch(error => { this.setState({ error: true }) });
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
            this.setState({ purchasing: true })
        }

        purchaseCancelHandler = () =>{
            this.setState({ purchasing: false })
        }

        purchaiseContinueHandler = () => {
            //alert('You bought the burger!')
           

                const queryParams = [];
                for (let i in this.state.ingredients) {
                    queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
                }
                queryParams.push('price=' + this.state.totalPrice); 
                const queryString = queryParams.join('&');
                this.props.history.push ({
                    pathname :'/checkout',
                    search: '?' + queryString

                });

        }

        render() {
            const disableInfo = {
                ...this.state.ingredients
            };
            for (let key in disableInfo) {
                disableInfo[key] = disableInfo[key] <= 0;
            }

            let orderSummary = null;
            let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner/>
            
            if (this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disableInfo}
                        price={this.state.totalPrice}
                        purchaseable={this.state.purchaseable}
                        ordered={this.purchaseHandler}
                    />
                </Aux>
                );
                orderSummary = (
                    <OrderSummary
                        ingredients={this.state.ingredients}
                        purchaseCancelled={this.purchaseCancelHandler}
                        purchaseContinued={this.purchaiseContinueHandler}
                        price={this.state.totalPrice} 
                    />
                );
                if(this.state.loading) {
                    orderSummary = <Spinner/>;
                }
            }
            return (
                <React.Fragment>
                    <Modal  show={this.state.purchasing} 
                            modalClosed={this.purchaiseCancelHandler}>
                        {orderSummary}
                    </Modal>
                    {burger}
                </React.Fragment>
            );
        }
    }

    export default WithErrorHandler(BurgerBuilder, axios);