import { csrfFetch } from "./csrf"

const GET_ALL_SPOTS = 'spots/GET_ALL_SPOTS'
const GET_SINGLE_SPOT = 'spots/GET_SINGLE_SPOT'
const CREATE_SPOT = 'spots/CREATE_SPOT'
const GET_USER_SPOTS = 'spots/GET_USER_SPOTS'
const UPDATE_SPOT = 'spots/UPDATE_SPOT'
const DELETE_SPOT = 'spots/DELETE_SPOT'

const loadSpots = (spotsArray) => {
  return {
    type: GET_ALL_SPOTS,
    payload: spotsArray
  }
};

const oneSpot = (spotArray) => {
  return {
    type: GET_SINGLE_SPOT,
    payload: spotArray
  }
};

const createSpot = (newSpot) => {
  return {
    type: CREATE_SPOT,
    payload: newSpot
  }
};

const userSpots = (spotsArray) => {
  return {
    type: GET_USER_SPOTS,
    payload: spotsArray
  }
};


const editSpot = (spotArray) => {
  return {
    type: UPDATE_SPOT,
    payload: spotArray
  }
};

const removeSpot = (spotId) => {
  return {
    type: DELETE_SPOT,
    payload: spotId
  }
}


export const getAllSpots = () => async (dispatch) => {
  const res = await csrfFetch('/api/spots')

  if (res.ok) {
    const spotsObj = await res.json()
    console.log("get all fetch request", spotsObj)
    dispatch(loadSpots(spotsObj))
    return spotsObj
  }
};

export const getSpot = (id) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${id}`)

  if (res.ok) {
    const spotObj = await res.json()
    //console.log("get one fetch request", spotObj)
    dispatch(oneSpot(spotObj))
    return spotObj
  }
};

export const addImageToSpot = (newSpot, newSpotUrl, currUser) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${newSpot.id}/images`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: newSpotUrl,
      preview: true
    })
  })

  if (res.ok) {
    const newSpotImg = await res.json()

    console.log("newSpotImg", newSpotImg)

    newSpot.Owner = currUser
    newSpot.SpotImages = [newSpotImg]
    newSpot.numReviews = 0
    newSpot.avgRating = 0
    dispatch(createSpot(newSpot))
    return newSpotImg
  }
}

export const createNewSpot = (newSpot, currUser) => async (dispatch) => {
  const res = await csrfFetch('/api/spots', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newSpot)
  })

  if (res.ok) {
    const createdSpot = await res.json()

    console.log("createdSpot", createdSpot)


    dispatch(addImageToSpot(createdSpot, newSpot.imageURL, currUser))
    return createdSpot
  }
};

export const getUserSpots = () => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/current`)

  if (res.ok) {
    const currUserSpots = await res.json()
    console.log("fetch spots", currUserSpots)
    dispatch(userSpots(currUserSpots))
    return currUserSpots
  }
};

export const updateSpot = (spot, spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(spot)
  })

  if (res.ok) {
    const updatedSpot = await res.json()
    //console.log("updated spot", updatedSpot)
    dispatch(editSpot(updatedSpot))
    return updatedSpot
  }
};

export const deleteSpot = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  })

  if (res.ok) {
    dispatch(removeSpot(spotId))
  }
};


let initialState = {
  allSpots: {},
  singleSpot: {},
  userSpots: {}
}

export default function spotsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_SPOTS: {
      const allSpots = { ...action.payload.spotsArray }
      console.log("allSpots", allSpots)
      const allSpotsState = { ...state, allSpots: { ...allSpots } }
      console.log("allSpotsState", allSpotsState)
      return {
        allSpotsState,
        allSpots
      }
    }
    case GET_SINGLE_SPOT: {
      const singleSpot = { ...action.payload }
      console.log("single spot", singleSpot)
      const spotState = { ...state, singleSpot: { ...singleSpot } }
      console.log("spot state", spotState)
      return {
        spotState,
        singleSpot
      }
    }
    case CREATE_SPOT: {
      const createSpot = { ...action.payload }
      console.log("createSpot state", createSpot)
      const createSpotState = { ...state, singleSpot: { ...createSpot } }
      console.log("createSpotState", createSpotState)
      return {
        createSpotState,
        createSpot
      }
    }
    case GET_USER_SPOTS: {
      const userSpots = { ...action.payload }
      console.log("userSpots", userSpots)
      const userState = { ...state, userSpots: { ...userSpots } }
      console.log("user state", userState)
      return {
        userState,
        userSpots
      }
    }
    case UPDATE_SPOT: {
      const newState4 = { ...state, userSpots: { ...action.payload } }
      newState4.userSpots[action.payload.spotId] = { ...action.payload.spot }
      return newState4
    }
    case DELETE_SPOT: {
      const newState5 = { ...state, allSpots: { ...state.allSpots } }
      delete newState5.allSpots[action.payload.spotId]
      return newState5
    }
    default:
      return state
  }
};
