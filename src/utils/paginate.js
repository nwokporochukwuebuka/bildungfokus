const { Op } = require("sequelize");

const getPaginatedData = async (
  model,
  {
    page = 1,
    limit = 10,
    sortField = "createdAt",
    sortOrder = "DESC",
    filters = {},
    dateField = "createdAt",
    startDate,
    endDate,
    include = [],
  }
) => {
  // This tells us where the data should be fetched from
  const offset = (page - 1) * limit;

  // incase we have filters,
  const where = {};

  // This caters for filters that have multiple values e.g status = active or inactive
  Object.keys(filters).forEach((key) => {
    if (Array.isArray(filters[key])) {
      where[key] = {
        [Op.or]: filters[key],
      };
    } else {
      where[key] = filters[key];
    }
  });

  // Caters for date range
  if (startDate && endDate) {
    where[dateField] = {
      [Op.between]: [new Date(startDate), new Date(endDate)],
    };
  } else if (startDate) {
    where[dateField] = {
      [Op.gte]: new Date(startDate),
    };
  } else if (endDate) {
    where[dateField] = {
      [Op.lte]: new Date(endDate),
    };
  }

  if (include.length > 0) {
    const { count, rows } = await model.findAndCountAll({
      where,
      order: [[sortField, sortOrder]],
      limit,
      offset,
      include,
    });
    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      limit,
      data: rows,
    };
  }
  // Fetch data with pagination, sorting, and filtering
  const { count, rows } = await model.findAndCountAll({
    where,
    order: [[sortField, sortOrder]],
    limit,
    offset,
  });
  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    limit,
    data: rows,
  };
};

module.exports = {
  getPaginatedData,
};
