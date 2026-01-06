// src/utils/constants.js

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const ITEM_TYPES = {
  LOST: 'lost',
  FOUND: 'found',
};

const MARKETPLACE_CATEGORIES = {
  BUY: 'buy',
  SELL: 'sell',
  RENT: 'rent',
};

module.exports = {
  HTTP_STATUS,
  ITEM_TYPES,
  MARKETPLACE_CATEGORIES,
};
