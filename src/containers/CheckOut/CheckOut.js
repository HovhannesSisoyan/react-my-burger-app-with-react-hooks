import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import ContactData from '../CheckOut/ContactData/ContactData';
import CheckOutSummary from '../../components/Order/CheckOutSummary/CheckOutSummary';

const CheckOut = props => {

    const checkOutCancelledHandler = () => {
        props.history.goBack();
    };

    const checkOutContinuedHandler = () => {
        props.history.replace('/checkout/contact-data')
    };

        let summary = <Redirect to="/"/>
        if(props.ings) {
            const purchaseRedirect = props.purchased ? <Redirect to="/" /> : null;
            summary = (
                <div>
                    {purchaseRedirect}
                    <CheckOutSummary 
                        ingredients={props.ings}
                        checkOutCancelled={checkOutCancelledHandler}
                        checkOutContinued={checkOutContinuedHandler}/>
                    <Route 
                    path={props.match.path + '/contact-data'} 
                    component={ContactData} />
                </div>
            )
        };
        return summary;
    };

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        purchased: state.order.purchased
    }
}


export default connect( mapStateToProps ) ( CheckOut );