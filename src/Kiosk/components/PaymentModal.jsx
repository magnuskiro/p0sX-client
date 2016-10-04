import React from 'react'
import { connect } from 'react-redux'
import { setPaymentState, postPurchase, applyDiscounts, removeDiscounts } from '../actions'
import { getTotalPriceOfCart, getLoggedInCashier } from '../selectors'
import { PAYMENT_METHOD } from '../../common/api'
import { NotificationManager } from 'react-notifications'

class PaymentModal extends React.Component {
    static propTypes = {
        onPurchase: React.PropTypes.func.isRequired,
        paymentState: React.PropTypes.number.isRequired,
        selectMethod: React.PropTypes.func.isRequired,
        onBack: React.PropTypes.func.isRequired,
        onClose: React.PropTypes.func.isRequired,
        total: React.PropTypes.number.isRequired,
        cashierCard: React.PropTypes.string.isRequired
    }

    renderPaymentSelect () {
        const { selectMethod } = this.props
        return (
            <div className='modal-content'>
                <h4>Choose payment option</h4>
                <div onClick={selectMethod} data-method={PAYMENT_METHOD.CASH} className='item-card z-depth-1 hoverable waves-effect'>
                    <h5>Cash</h5>
                    <i className='fa fa-money payment-glyph' aria-hidden='true' />
                </div>
                <div onClick={selectMethod} data-method={PAYMENT_METHOD.CREW} className='item-card z-depth-1 hoverable waves-effect'>
                    <h5>Crew</h5>
                    <i className='fa fa-credit-card payment-glyph' aria-hidden='true' />
                </div>
            </div>
        )
    }

    renderCrew () {
        const { total, onBack } = this.props
        return (
            <div className='modal-content'>
                <h4><i onClick={onBack} className='link fa fa-arrow-circle-o-left' aria-hidden='true' /> Scan badge to pay {total}Kr.</h4>
                <div className='row'>
                    <div className='input-field col s12'>
                        <input onKeyUp={this.onEnter} ref='rfid' id='rfid' type='text' required className='validate' />
                        <label className='active' htmlFor='rfid'>Badge number</label>
                    </div>
                    <div className='input-field col s12'>
                        <input onKeyUp={this.onEnter} ref='message' id='message' type='text' required maxLength='64' className='validate' />
                        <label htmlFor='message'>Message for the kitchen</label>
                    </div>
                    <button className='btn btn-large waves-effect waves-light' onClick={this.purchaseCrew}>
                        Purchase
                    </button>
                </div>
            </div>
        )
    }

    renderCash () {
        const { total, onBack } = this.props
        return (
            <div className='modal-content'>
                <h4><i onClick={onBack} className='link fa fa-arrow-circle-o-left' aria-hidden='true' /> Please pay {total}Kr.</h4>
                <div className='row'>
                    <div className='col s6'>
                        <div className='input-field col s12'>
                            <input onKeyUp={this.onEnter} ref='amount' id='amount' type='number' required min={total} className='validate' />
                            <label className='active' htmlFor='amount'>Amount received</label>
                        </div>
                        <div className='input-field col s12'>
                            <input onKeyUp={this.onEnter} ref='message' id='message' type='text' required maxLength='64' className='validate' />
                            <label htmlFor='message'>Message for the kitchen</label>
                        </div>
                    </div>

                    <div className='col s6'>
                        <div className='numpad-container'>
                            <div className='numpad'>
                                <div onClick={this.numpadClick} className='button'>1</div>
                                <div onClick={this.numpadClick} className='button'>2</div>
                                <div onClick={this.numpadClick} className='button'>3</div>
                                <div onClick={this.numpadClick} className='button'>4</div>
                                <div onClick={this.numpadClick} className='button'>5</div>
                                <div onClick={this.numpadClick} className='button'>6</div>
                                <div onClick={this.numpadClick} className='button'>7</div>
                                <div onClick={this.numpadClick} className='button'>8</div>
                                <div onClick={this.numpadClick} className='button'>9</div>
                                <div onClick={this.numpadClick} className='button'>0</div>
                                <div onClick={this.numpadClick} className='button'>Back</div>
                            </div>
                        </div>
                    </div>
                    <button className='btn btn-large waves-effect waves-light' onClick={this.purchaseCash}>
                        Purchase
                    </button>
                </div>
            </div>
        )
    }

