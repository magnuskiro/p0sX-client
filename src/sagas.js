import { fork } from 'redux-saga/effects'
import { watchKioskData, watchItems, watchCategories, watchPostPurchase, watchApplyDiscounts, watchDiscounts, watchUndoOrders, watchGetCreditForCrew } from './Kiosk/sagas'

export default function * root () {
    yield [
        fork(watchKioskData),
        fork(watchItems),
        fork(watchCategories),
        fork(watchDiscounts),
        watchPostPurchase(),
        watchApplyDiscounts(),
        watchUndoOrders(),
        watchGetCreditForCrew()
    ]
}
