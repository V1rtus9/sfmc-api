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
* DataExtension
    * name
    * isSendable
    * fields
    * count
    * rows
    * rows2 (unofficial)
    * insertOrUpdate
* Journey Builder
    * getJourney
    * getJourneys
        * page
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

##### Step 2. Require/import  the package
```js
    const {SfmcApi} = require('sfmc-api');
```

```js
    import {SfmcApi} from 'sfmc-api';
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
    const contactBuilder = instance.getContactBuilder();
    const de = contactBuilder.getDataExtension(`external key`);
    
    const rows = de.rows();
    const name = de.name();
    const count = de.count();
    const fields = de.fields();
```

```js
    const journeyBuilder = instance.getJourneyBuilder();
    const journey = journeyBuilder.getJourney(`id`);
    const journeys = journeyBuilder.getJourneys();
```

## Usage:

Check https://github.com/V1rtus9/sfmc-api/tree/master/tests for examples.

