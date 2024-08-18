using WebAPI.Extensions;
using WebAPI.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddApplicationServices(builder.Configuration); //appServices
builder.Services.AddIdentityServices(builder.Configuration);    //identityServices

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();
app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:4200", "https://localhost:4200"));   //AngularApp Cors

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();