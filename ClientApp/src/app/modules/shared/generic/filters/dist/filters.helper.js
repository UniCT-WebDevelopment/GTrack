"use strict";
exports.__esModule = true;
exports.isMatchingFilter = exports.getFilterValue = exports.getFiltersByKeys = exports.getFilterFromKey = exports.getFilterForEntity = exports.getFilterKeyForEntity = exports.getFilterKey = void 0;
var PropertyFilter_1 = require("./filtering/PropertyFilter");
var GlobalConstants_1 = require("../../GlobalConstants");
function getFilterKey(filters) {
    return btoa(JSON.stringify(filters));
    //Buffer.from(str, 'base64')
}
exports.getFilterKey = getFilterKey;
function getFilterKeyForEntity(entity, filters) {
    var entityFilter = getEntityFilter(entity, filters);
    return btoa(JSON.stringify(entityFilter));
    //Buffer.from(str, 'base64')
}
exports.getFilterKeyForEntity = getFilterKeyForEntity;
function getFilterForEntity(entity, filterKey) {
    var filter = getFilterFromKey(filterKey);
    return getEntityFilter(entity, filter);
}
exports.getFilterForEntity = getFilterForEntity;
function getFilterFromKey(filterKey) {
    //TODO: add a try cactch tto handle no parsing cases
    var resultFilter = [];
    var obj = JSON.parse(atob(filterKey));
    if (obj instanceof Array) {
        for (var i = 0; i < obj.length; i++) {
            var couple = obj[i];
            resultFilter.push([new PropertyFilter_1.PropertyFilter(couple[0].key, couple[0].value, couple[0].matchCriteria), couple[1]]);
        }
        return resultFilter;
    }
    else
        return new PropertyFilter_1.PropertyFilter(obj.key, obj.value);
}
exports.getFilterFromKey = getFilterFromKey;
function getFiltersByKeys(filterKeys) {
    return filterKeys.filter(function (fk) { return fk != GlobalConstants_1.allItemsSetKey; }).map(function (fk) { return [fk, getFilterFromKey(fk)]; });
}
exports.getFiltersByKeys = getFiltersByKeys;
function getFilterValue(forPropertyKey, filters) {
    var value = null;
    if (filters instanceof PropertyFilter_1.PropertyFilter && filters.key == forPropertyKey)
        value = filters.value;
    else if (filters instanceof Array) {
        var correctFilter = filters.filter(function (f) { return f[0].key == forPropertyKey; });
        if (correctFilter)
            value = correctFilter[0][0].value;
    }
    return value;
}
exports.getFilterValue = getFilterValue;
function getEntityFilter(entity, filters) {
    var entityKeys = Object.keys(entity);
    var filterForEntity = [];
    if (filters instanceof Array) {
        //check wich filter has key contained in entityKeys
        for (var _i = 0, filters_1 = filters; _i < filters_1.length; _i++) {
            var couple = filters_1[_i];
            if (entityKeys.includes(couple[0].key)) {
                filterForEntity.push(couple); //push the filter and eventually the operator.
            }
        }
    }
    else if (filters instanceof PropertyFilter_1.PropertyFilter) {
        if (entityKeys.includes(filters.key)) {
            filterForEntity = filters; //push the filter also.
        }
    }
    if (filterForEntity instanceof Array && filterForEntity.length == 1)
        return filterForEntity[0][0]; //just the property filter.
    return filterForEntity;
}
function isMatchingFilter(item, filters) {
    var condition = true;
    if (filters instanceof PropertyFilter_1.PropertyFilter) {
        var fl = filters;
        if (item[fl.key] == undefined) {
            console.warn("cannot find the property " + fl.key + " in item during filtering.");
            condition = false;
        }
        else
            condition = matchValue(item[fl.key], fl.value, fl.matchCriteria);
    }
    else if (filters instanceof Array) {
        for (var i = 0; i < filters.length; i++) {
            var fl_1 = filters[i][0];
            if (i == 0) {
                if (item[fl_1.key] == undefined) {
                    console.warn("cannot find the property " + fl_1.key + " in item during filtering.");
                    condition = false;
                }
                else
                    condition = matchValue(item[fl_1.key], fl_1.value, fl_1.matchCriteria);
            }
            else {
                var prevOp = filters[i - 1][1];
                if (prevOp == PropertyFilter_1.EntityFilterOperator.AND) {
                    if (item[fl_1.key] == undefined) {
                        console.warn("cannot find the property " + fl_1.key + " in item during filtering.");
                        condition = condition && false;
                    }
                    else
                        condition = condition && matchValue(item[fl_1.key], fl_1.value, fl_1.matchCriteria);
                }
                else if (prevOp == PropertyFilter_1.EntityFilterOperator.OR) {
                    if (item[fl_1.key] == undefined) {
                        console.warn("cannot find the property " + fl_1.key + " in item during filtering.");
                        condition = condition || false;
                    }
                    condition = condition || matchValue(item[fl_1.key], fl_1.value, fl_1.matchCriteria);
                }
            }
        }
    }
    return condition;
}
exports.isMatchingFilter = isMatchingFilter;
function matchValue(a, b, criteria) {
    var condition = false;
    if (a instanceof Date && !(b instanceof Date)) //date converted by base64 are converted to string representation.
        b = Date.parse(b);
    switch (criteria) {
        case PropertyFilter_1.PropertyFilterMatchCriteria.EQUALS:
            condition = a == b;
            break;
        case PropertyFilter_1.PropertyFilterMatchCriteria.GT:
            condition = a >= b;
            break;
        case PropertyFilter_1.PropertyFilterMatchCriteria.LT:
            condition = a <= b;
            break;
        case PropertyFilter_1.PropertyFilterMatchCriteria.NE:
            condition = a != b;
            break;
    }
    return condition;
}
