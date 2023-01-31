"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.EditItemController = void 0;
var core_1 = require("@angular/core");
var item_holder_component_1 = require("./item-holder.component");
var EditItemController = /** @class */ (function (_super) {
    __extends(EditItemController, _super);
    function EditItemController(ch, entityService, route) {
        var _this = _super.call(this) || this;
        _this.ch = ch;
        _this.entityService = entityService;
        _this.route = route;
        _this.waiting = false;
        return _this;
    }
    EditItemController.prototype.ngOnInit = function () {
        var _this = this;
        var _a;
        if (this.item) {
            (_a = this.item) === null || _a === void 0 ? void 0 : _a.subscribe(function (t) {
                _this.form.reset();
                _this._item = t;
                if (t)
                    _this.form.patchValue(t);
                _this.ch.markForCheck();
            });
        }
        else {
            var itemId = this.route.snapshot.paramMap.get("id");
            console.log("Item Id: ", itemId);
            this.entityService.getItem({ uid: itemId }).then(function (item) {
                _this._item = item[0];
                console.log(item);
            });
        }
    };
    EditItemController.prototype.saveChanges = function () {
        var _this = this;
        var _a;
        //we are sure to have data thanks to the validators -> force conversion to Trip
        var item = __assign(__assign({}, this.form.getRawValue()), { uid: (_a = this._item) === null || _a === void 0 ? void 0 : _a.uid });
        this.waiting = true;
        if (!item.uid) {
            this.entityService.createItem(item).then(function (r) {
                _this.waiting = false;
                _this.onClose.next(item);
                _this.item = undefined;
            });
        }
        else
            this.entityService.editItem(item).then(function (r) {
                _this.waiting = false;
                _this.onClose.next(item);
                _this.item = undefined;
            });
    };
    EditItemController = __decorate([
        core_1.Component({
            template: ''
        })
    ], EditItemController);
    return EditItemController;
}(item_holder_component_1.ItemHolderComponent));
exports.EditItemController = EditItemController;