    numpadClick = (e) => {
        var amount = $('#amount')
        if (e.target.innerHTML === 'Back') {
            amount.val(amount.val().slice(0, -1))
        } else {
            amount.val(amount.val() + e.target.innerHTML)
        }
        // eslint-disable-next-line no-undef
        Materialize.updateTextFields()
    }

    onEnter = (e) => {
        if (e.keyCode === 13) {
            const { paymentState } = this.props
            switch (paymentState) {
            case PAYMENT_METHOD.CREW:
                this.purchaseCrew()
                break
            case PAYMENT_METHOD.CASH:
                this.purchaseCash()
                break
            default:
                break
            }
        }
    }

    purchaseCrew = (e) => {
        e.target.onClick = undefined
        const { onPurchase, total, cashierCard } = this.props
        const { value, validity } = this.refs.rfid
        const message = this.refs.message.value

        if (validity.valid) {
            const purchase = {
                payment_method: PAYMENT_METHOD.CREW,
                total: total,
                card: value,
                message: message,
                cashier_card: cashierCard
            }
            onPurchase(purchase)
        }
    }

    purchaseCash = (e) => {
        e.target.onClick = undefined
        const { onPurchase, total, cashierCard } = this.props
        const { validity, value } = this.refs.amount
        const message = this.refs.message.value

        if (validity.valid) {
            const purchase = {
                payment_method: PAYMENT_METHOD.CASH,
                total: total,
                amountReceived: value,
                message: message,
                cashier_card: cashierCard

            }
            onPurchase(purchase)
        } else {
            NotificationManager.error(`${value} is not enough, need ${total - value} more`, 'Need more coinz', 3000)
        }
    }

    componentDidUpdate () {
        const { paymentState } = this.props
        if (paymentState === PAYMENT_METHOD.CREW) {
            this.refs.rfid.focus()
        } else if (paymentState === PAYMENT_METHOD.CASH) {
            this.refs.amount.focus()
        }
    }

    renderContent (state) {
        switch (state) {
        case PAYMENT_METHOD.SELECT:
            return this.renderPaymentSelect()
        case PAYMENT_METHOD.CREW:
            return this.renderCrew()
        case PAYMENT_METHOD.CASH:
            return this.renderCash()
        default:
            return this.renderPaymentSelect()
        }
    }

    render () {
        const { paymentState, onClose } = this.props
        return (
            <div id='payment-modal' className='modal modal-fixed-footer'>
                {this.renderContent(paymentState)}
                <div className='modal-footer'>
                    <a href='#!' onClick={onClose} className='waves-effect waves-red btn-flat'>Cancel</a>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        paymentState: state.payment.get('state'),
        total: getTotalPriceOfCart(state),
        cashierCard: getLoggedInCashier(state).get('card')
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onPurchase: (options) => {
            dispatch(postPurchase(options))
        },
        selectMethod: (e) => {
            const method = parseInt(e.target.dataset.method)
            dispatch(setPaymentState(method))
            dispatch(applyDiscounts(method))
        },
        onBack: () => {
            dispatch(setPaymentState(PAYMENT_METHOD.SELECT))
            dispatch(removeDiscounts())
        },
        onClose: () => {
            dispatch(setPaymentState(PAYMENT_METHOD.SELECT))
            dispatch(removeDiscounts())
            close()
        }
    }
}

const open = () => {
    $('#payment-modal').openModal({dismissible: false})
}

const close = () => {
    $('#payment-modal').closeModal()
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PaymentModal)

export {
    open,
    close
}
