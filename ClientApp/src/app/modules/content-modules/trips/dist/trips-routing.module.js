"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TripsRoutingModule = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var drivers_resolver_1 = require("../drivers/resolvers/drivers.resolver");
var drivers_sync_resolver_1 = require("../drivers/resolvers/drivers.sync.resolver");
var tracks_resolver_1 = require("../tracks/resolvers/tracks.resolver");
var tracks_sync_resolver_1 = require("../tracks/resolvers/tracks.sync.resolver");
var packages_filtered_resolver_1 = require("../warehouse/resolvers/packages.filtered.resolver");
var edit_cost_component_1 = require("./editCost/edit.cost.component");
var edit_stage_component_1 = require("./editStage/edit.stage.component");
var edit_trips_component_1 = require("./editTrip/edit.trips.component");
var manage_trips_component_1 = require("./manage/manage.trips.component");
var costs_filtered_resolver_1 = require("./resolvers/costs.filtered.resolver");
var stages_filtered_resolver_1 = require("./resolvers/stages.filtered.resolver");
var trip_resolver_1 = require("./resolvers/trip.resolver");
var trips_currentMonth_resolver_1 = require("./resolvers/trips.currentMonth.resolver");
var routes = [
    {
        path: '',
        //pathMatch: 'full',
        component: manage_trips_component_1.ManageTripsComponent,
        resolve: { drivers: drivers_resolver_1.DriversResolver, tracks: tracks_resolver_1.TracksResolver, items: trips_currentMonth_resolver_1.TripsOfCurrentMonthResolver },
        children: [
            {
                path: 'trip/edit',
                pathMatch: 'full',
                component: edit_trips_component_1.EditTripsComponent,
                resolve: { drivers: drivers_resolver_1.DriversResolver, tracks: tracks_resolver_1.TracksResolver, item: trip_resolver_1.TripResolver } //order is important to show dialog.
            },
            {
                path: 'trip/edit/:id',
                pathMatch: 'full',
                component: edit_trips_component_1.EditTripsComponent,
                resolve: { drivers: drivers_resolver_1.DriversResolver, tracks: tracks_resolver_1.TracksResolver, item: trip_resolver_1.TripResolver }
            },
            {
                path: 'cost/edit/:filterKey',
                pathMatch: 'full',
                component: edit_cost_component_1.EditCostComponent,
                resolve: { item: costs_filtered_resolver_1.CostsFilteredResolver }
            },
            {
                path: 'stage/edit/:filterKey',
                pathMatch: 'full',
                component: edit_stage_component_1.EditStageComponent,
                resolve: { drivers: drivers_sync_resolver_1.DriversSyncResolver, tracks: tracks_sync_resolver_1.TracksSyncResolver, packages: packages_filtered_resolver_1.PackagesFilteredResolver, item: stages_filtered_resolver_1.StagesFilteredResolver } //TODO: it will be PackagesFilteredResolver. //qui scarico i packages e gli stages per trip id.
            },
        ]
    },
];
var TripsRoutingModule = /** @class */ (function () {
    function TripsRoutingModule() {
    }
    TripsRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forChild(routes)],
            exports: [router_1.RouterModule]
        })
    ], TripsRoutingModule);
    return TripsRoutingModule;
}());
exports.TripsRoutingModule = TripsRoutingModule;
