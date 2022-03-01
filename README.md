sfmc-api
============

Salesforce Marketing Cloud Api Library for Node

## Overview ##

The Sfmc Api for Node provides fast and easy access to Salesforce Marketing Cloud's api services, including a collection of REST APIs and a SOAP API. These APIs provide access to Salesforce Marketing Cloud functionality via common collection types. 

## Available methods in this version:

* Contact Builder
    * getDataExtension
    * createDataExtension
    * deleteDataExtension
* Content Builder
    * createAsset
    * deleteAsset
* DataExtension
    * getName
    * isSendable
    * getFields
    * getCount
    * getRows
    * getRows2 (unofficial)
    * insertOrUpdate
* Journey Builder
    * getJourney
    * getJourneys
        * page
        * orderBy
        * pageSize
        * nameOrDescription (search journeys by name or description)
    * getJourneysCount
* Journey
    * stop
    * pause
    * resume
    * update
    * publish
    * newVersion


## How to use

##### Step 1. Install the package

```
    npm i sfmc-api
```

##### Step 2. Import/require the package

```js
    import {SfmcApi} from 'sfmc-api';
```

```js
    const {SfmcApi} = require('sfmc-api');
```

##### Step 3. Create api instance
```js
    const instance = new SfmcApi({
        accountId,
        clientId,
        subdomain,
        clientSecret
    });
```

##### Step 4. Start working with api

```js
    const cb = instance.getContactBuilder();
    const de = cb.getDataExtension(`external key`);
    
    const rows = await de.getRows();
    const name = await de.getName();
    const count = await de.getCount();
    const fields = await de.getFields();
```

```js
    const jb = instance.getJourneyBuilder();
    
    const journeys = await jb.getJourneys();
    const journey = await jb.getJourney(`id`);
    const journeysCount = await jb.getJourneysCount();
```

## Usage:

[`Examples`](https://github.com/V1rtus9/sfmc-api/tree/master/tests)

## Versions:

   * 1.0.0
   * 1.1.0
   * 1.1.1
   * 1.2.0
