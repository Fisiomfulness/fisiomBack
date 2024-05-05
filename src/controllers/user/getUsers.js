const User = require('../../models/User');

const getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      interests = '',
      pos = '-12.057822374374036,-77.06708360541617',
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
          coordinates: {
            $near: [lat, lng],
          },
        },
        { status: true },
      ],
    };

    if (search.trim() !== '') {
      userQuery.$and.push({
        $or: [
          { name: { $regex: new RegExp(search, 'i') } },
          // Uncomment to include address in query
          //{ address: { $regex: new RegExp(search, 'i') } },
        ],
      });
    }

    // Uncomment when interests are ready
    // if (interestsArr.length) {
    //   userQuery.$and.push({ specialties: { $in: [interestsId] }});
    // }

    const users = await User.find(userQuery)
      //.populate('interests', 'name')
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
