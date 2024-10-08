const { getRandomCoordinates } = require('#src/util/helpers');
const User = require('../../models/user/User');
const roles = require('../../util/roles');

const LIMIT_USERS = 10;

const getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = LIMIT_USERS,
      search = '',
      interests = '',
      position = '0,0',
      bbox = '',
    } = req.query;

    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);

    if (!Number.isInteger(pageInt) || !Number.isInteger(limitInt)) {
      return res
        .status(400)
        .json({ message: 'page and limit must be integers' });
    }

    const queryLimit = limitInt <= 0 ? LIMIT_USERS : Math.min(limitInt, LIMIT_USERS);
    const skipIndex = (pageInt - 1) * queryLimit;

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
      const decodedSearch = decodeURIComponent(search);
      userQuery.$and.push({
        $or: [
          { name: { $regex: new RegExp(decodedSearch, 'i') } },
          { 'address.city': { $regex: new RegExp(decodedSearch, 'i') } },
          { 'address.state': { $regex: new RegExp(decodedSearch, 'i') } },
          { 'address.country': { $regex: new RegExp(decodedSearch, 'i') } },
        ],
      });
    }

    // Interests Query
    if (interestsArr.length) {
      userQuery.$and.push({ interests: { $in: interestsArr } });
    }

    if (polygonQuery) {
      const users = await User.find(userQuery)
        .populate('interests', 'name')
        .where('coordinates')
        .within(polygonQuery)
        .limit(queryLimit);

      // hide address in response unless admin request
      if (
        !req.user ||
        (req.user.role !== roles.ADMIN && req.user.role !== roles.SUPER_ADMIN)
      ) {
        users.forEach((user) => {
          user.address.streetName = 'hidden';
          user.address.streetNumber = 'hidden';
          user.address.floorAppartment = 'hidden';
          user.coordinates = getRandomCoordinates(user.coordinates);
        });
      }

      return res
        .status(200)
        .json({ quantity: users.length, users, page: 1, totalPages: 1 });
    } else {
      const users = await User.find(userQuery)
        .populate('interests', 'name')
        .where('coordinates')
        .near([lat, lng])
        .skip(skipIndex)
        .limit(queryLimit);

      // hide address in response unless admin request
      if (
        !req.user ||
        (req.user.role !== roles.ADMIN && req.user.role !== roles.SUPER_ADMIN)
      ) {
        users.forEach((user) => {
          user.address.streetName = 'hidden';
          user.address.streetNumber = 'hidden';
          user.address.floorAppartment = 'hidden';
          user.coordinates = getRandomCoordinates(user.coordinates);
        });
      }

      const totalUsers = await User.countDocuments(userQuery);
      const totalPages = Math.ceil(totalUsers / queryLimit);
      return res
        .status(200)
        .json({ quantity: totalUsers, users, page: pageInt, totalPages });
    }
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const getSpecificUserData = async (req, res) => {
  const data = req.body;
  try {
    const result = await User.aggregate([
      {
        $project: { _id: 1, ...data },
      },
    ]);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

module.exports = {
  getUsers,
  getSpecificUserData,
};
