# GPS

## Kako zaceti

1. Skloniras repozitorij: ```git clone git@github.com:andrejborstnik/track-collector.git```
2. Gres v repozitorij
3. Zazenes aktivacijsko skripto: ```.alot/bin/activate.sh dev``` (in pocakas da se polodajo vsi node moduli - ce opazite, da sem kaksnega prevec pustil kar zbrisite)
4. Zazenes aplikacijo: ```op-start```
5. Ko se aplikacija zgradi (par sekund) lahko spreminjas kodo in ko shranis se spletna stran sama osvezi. V konzoli, kjer si zagnal ```op-start``` vidis morebitne napake pri grajenju. Javascript napake pa vidis v konzoli browserja.

## Hello world

1. Nekje pod ```src``` direktorijem naredis nov file, lahko vzames za osnovo npr. ```Test.vue```.
2. Naredis vsaj eno od:
   * Narejeno komponento vkljucis v drugo komponento, kot je v ```Test2.vue```.
   * Narejeno komponento v ```routes.js``` uvozis in jo dodas na nek url naslov.


Ce nalagate node module jih ne pozabit shranit, da bo aplikacija delala vsem. Nalagajte jih (za frontend del) v ```./frontend/```. Npr. ko ste v direktoriju ```frontend``` s ```npm install moj-modul --save```.