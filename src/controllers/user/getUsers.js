const { getRandomCoordinates } = require('#src/util/helpers');
const User = require('../../models/User');
const roles = require('../../util/roles');

const getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      interests = '',
      position = '0,0',
      bbox = '',
    } = req.query;

    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);

    if (!Number.isInteger(pageInt) || !Number.isInteger(limitInt)) {
      return res.status(400).json({ message: 'page and limit must be integers' });
    }
    const skipIndex = (pageInt - 1) * limitInt;

    let interestsArr = [];
    if (interests !== '') {
      interestsArr = interests.split(',');
    }

    const coords = position.split(',');
    const lat = parseFloat(coords[0]);
    const lng = parseFloat(coords[1]);
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res
        .status(400)
        .json({ message: 'lat and lng must be valid coordinates' });
    }

    let polygonQuery;
    if (bbox !== '') {
      const bboxArray = bbox.split(',').map(parseFloat);
      const southwest = [bboxArray[1], bboxArray[0]];
      const northeast = [bboxArray[3], bboxArray[2]];
      const box = [southwest, northeast];
      polygonQuery = { box };
    }

    let userQuery = {
      $and: [
        // bring only active users
        { status: true },
      ],
    };

    // if user is logged don't bring himself
    if (req.user) {
      userQuery.$and.push({ _id: { $ne: req.user.id } });
    }

    // filter by search
    if (search.trim() !== '') {
      userQuery.$and.push({
        $or: [
          { name: { $regex: new RegExp(search, 'i') } },
          { 'address.city': { $regex: new RegExp(search, 'i') } },
          { 'address.state': { $regex: new RegExp(search, 'i') } },
          { 'address.country': { $regex: new RegExp(search, 'i') } },
        ],
      });
    }

    // Interests Query
    if (interestsArr.length) {
      userQuery.$and.push({ interests: { $in: interestsArr }});
    }

    if (polygonQuery) {
      const users = await User.find(userQuery)
      .populate('interests', 'name')
      .where('coordinates').within(polygonQuery)
      .limit(limitInt);

      // hide address in response unless admin request
      if (!req.user
        || (
          req.user.role !== roles.ADMIN
          && req.user.role !== roles.SUPER_ADMIN
        )
      ) {
        users.forEach((user) => {
          user.address.streetName = "hidden";
          user.address.streetNumber = "hidden";
          user.address.floorAppartment = "hidden";
          user.coordinates = getRandomCoordinates(user.coordinates);
        })
      }

      return res.status(200).json({ quantity: users.length, users, page: 1, totalPages: 1 });

    } else {
      const users = await User.find(userQuery)
      .populate('interests', 'name')
      .where('coordinates').near([lat, lng])
      .skip(skipIndex)
      .limit(limitInt);

      // hide address in response unless admin request
      if (!req.user
        || (
          req.user.role !== roles.ADMIN
          && req.user.role !== roles.SUPER_ADMIN
        )
      ) {
        users.forEach((user) => {
          user.address.streetName = "hidden";
          user.address.streetNumber = "hidden";
          user.address.floorAppartment = "hidden";
          user.coordinates = getRandomCoordinates(user.coordinates);
        })
      }

      const totalUsers = await User.countDocuments(userQuery);
      const totalPages = Math.ceil(totalUsers / limitInt);
      return res.status(200).json({ quantity: totalUsers, users, page: pageInt, totalPages });
    }
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getUsers
};
