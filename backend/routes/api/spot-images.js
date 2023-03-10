const express = require('express')

const { requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, sequelize } = require('../../db/models');
const { Op } = require("sequelize");

const router = express.Router();

// Delete a spot image
router.delete('/:imageId', requireAuth, async (req, res) => {
  const imageId = req.params.imageId;
  const image = await SpotImage.findByPk(imageId)

  if (!image) {
    res.status(404);
    return res.json({
      message: "Spot Image couldn't be found",
      statusCode: 404
    })
  };

  const spot = await Spot.findOne({
    where: {
      id: image.spotId
    }
  });

  if (req.user.id != spot.ownerId) {
    res.status(403);
    return res.json({
      message: "Forbidden",
      statusCode: 403
    })
  };

  await image.destroy();
  res.status(200)
  return res.json({
    message: "Successfully deleted",
    statusCode: 200
  })
});



module.exports = router;
