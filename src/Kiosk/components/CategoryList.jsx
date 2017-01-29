import React from 'react'
import { connect } from 'react-redux'
import { setActiveCategory } from '../actions'
import { getCategories, getSelectedCategory } from '../selectors'
import { List as ImmutableList } from 'immutable'
import {List, ListItem, makeSelectable} from 'material-ui/List'
import Divider from 'material-ui/Divider'

const SelectableList = makeSelectable(List)

class CategoryList extends React.Component {
    static propTypes = {
        categories: React.PropTypes.instanceOf(ImmutableList),
        onCategoryClick: React.PropTypes.func,
        selectedCategory: React.PropTypes.number
    }

    handleSelectionChange = (event, value) => {
        const {onCategoryClick, categories} = this.props
        onCategoryClick(categories.find(c => c.get('id') === value))
    }

    render () {
        const {categories, selectedCategory} = this.props
        return (
            <div className='col col-xs-2 col-sm-2 col-md-2 col-lg-2'>
                <SelectableList value={selectedCategory} onChange={this.handleSelectionChange}>
                    {categories.map((category) =>
                        [
                            <ListItem
                                key={category.get('id')}
                                primaryText={category.get('name')}
                                value={category.get('id')}
                            />,
                            <Divider />
                        ]
                    )}
                </SelectableList>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        categories: getCategories(state),
        selectedCategory: getSelectedCategory(state)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onCategoryClick: (category) => {
            dispatch(setActiveCategory(category))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryList)
