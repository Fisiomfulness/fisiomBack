const User = require('../../models/User');

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
      return res
        .status(400)
        .json({ message: 'page and limit must be integers' });
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
      userQuery.$and.push({ interests: { $in: interestsArr } });
    }

    if (polygonQuery) {
      const users = await User.find(userQuery)
        .populate('interests', 'name')
        .where('coordinates')
        .within(polygonQuery)
        .limit(limitInt);

      return res
        .status(200)
        .json({ quantity: users.length, users, page: 1, totalPages: 1 });
    } else {
      const users = await User.find(userQuery)
        .populate('interests', 'name')
        .skip(skipIndex)
        .limit(limitInt);

      const queryWithoutNear = { ...userQuery };
      queryWithoutNear.$and.shift();

      const totalUsers = await User.countDocuments(queryWithoutNear);
      const totalPages = Math.ceil(totalUsers / limitInt);
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
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

module.exports = {
  getUsers,
  getSpecificUserData,
};
