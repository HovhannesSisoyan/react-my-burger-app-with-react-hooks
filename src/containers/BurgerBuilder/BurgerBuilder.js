    import React from 'react';
    import { connect } from 'react-redux';
    import Aux from '../../hoc/Aux/Aux';
    import Burger from '../../components/Burger/Burger';
    import BuildControls from '../../components/Burger/BuildControls/BuildControls';
    import Modal from '../../components/UI/Modal/Modal';
    import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
    import axios from '../../axios-orders';
    import WithErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';
    import Spinner from '../../components/UI/Spinner/Spinner';
    import * as burgerBuilderActions from '../../store/actions/index';




  

    class BurgerBuilder extends React.Component {

        state = {
            purchasing: false
        }

        componentDidMount () {
            this.props.onInitIngredients();
          /*  axios.get('https://react-my-burger-4b3b3.firebaseio.com/ingredients.json')
                .then(response => {
                    this.setState({ ingredients: response.data }); 
                })
                .catch(error => { this.setState({ error: true }) });
            */}

        updatePurchaseState (ingredients) {
            const sum = Object.keys(ingredients)
                .map(igKey => {
                    return ingredients[igKey];
                })
                .reduce((sum, el) => {
                    return sum + el;
                }, 0)
            return sum > 0;
        }
       /*
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
        }*/
       
       /* removeIngredientHandler = (type) => {
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
        }*/

        purchaseHandler = () => {
            this.setState({ purchasing: true })
        }

        purchaseCancelHandler = () =>{
            this.setState({ purchasing: false })
        }

        purchaiseContinueHandler = () => {
            this.props.history.push('./checkout');
        }

        render() {
            console.log('props = '+this.props)
            const disableInfo = {
                ...this.props.ings
            };
            for (let key in disableInfo) {
                disableInfo[key] = disableInfo[key] <= 0;
            }

            let orderSummary = null;
            let burger = this.props.error ? <p>Ingredients can't be loaded!</p> : <Spinner/>
            
            if (this.props.ings) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings}/>
                    <BuildControls
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disabled={disableInfo}
                        price={this.props.price}
                        purchaseable={this.updatePurchaseState(this.props.ings)}
                        ordered={this.purchaseHandler}
                    />
                </Aux>
                );
                orderSummary = (
                    <OrderSummary
                        ingredients={this.props.ings}
                        purchaseCancelled={this.purchaseCancelHandler}
                        purchaseContinued={this.purchaiseContinueHandler}
                        price={this.props.price} 
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

    const mapStateToProps = state => {
        return {
            ings: state.burgerBuilder.ingredients,
            price: state.burgerBuilder.totalPrice,
            error: state.burgerBuilder.error
        };
    }

    const mapDispatchToProps = dispatch => {
        return {
            onIngredientAdded: (ingName) => dispatch(burgerBuilderActions.addIngredient(ingName)),
            onIngredientRemoved: (ingName) => dispatch(burgerBuilderActions.removeIngredient(ingName)),
            onInitIngredients: () => dispatch(burgerBuilderActions.initIngredients())
        }
    }

    export default connect(mapStateToProps, mapDispatchToProps)(WithErrorHandler(BurgerBuilder, axios));