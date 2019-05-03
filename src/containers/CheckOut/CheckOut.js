import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import ContactData from '../CheckOut/ContactData/ContactData';
import CheckOutSummary from '../../components/Order/CheckOutSummary/CheckOutSummary';
import * as actions from '../../store/actions/index';

class CheckOut extends React.Component {

 

    checkOutCancelledHandler = () => {
        this.props.history.goBack();
    }

    checkOutContinuedHandler = () => {
        this.props.history.replace('/checkout/contact-data')
    }

    render () {
        let summary = <Redirect to="/"/>
        if(this.props.ings) {
            const purchaseRedirect = this.props.purchased ? <Redirect to="/" /> : null;
            summary = (
                <div>
                    {purchaseRedirect}
                    <CheckOutSummary 
                        ingredients={this.props.ings}
                        checkOutCancelled={this.checkOutCancelledHandler}
                        checkOutContinued={this.checkOutContinuedHandler}/>
                    <Route 
                    path={this.props.match.path + '/contact-data'} 
                    component={ContactData} />
                </div>
            )
        }
        return summary;
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        purchased: state.order.purchased
    }
}


export default connect( mapStateToProps ) ( CheckOut );