# GPS

## Kako začeti

1. Skloniraš repozitorij: ```git clone git@github.com:andrejborstnik/track-collector.git```
2. Greš v repozitorij
3. Zaženes aktivacijsko skripto: ```.alot/bin/activate.sh dev``` (in počakaš da se poloadajo vsi node moduli - če opazite, da sem kakšnega prevec pustil, kar zbrišite)
4. Zaženeš aplikacijo: ```op-start```
5. Ko se aplikacija zgradi (par sekund) lahko spreminjaš kodo in ko shraniš se spletna stran sama osvezi. V konzoli, kjer si zagnal ```op-start``` vidiš morebitne napake pri grajenju. Javascript napake pa vidiš v konzoli browserja.
6. Če so napake jih moraš odstraniti. Preveri če imaš ključ ("Secret za resetiranje gesel:") v '../../secrets.json' kar je v isti mapi kot je track-collector. Če ključa nimaš ga vzemi is skupne beležke. Tam je tudi aktivacijsko ime in geslo. Datoteka secrets.json za enkrat izgleda takole:
```json
{
  "passwordReset" : "***"
}
```
Tri zvezdice se smiselno nadomesti z "Secret za resetiranje gesel:" iz skupne beležke.

7. Podobno velja za datoteko '../../local.config', ki izgleda npr. takole (na serverju). Pri sebi si raje nastavite fe_path na '/':
```json
{
        "java_be": "https://test.goopti.com",
        "be_path": "/tracker",
        "url": "https://test.goopti.com",
        "fe_path": "/trackcollector",
        "be_port": "3102",
        "fe_port": "3002"
}
```

8. Če program op-start javi napako naredi še znotraj mape:
track-collector/frontend/build/.cache
datoteko z imenom:
dependencies.json
in vsebino:
```json
{}
```


## Frontend

1. Nekje pod ```src``` direktorijem naredis nov file, lahko vzames za osnovo npr. ```Test.vue```. Uporabljas lahko [ES6](http://es6-features.org/) sintakso.
2. Naredis vsaj eno od:
   * Narejeno komponento vkljuciš v drugo komponento, kot je v ```Test2.vue```.
   * Narejeno komponento v ```routes.js``` uvoziš in jo dodaš na nek url naslov.
 
Če nalagate node module jih ne pozabit shranit, da bo aplikacija delala vsem. Nalagajte jih (za frontend del) v ```./frontend/```. Npr. ko ste v direktoriju ```frontend``` s ```npm install moj-modul --save```.

Za izgradnjo aplikacije uporabljamo komponente po oblikovalskem principu [Material Design](https://material.io/guidelines/), ki je osnova Googlovih desktop in mobile aplikacij, posebej na Androidu. Specifično, uporabljamo knjižnico komponent [Vuetifyjs](https://vuetifyjs.com/vuetify/quick-start).

## Baza (DEPRICATED)

V ```backend/config/config_default.js``` je potrebno napisati kje se nahaja baza, kakšna so uporabniška imena ipd. Predlagam, da se za zdaj kar ohrani to kar sem napisal. V komponenti ```PostGreDemo.vue``` in na backendu sem naredil preprost api, s katerim lahko dostopate do baze s prej opisanimi parametri. Parametri za query (se) niso povsem implementirani.

## Api

* [Test Deployment API (Swagger)](https://test.goopti.com/tracker/)
* [GIT](https://github.com/alenFMF/tracker)

## Backend 

1. Napises funkcijo, ki jo rabis na backendu in jo pospravis na primerno mesto v ```src```.
2. Uporabis v ```routes.js```. Tam in v ```backend.js``` lahko tudi konfiguriras express.

Vec o Vue frameworku najdes na [https://vuejs.org/]('https://vuejs.org/').


-----


Projekt sofinancirata Republika Slovenija in Evropska unija iz [Evropskega socialnega sklada](http://www.eu-skladi.si/). 

![Logo](https://github.com/jborlinic/strojno_ucenje/blob/master/logo.png)

