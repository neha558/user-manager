import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

import { Op } from 'sequelize';

const allowedConditions = [
  'gt',
  'gte',
  'lt',
  'lte',
  'ne',
  'like',
  'notLike',
  'iLike',
  'notILike',
  'regexp',
  'notRegexp',
  'iRegexp',
  'notIRegexp',
];
const allowedConditionsArray = [
  'between',
  'notBetween',
  'in',
  'notIn',
];

const isComparableField = (key) => key[0] !== '_';

const getFieldKey = (key) => {
  let result = key;
  if (key.indexOf('.') !== -1) {
    result = `$${key}$`;
  }

  return result;
};

const getEqualOp = (key, value) => {
  const query = {
    [key]: value,
  };

  return query;
};

const getConditionQuery = (filter, query) => {
  let conditionQuery = {};
  if (
    typeof filter.condition === 'string' &&
    typeof query === 'object' &&
    Object.keys(query).length !== 0
  ) {
    conditionQuery = {
      [Op[filter.condition]]: query,
    };
  } else if (Array.isArray(query) && query.length > 1) {
    conditionQuery = {
      [Op.and]: query,
    };
  } else {
    conditionQuery = query;
  }

  return conditionQuery;
};

const getFieldQuery = (filter, fieldKey, values) => {
  const fieldQuery = [];

  Object.keys(values)
    .filter(isComparableField)
    .forEach((key) => {
      const value = values[key];

      if (key === 'eq') {
        fieldQuery.push(getEqualOp(fieldKey, value));
      } else if (
        allowedConditions.includes(key) ||
        (allowedConditionsArray.includes(key) && Array.isArray(value))
      ) {
        fieldQuery.push({
          [fieldKey]: {
            [Op[key]]: value,
          },
        });
      } else {
        // eslint-disable-next-line
        console.error(`${key} operator is missing`);
      }
    });

  return fieldQuery.length > 1
    ? getConditionQuery(filter, fieldQuery, values)
    : fieldQuery[0];
};

const getQuery = (filter) => {
  const currentQuery = {};

  Object.keys(filter).forEach((key) => {
    const fieldValue = filter[key];
    const fieldKey = getFieldKey(key);

    if (isComparableField(fieldKey)) {
      if (
        Array.isArray(fieldValue) ||
        typeof fieldValue === 'string' ||
        typeof fieldValue === 'number'
      ) {
        Object.assign(currentQuery, getEqualOp(fieldKey, fieldValue));
      } else if (typeof fieldValue === 'object') {
        Object.assign(
          currentQuery,
          getFieldQuery(filter, fieldKey, fieldValue),
        );
      }
    }
  });

  return currentQuery;
};

const getOrQuery = (orQueryParam) => {
  if (!orQueryParam?.length) {
    return null;
  }

  const orQuery = [];

  orQueryParam.forEach((orObject) => {
    const query = getQuery(orObject);

    if (!isEmpty(query)) {
      orQuery.push(query);
    }
  });

  return orQuery?.length ? { [Op.or]: orQuery } : null;
};

const generateWhereQuery = (filterParam) => {
  if (!filterParam) {
    return undefined;
  }

  const filter = cloneDeep(filterParam);

  let query = {};

  // ****** OR CONDITION *********
  const orFilter = filter.or;
  if (orFilter) {
    const orQuery = getOrQuery(orFilter);

    if (orQuery) {
      query = {
        ...orQuery,
      };
    }
  }

  delete filter.or;
  // ****** OR CONDITION *********

  const andQuery = getQuery(filter);

  query = {
    ...query,
    ...andQuery,
  };

  return query;
};

const generateQuery = (query) => {
  if (!query) {
    return null;
  }

  // To send the query for order or where condition please refer
  // https://github.com/segemun/sequelize-search-builder#request-examples
  const { order, filter } = query;

  return {
    order: order ? Object.entries(order) : null,
    where: generateWhereQuery(filter),
  };
};

module.exports = generateQuery;
