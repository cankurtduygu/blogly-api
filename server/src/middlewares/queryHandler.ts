"use strict";
import type { Request, Response, NextFunction } from "express";

export const queryHandler = async (req: Request, res: Response, next: NextFunction) => {

  //* Filter:
  // URL?filter[fieldName]=value1&filter[fieldName2]=value2
  const filter = (req.query?.filter || {}) as Record<string, any>;

  //* Search:
  // URL?search[fieldName]=value1&search[fieldName2]=value2
  const search = (req.query?.search || {}) as Record<string, any>;

  for (let key in search) search[key] = { $regex: search[key], $options: "i" };

  //* Sorting:
  // URL?sort[fieldName]=value1&sort[fieldName2]=value2
  const sort = (req.query?.sort || {}) as Record<string, any>;

  //? PAGINATION:
  // URL?page=3&limit=10&skip=20

  //* Page:
  let page = parseInt(req.query?.page as string);
  page = page > 0 ? page : 1;

  //* Limit:
  let limit = parseInt(req.query?.limit as string);
  limit = limit > 0 ? limit : 20;

  //* Skip:
  let skip = parseInt(req.query?.skip as string);
  skip = skip > 0 ? skip : (page - 1) * limit;

  res.getModelList = async (Model, populate = null) => {
    const query = Model.find({ ...filter, ...search })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      
      return populate ? query.populate(populate) : query;
  };

  res.getModelListDetails = async (Model) => {
    const count = await Model.countDocuments({ ...filter, ...search });
    return {
      count,
      filter,
      search,
      page,
      skip,
      limit,
      sort,
      pages:
        count <= limit
          ? false
          : {
              previos: page > 1 ? page - 1 : false,
              current: page,
              next: page < Math.ceil(count / limit) ? page + 1 : false,
              total: Math.ceil(count / limit),
            },
    };
  };

  next();
};
