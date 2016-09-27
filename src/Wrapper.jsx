import React from 'react'
import { connect } from 'react-redux'
import settings from './common/settings'
import SettingsModal, { open as openSettings } from './common/components/SettingsModal.jsx'
import CreditCheckModal, { open as openCreditCheck } from './Kiosk/components/CreditCheckModal.jsx'
import PreviousOrderModal, { open as openPreviousOrder } from './Kiosk/components/PreviousOrderModal.jsx'
import { NavItem, Icon } from 'react-materialize'
import PaymentModal from './Kiosk/components/PaymentModal.jsx'
import IngredientModal from './Kiosk/components/IngredientModal.jsx'
import SearchBar from './Kiosk/components/SearchBox.jsx'
import { NotificationContainer } from 'react-notifications'
import 'react-notifications/lib/notifications.css'
import { getAllKioskData } from './Kiosk/actions'

const Wrapper = React.createClass({
    propTypes: {
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.node),
            React.PropTypes.node
        ]),
        getInitialData: React.PropTypes.func.isRequired
    },

    componentDidMount: function () {
        const { getInitialData } = this.props
        var allSettings = settings.get()
        if (Object.getOwnPropertyNames(allSettings).length === 0) {
            console.log('Need sum config')
            openSettings()
        } else {
            getInitialData()
        }
    },
    render: function () {
        return (
            <div>
                <nav>
                    <div className='nav-wrapper'>
                        <a href='#!' className='brand-logo'>p0sX</a>
                        <ul className='left search-list hide-on-med-and-down'>
                            <li><SearchBar /></li>
                        </ul>
                        <ul className='right hide-on-med-and-down'>
                            <NavItem key='settings' onClick={openSettings} href='#'><Icon>settings</Icon></NavItem>
                            <NavItem key='undo' onClick={openPreviousOrder} href='#'>Previous order</NavItem>
                            <NavItem key='credit' onClick={openCreditCheck} href='#'>Credit check</NavItem>
                            <NavItem key='kiosk' href='#/'>Kiosk</NavItem>
                            <NavItem key='kitchen' href='#/kitchen'>Kitchen</NavItem>
                        </ul>
                    </div>
                </nav>
                {this.props.children}
                <IngredientModal />
                <SettingsModal />
                <PaymentModal />
                <NotificationContainer />
                <PreviousOrderModal />
                <CreditCheckModal />
            </div>
        )
    }
})

const mapStateToProps = () => {
    return {}
}

const mapDispatchToProps = (dispatch) => {
    return {
        getInitialData: () => dispatch(getAllKioskData())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Wrapper)
