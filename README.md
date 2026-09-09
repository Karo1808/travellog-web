# TravelLog

TravelLog to aplikacja webowa do zapisywania odwiedzonych miejsc na interaktywnej mapie. Użytkownik może utworzyć konto, dodawać wpisy z datą, opisem i zdjęciem oraz przeglądać i edytować swoją historię podróży.

## Funkcje

- rejestracja i logowanie z uwierzytelnianiem JWT,
- interaktywna mapa Mapbox,
- odwrotne geokodowanie przez Geoapify,
- dodawanie miejsc z datą, opisem, współrzędnymi i zdjęciem,
- przeglądanie, edytowanie i usuwanie wpisów,
- responsywny interfejs na komputery i urządzenia mobilne.

## Technologie

- React 19, TypeScript, Vite i TanStack Router/Query,
- Tailwind CSS i komponenty Radix UI,
- ASP.NET Core 9, Entity Framework Core i ASP.NET Identity,
- SQLite,
- Mapbox i Geoapify.

## Wymagania

- Node.js 22,
- pnpm 10.11.0,
- .NET SDK 9.

## Konfiguracja

Zainstaluj zależności z katalogu głównego:

```bash
pnpm install --frozen-lockfile
pnpm --dir client install --frozen-lockfile
dotnet restore server/server.csproj
```

Utwórz konfigurację frontendu:

```bash
cp client/.env.example client/.env
```

W pliku `client/.env` ustaw publiczny token Mapbox:

```env
VITE_MAPBOX_ACCESS_TOKEN=<token_mapbox>
```

Klucz Geoapify przechowuj w .NET User Secrets:

```bash
dotnet user-secrets set "Geoapify:ApiKey" "<klucz_geoapify>" --project server
```

Repozytorium zawiera lokalną bazę SQLite z syntetycznymi danymi demonstracyjnymi przeznaczonymi wyłącznie do tego POC.

## Uruchomienie

Uruchom frontend i backend jednocześnie:

```bash
pnpm dev
```

- aplikacja: <http://localhost:3000>
- API: <http://localhost:5114/api>
- dokumentacja API: <http://localhost:5114/scalar/v1>

Dokumentacja API jest dostępna tylko w środowisku deweloperskim.

## Weryfikacja

```bash
pnpm --dir client build
dotnet build server/server.csproj
```

## Licencja i usługi zewnętrzne

Kod jest udostępniany na licencji ISC. Mapa i dane geograficzne korzystają z usług Mapbox oraz Geoapify i podlegają warunkom tych dostawców.
