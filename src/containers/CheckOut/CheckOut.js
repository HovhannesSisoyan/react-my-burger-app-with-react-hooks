import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import ContactData from '../CheckOut/ContactData/ContactData';
import CheckOutSummary from '../../components/Order/CheckOutSummary/CheckOutSummary';

class CheckOut extends React.Component {
 

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
                    ingredients={this.props.ings}
                    checkOutCancelled={this.checkOutCancelledHandler}
                    checkOutContinued={this.checkOutContinuedHandler}/>
                <Route 
                    path={this.props.match.path + '/contact-data'} 
                    component={ContactData} />
            </div>
        );
    }
}

const mapStateToProps =state => {
    return {
        ings: state.ingredients
    }
}

export default connect(mapStateToProps) (CheckOut);