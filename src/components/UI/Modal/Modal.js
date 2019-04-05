import React from 'react';
import classes from './Modal.css';
import Aux from '../../../hoc/Aux';
import Backdrop from '../Backdrop/Backdrop';

const Modal = (prpos) => (
    <Aux>
        <Backdrop show={prpos.show} clicked={prpos.modalClosed}/>
        <div className={classes.Modal}
            style={{
                transform: prpos.show ? 'translateY(0)' : 'translateY(-100vh)',
                opacity: prpos.show ? '1' : '0'
            }}>
            {prpos.children}
        </div>
    </Aux>
);

export default Modal;