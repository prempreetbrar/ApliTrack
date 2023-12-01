"use strict";
//@ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize = require("../server");
class APIFeatures {
    constructor(originalQueryString, dbQuery) {
        this.originalQueryString = originalQueryString;
        this.dbQuery = dbQuery;
        this.pageNumber = null;
    }
    search() {
        this.dbQuery = this.dbQuery.findAll({
            where: {
                name: {
                    [sequelize.Op.iLike]: `%${this.originalQueryString.name}%`,
                },
            },
        });
    }
    exclude() {
        // const excludedQueryString = { ...this.originalQueryString };
        // const excludedParams = ["page", "sort", "limit", "fields"];
        // excludedParams.forEach((param) => delete excludedQueryString[param]);
        // return excludedQueryString;
    }
    filter() {
        //   let filteredQueryString = JSON.stringify(this.exclude());
        //   filteredQueryString = filteredQueryString.replace(
        //     /\b(gte|gt|lte|lt)\b/g,
        //     (match) => `$${match}`
        //   );
        //   this.dbQuery = this.dbQuery.find(JSON.parse(filteredQueryString));
        return this;
    }
    sort() {
        //   const sortQueryString = this.originalQueryString.sort
        //     ? this.originalQueryString.sort.replaceAll(",", " ")
        //     : "-createdAt _id";
        //   this.dbQuery = this.dbQuery.sort(sortQueryString);
        return this;
    }
    project() {
        //   const projectionString = this.originalQueryString.fields
        //     ? this.originalQueryString.fields.replaceAll(",", " ")
        //     : "-__v";
        //   this.dbQuery = this.dbQuery.select(projectionString);
        return this;
    }
    paginate() {
        //   const pageNumber = Number(this.originalQueryString.page) || 1;
        //   const resultsPerPage = Number(this.originalQueryString.limit) || 100;
        //   this.dbQuery = this.dbQuery
        //     .skip((pageNumber - 1) * resultsPerPage) // skip the results on all previous pages
        //     .limit(resultsPerPage); // show the limit on the current page
        //   this.pageNumber = pageNumber;
        return this;
    }
}
module.exports = APIFeatures;
