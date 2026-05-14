# Instrukcja: Cloudflare Worker dla DroneWX Kp Index

## Krok 1 — Załóż konto Cloudflare (darmowe)
1. Wejdź na https://dash.cloudflare.com/sign-up
2. Zarejestruj się (email + hasło, nie potrzeba domeny)

## Krok 2 — Utwórz Worker
1. Po zalogowaniu kliknij **Workers & Pages** (lewy panel)
2. Kliknij **Create** → **Create Worker**
3. Nadaj nazwę np. `dronewx-kp`
4. Kliknij **Deploy** (zignoruj domyślny kod)
5. Kliknij **Edit code**

## Krok 3 — Wklej kod workera
1. Usuń cały domyślny kod w edytorze
2. Wklej zawartość pliku **kp-worker.js** z tego repo
3. Kliknij **Deploy** (prawy górny róg)

## Krok 4 — Skopiuj URL workera
Po wdrożeniu zobaczysz URL w formacie:
```
https://dronewx-kp.TWOJA-SUBDOMENA.workers.dev
```
Skopiuj ten URL.

## Krok 5 — Wklej URL do aplikacji
W pliku `index.html` znajdź linię:
```javascript
const WORKER_URL = 'https://TWOJ-WORKER.TWOJA-SUBDOMENA.workers.dev';
```
Zastąp ją swoim URL, np.:
```javascript
const WORKER_URL = 'https://dronewx-kp.jan-kowalski.workers.dev';
```
Zapisz i wgraj `index.html` na GitHub Pages.

## Krok 6 — Sprawdź działanie
Otwórz URL workera bezpośrednio w przeglądarce — powinieneś zobaczyć JSON z danymi Kp.

## Limity darmowego planu
- 100 000 requestów / dzień — wystarczy na lata codziennego użytkowania
- Brak karty kredytowej
- Worker działa globalnie na CDN Cloudflare
