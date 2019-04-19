import React from 'react';
import CheckOutSummary from '../../components/Order/CheckOutSummary/CheckOutSummary';
import { Route } from 'react-router-dom';
import ContactData from '../CheckOut/ContactData/ContactData';

class CheckOut extends React.Component {
    state = {
        ingredients: null,
        totalPrice: 0
    }

    componentWillMount() {
        const query = new URLSearchParams(this.props.location.search);
        const ingredients = {};
        let price = 0;
        for (let param of query.entries()) {
            if(param[0] === 'price') {
                price = param[1];
            } else {
                ingredients[param[0]] = + param[1];

            }
        }
        this.setState({ ingredients: ingredients, totalPrice: price })
    }

    checkOutCancelledHandler = () => {
        this.props.history.goBack();
    }

    checkOutContinuedHandler = () => {
        this.props.history.replace('/checkout/contact-data')
    }

    render () {
        return (
            <div>
                <CheckOutSummary 
                    ingredients={this.state.ingredients}
                    checkOutCancelled={this.checkOutCancelledHandler}
                    checkOutContinued={this.checkOutContinuedHandler}/>
                <Route 
                    path={this.props.match.path + '/contact-data'} 
                    render={() => <ContactData 
                                    ingredients={this.state.ingredients}
                                    price={this.state.totalPrice}
                                    {...this.props}/>} />
            </div>
        );
    }
}

export default CheckOut;