const User = require('../../models/User');

const getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      interests = '',
      pos = '0,0',
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

    const coords = pos.split(',');
    const lat = parseFloat(coords[0]);
    const lng = parseFloat(coords[1]);
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res
        .status(400)
        .json({ message: 'lat and lng must be valid coordinates' });
    }

    let userQuery = {
      $and: [
        {
          // sort by proximity to lat,lng
          coordinates: {
            $near: [lat, lng],
          },
        },
        // bring only active users
        { status: true },
      ],
    };

    // if user is logged don't bring himself
    if (req.tokenUser) {
      userQuery.$and.push({ _id: { $ne: req.tokenUser.id } });
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

    // Uncomment when interests are ready
    if (interestsArr.length) {
      userQuery.$and.push({ interests: { $in: interestsArr }});
    }

    const users = await User.find(userQuery)
    .populate('interests', 'name')
    .skip(skipIndex)
    .limit(limitInt);

    const queryWithoutNear = { ...userQuery };
    queryWithoutNear.$and.shift();

    const totalUsers = await User.countDocuments(queryWithoutNear);
    const totalPages = Math.ceil(totalUsers / limitInt);
    return res.status(200).json({ quantity: totalUsers, users, page: pageInt, totalPages });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getUsers
};
