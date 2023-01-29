const express = require('express')

const { requireAuth } = require('../../utils/auth');
const { Spot, User, SpotImage, Review, ReviewImage, sequelize } = require('../../db/models');
const { Op } = require("sequelize");
const router = express.Router();

// Get all reviews of the Current User
router.get('/current', requireAuth, async (req, res) => {
  const userReviews = await Review.findAll({
    include: [
      { model: User },
      { model: Spot },
      //   { model: ReviewImage }
    ],
    where: { userId: req.user.id }
  })


  return res.json(userReviews)

});

// Add an image to a Review based on the review's id
router.post('/:reviewId/images', requireAuth, async (req, res) => {
  const reviewId = req.params.reviewId
  const foundReview = await Review.findByPk(reviewId);

  if (!foundReview) {
    res.status(404);
    return res.json({
      message: "Review couldn't be found",
      statusCode: 404
    })
  };

  if (req.user.id !== foundReview.userId) {
    res.status(403);
    return res.json({
      message: "Forbidden",
      statusCode: 403
    })
  };

  let reviewCount = await ReviewImage.count({
    where: {
      reviewId: reviewId
    }
  })
  console.log(reviewCount)

  if (reviewCount === 10) {
    res.status(403);
    return res.json({
      message: "Maximum number of images for this resource was reached",
      statusCode: 403
    })
  }

  const { url } = req.body;

  const newImg = await ReviewImage.create({
    reviewId,
    url
  })

  return res.json(newImg)
});

// Edit a review
router.put('/:reviewId', requireAuth, async (req, res) => {
  let reviewId = req.params.reviewId;
  const foundReview = await Review.findByPk(reviewId);
  const spotId = foundReview.spotId

  if (!foundReview) {
    res.status(404);
    return res.json({
      message: "Review couldn't be found",
      statusCode: 404
    })
  }

  if (req.user.id !== foundReview.userId) {
    res.status(403);
    return res.json({
      message: "Forbidden",
      statusCode: 403
    })
  };

  const { review, stars } = req.body;

  foundReview.set({
    userId: req.user.id,
    spotId: spotId,
    review: req.body.review,
    stars: req.body.stars
  })

  if (!review || stars < 1 || stars > 5) {
    res.status(400);
    return res.json({
      message: "Validation error",
      statusCode: 400,
      errors: {
        review: "Review text is required",
        stars: "Stars must be an integer from 1 to 5"
      }
    })
  }

  await foundReview.save()

  return res.json(foundReview)
});

// Delete a review
router.delete('/:reviewId', requireAuth, async (req, res) => {
  const reviewId = req.params.reviewId;
  const foundReview = await Review.findByPk(reviewId);

  if (req.user.id !== foundReview.userId) {
    res.status(403);
    return res.json({
      message: "Forbidden",
      statusCode: 403
    })
  };

  if (!foundReview) {
    res.status(404);
    return res.json({
      message: "Review couldn't be found",
      statusCode: 404
    })
  } else {
    await foundReview.destroy();
    res.status(200)
    return res.json({
      message: "Successfully deleted",
      statusCode: 200
    })
  }
});





module.exports = router;
