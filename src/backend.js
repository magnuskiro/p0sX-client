import { get } from './request-wrapper'

const getCategories = () => {
    return get('/categories/?format=json')
}

const getIngredients = () => {
    return get('/ingredients/?format=json')
}

const getItems = () => {
    return get('/items/?format=json')
}

const getUsers = () => {
    return get('/users/?format=json')
}

const getUser = (userId) => {
    return get(`/users/${userId}/?format=json`)
}

export {
    getCategories,
    getIngredients,
    getItems,
    getUsers,
    getUser
}