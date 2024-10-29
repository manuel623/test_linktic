FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["sistema_reservas_backend.csproj", "./"]
RUN dotnet restore "./sistema_reservas_backend.csproj"

COPY . .
RUN dotnet build "sistema_reservas_backend.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "sistema_reservas_backend.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

COPY --from=publish /app/publish .

EXPOSE 80

ENTRYPOINT ["dotnet", "sistema_reservas_backend.dll"]
