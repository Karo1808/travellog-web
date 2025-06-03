# Instrukcja instalacji

**Krótki opis projektu:**
Projekt składa się z dwóch części:

- **client** – frontend oparty na pnpm (np. React/Vite)
- **server** – backend w C# (.NET 8), udostępniający API (REST)

README zawiera instrukcje dotyczące instalacji, konfiguracji i uruchomienia obu modułów.

---

## 1. Wymogi wstępne

1. **Node.js + pnpm**

   - Zainstaluj Node.js (zalecana wersja ≥16.x): [https://nodejs.org/](https://nodejs.org/)
   - Zainstaluj pnpm globalnie:

     ```bash
     npm install -g pnpm
     ```

   - Oficjalna strona pnpm: [https://pnpm.io/installation](https://pnpm.io/installation)

2. **.NET SDK**

   - Zainstaluj .NET SDK (zalecana wersja 8.0 lub wyższa): [https://dotnet.microsoft.com/en-us/download](https://dotnet.microsoft.com/en-us/download)
   - Upewnij się, że `dotnet` jest dostępny w ścieżce systemowej.

3. **Weryfikacja instalacji**
   Po zainstalowaniu sprawdź działanie w terminalu:

   ```bash
   pnpm --version    # np. 8.10.0
   dotnet --version  # np. 8.0.100
   ```

---

## 2. Instalacja zależności

### 2.1. Frontend (katalog `client`)

1. Przejdź do katalogu `client`:

   ```bash
   cd client
   ```

2. Zainstaluj zależności:

   ```bash
   pnpm install
   ```

3. (Opcjonalnie) Wróć do katalogu głównego:

   ```bash
   cd ..
   ```

### 2.2. Backend (katalog `server`)

1. Przejdź do katalogu `server`:

   ```bash
   cd server
   ```

2. Przywróć pakiety NuGet:

   ```bash
   dotnet restore
   ```

3. (Opcjonalnie) Wróć do katalogu głównego:

   ```bash
   cd ..
   ```

---

## 3. Konfiguracja zmiennych środowiskowych

### 3.1. Frontend (`client`)

1. Przejdź do katalogu `client` (jeśli jeszcze w nim nie jesteś):

   ```bash
   cd client
   ```

2. Utwórz plik `.env` – skopiuj zawartość pliku przykładowego:

   ```bash
   cp .env.example .env
   ```

3. Zarejestruj się w Mapbox: [https://account.mapbox.com/auth/signup/](https://account.mapbox.com/auth/signup/) i zaloguj.

4. W konsoli Mapbox (sekcja „Access Tokens”):

   - Utwórz nowy klucz (Publishable Token).

   ![](/images/create-token.png)

5. W pliku `.env` dodaj lub podmień linię:

   ```env
   VITE_MAPBOX_TOKEN=<TWÓJ_MAPBOX_TOKEN>
   ```

6. Wróć do katalogu głównego projektu:

   ```bash
   cd ..
   ```

### 3.2. Backend (`server`)

1. Przejdź do katalogu `server`:

   ```bash
   cd server
   ```

2. Zarejestruj się w Geoapify: [https://www.geoapify.com/reverse-geocoding-api](https://www.geoapify.com/reverse-geocoding-api) i utwórz projekt, aby uzyskać klucz API.

3. W konsoli Geoapify utwórz nowy klucz i skopiuj go.

   ![](/images/create-token-geoapify.png)

4. Zainicjuj mechanizm **user-secrets** i ustaw klucz:

   ```bash
   dotnet user-secrets init
   dotnet user-secrets set "Geoapify:ApiKey" "<TWÓJ_GEOAPIFY_API_KEY>"
   ```

5. Wróć do katalogu głównego projektu:

   ```bash
   cd ..
   ```

---

### 4. Uruchomienie aplikacji

By uruchomić aplikacje należy wejść do głownego katalogu projektu oraz wykonać komendy:

```
pnpm i
pnpm run dev
```

Aplikacja będzie dostępna pod url [http://localhost:3001/](http://localhost:3001/)

Dokumentacja serwera jest dostępna pod url [http://localhost:5114/scalar/](http://localhost:5114/scalar/)

## 7. Podsumowanie

- Zainstaluj **Node.js + pnpm** oraz **.NET SDK**.
- Sprawdź wersje: `pnpm --version`, `dotnet --version`.
- W katalogu `client` uruchom: `pnpm install`.
- W katalogu `server` uruchom: `dotnet restore`.
- Skonfiguruj zmienne środowiskowe:

  - Frontend: `client/.env` → `VITE_MAPBOX_TOKEN=<token z Mapbox>`
  - Backend: `dotnet user-secrets set "Geoapify:ApiKey" "<klucz z Geoapify>"`

- Uruchom aplikacje z katalogu głównego projektu `pnpm dev`
