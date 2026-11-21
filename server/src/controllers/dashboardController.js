import Lead from '../models/Lead.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const statsAggregation = await Lead.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const counts = {
      total: 0,
      new: 0,
      contacted: 0,
      qualified: 0,
      lost: 0
    };

    let total = 0;
    statsAggregation.forEach((item) => {
      const statusKey = (item._id || '').toLowerCase();
      if (counts[statusKey] !== undefined) {
        counts[statusKey] = item.count;
      }
      total += item.count;
    });

    counts.total = total;

    res.status(200).json({
      success: true,
      data: counts
    });
  } catch (error) {
    next(error);
  }
};
