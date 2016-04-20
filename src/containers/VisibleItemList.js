import { connect } from 'react-redux'
import { addToCart, setInitialData, openModal } from '../actions'
import ItemList from '../components/ItemList.jsx'

const getVisibleItems = (items, category) => {
    if (category === 0) {
        return items
    } else {
        return items.filter((i) => i.category === category)
    }
}

const mapStateToProps = (state) => {
    return {
        items: getVisibleItems(state.items, state.selectedCategory)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        // eslint-disable-next-line camelcase
        onItemClick: (item, can_have_ingredients) => {
            // eslint-disable-next-line camelcase
            if (can_have_ingredients) {
                $('#ingredient-modal').openModal()
                dispatch(openModal(item))
            } else {
                dispatch(addToCart(item))
            }
        },
        getInitialData: () => {
            dispatch(setInitialData())
        }
    }
}

const VisibleItemList = connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemList)

export default VisibleItemList