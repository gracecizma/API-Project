import React from "react"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom"
import { getAllSpots } from '../../store/spots'
import './spotshow.css'

export default function Spots() {
  const dispatch = useDispatch()
  const spotsObj = useSelector((state) => state.spots.allSpots)
  const spots = Object.values(spotsObj)

  console.log('spots', spots)

  useEffect(() => {
    dispatch(getAllSpots())
  }, [dispatch])

  if (!spots) return null

  return (
    <>
      <div className="spot-tiles">Spots</div>
      {spots.map(spot => (
        <Link key={spot.id} to={`spots/${spot.id}`}>
          {spot.name}
          <img src={spot.previewImage} />
          <p>{spot.price}</p>
          <p>{spot.address}</p>
          <p>{spot.city}</p>
          <p>{spot.country}</p>
          <p>average rating: {spot.avgRating}</p>
        </Link>
      ))}
    </>
  )
};
