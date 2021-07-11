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
    * find
    * find2 (unofficial)
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


