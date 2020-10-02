---
title: "Website Stats"
date: 2020-08-12T22:59:09-07:00
draft: true
---
Google Analytics is great, but since I host this website on `aws` I wanted to try out building a basic website tracking software. The goals for this project are:
1. Track visitor metric on any page on this website
2. There should be a way to query and display the metrics
3. Stay within the AWS ecosystem (the time I authored this I worked at Amazon)

Great! Now how do we get there. In order to track visitor metrics, I need the metrics being recorded in the first place. What could be the data sources? Where will the data be processed? How long will it be stored? Cost of storage? Oh my.

To simplify, I'll start with a data model. A data model can help build a mental model of what we're going to build.

### Ingress Data Model
An `Event` is the basic data model for the ingress points. It can have the following fields.
- `timestamp`
- `path`
- `agent`
- `ip_addr`

Let's talk about each of their fields, the ISO-8601 (`YYYY-MM-DDThh:mm:ssTZD`) UTC `timestamp` is when the page visit occurred. `path` is a string representing that page visited. `agent` is a string of the user-agent and finally `ip_addr` is the IP Address of user that made the request (we'll need to make sure to anonymize this).

### Sources of Website Access Data
The data could come from embedded `js` on each of the website pages, but then I need to maintain a server to listen to these events. How can we simplify? Since this website is hosted on `aws` I have access to access-logs for the website. For now this will suffice. Incidentally there is also location data available for the website visitor!

### ETL
Now we need some sort of an ETL that can periodically parse the logs and find distinct users with their locations.


### Webservice
We'll need some sort of API endpoint that can receive these `event`'s and process and then store then in `S3` as `StoredEvent`'s, this API internally will call geolocation service that can resolve our IP address to a `lat`/`long`. We will need to think about authentication here since we only want our client code to be able to call this public API endpoint (more on this in next section). A simple RESTful interface could look like:
```
POST /event
{
  timestamp: YYYY-MM-DDThh:mm:ssTZ,
  path: string,
  agent: Mozilla/5.0,
  ip_addr: 10.10.10.10
}
```

#### Securing Webservice
TODO


## Analytics
Amazon Athena?
Data Visualization?
