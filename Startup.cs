using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using gtrack.Models.config;
using Gtrack.Utils;
using GTrack.Controllers;
using GTrack.Utils;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using MySqlConnector;
using Newtonsoft.Json;

namespace GTrack
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddControllers().AddNewtonsoftJson(
                options => options.SerializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.Utc);

            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist/webapp";
            });

            services.AddTransient<MySqlConnection>(_ => {
                return new MySqlConnection(Configuration["ConnectionStrings:Default"]);
            });

            services.Configure<JwtConfig>(Configuration.GetSection("JWT"));

            services.AddSingleton<SqlUtils>();
            services.AddSingleton<PackagesController>();
            services.AddSingleton<TripStagesController>();
            services.AddSingleton<TripCostsController>();
            services.AddSingleton<UsersController>();
            services.AddCors(options =>
            {
                options.AddDefaultPolicy(
                    policy =>
                    {
                        policy.WithOrigins("*");
                        policy.AllowAnyHeader();
                        policy.AllowAnyMethod();
                    });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }


            app.UseMiddleware<JwtMiddleware>();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();


            app.UseRouting();

            app.UseCors();
            
        

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                
            });

            

            /*app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp/dist/webapp";
                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                    spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
                }
            });*/
        }
    }
}
