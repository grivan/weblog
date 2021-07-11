---
title: "Thoughts on API Design"
date: 2021-07-08T20:25:51-07:00
---
This post is about designing APIs. Recently I've been working to re-define APIs
for a service. Unfortunately during this process, I have realized there is
no silver bullet when designing APIs. A lot about the API design will depend
on the clients consuming the API, how the data is available to the backend
service to query and the SLAs being promised. However, there some general best
practices I came across that remain relevant when designing new APIs and tried
to distill them down to this post.

So here to goes, in no particular order, key things to keep in mind while
designing APIs:

## Model Resources
Model the API in terms of resource objects and then define the actions a client
can take over these resources. The resources may be real or virtual objects
that may or may not be tied to a database record. Modeling resources correctly upfront
is critical since changing/restructuring these resources will involve breaking
changes for the clients consuming the APIs.

When defining model resources here a few key things to keep in mind:
1. Be consistent in naming resource and operations that can be performed on
them, use the naming convention common to your team/organization.
2. Consider the number of data base queries / external dependencies required in
constructing a response.
3. Consider the size of responses, allow clients to request extra information
when necessary instead of creating a bloated standard response.
4. Choose a date time format and stick to it. ISO 8601 is human readable
and very common to use. Use UTC and let the clients do conversion to local
timezone.
5. Consider implementing API versioning upfront. I haven't come across a standard
way to version APIs, so use what makes sense. One can version APIs top level or
version individual resources.
6. There may be tradeoffs between meeting service SLAs (see section below) and
defining resources.

## Well Defined SLAs
Another important consideration when designing APIs is to think about the SLAs
(Service Level Agreements) in terms of latency and throughput. You should be
thinking about these upfront when designing new APIs since it can impact
implementations quite a bit. For example, if you already have a database that
you're building a new API on top of - you may want to consider load testing the exact
queries that are expected to run when your service starts to take production
traffic and have room for growth. If you expect your resources to not
change often you may be able to simply add caching to offload load on the primary
data stores. In my perspective meeting SLAs and modeling resources are closely
related and tradeoffs are to be made depending on the business use cases and
existing data store infrastructure available.

## Multi-tenancy
If you're API is going to be consumed by multiple clients, some sort of access
control becomes crucial. This includes things like authentication, authorization
and rate limiting. Authentication is about establishing trust that the client is indeed
who they claim to be, authorization is about enforcing actions the authorized client
can perform. Rate limiting is a mechanism in which clients are limited in terms of
number of operations they perform in a unit amount of time. In most
cases the client if being throttled should expect to decrease the rate at which
they call the APIs in order to not see throttling. [Token bucket](https://en.wikipedia.org/wiki/Token_bucket) algorithm is an example of an algorithm that is widely used to implement rate limiting. Note that
you usually want to enforce throttling limits per operation and also globally.

## Idempotent Operations
Idempotency is difficult to understand. Generally you'd want to keep operations
idempotent but that does not mean backend state is not altered due to
a idempotent operation. It simply means an operation can be repeated without any
side effects. As an example if you issue `DELETE` to an resource, issuing another
`DELETE` would simply return a 404 without altering the server state. Consider another
more involved example, let's take an API that increments a counter by 1. If one request
fails to register as successful on the client side due to a network connection error
and the client performs another request as a retry the final value at the backend
maybe either 1 or 2 - depending on if the first request finished executing on the API.
For addressing such issues, [Stripe APIs](!https://stripe.com/docs/api/idempotent_requests)
take an interesting approach by providing a custom header that uniquely identifies a request.
The server can simply ignore the second request since it knows it has already
processed the request once.

## Asynchronous vs Synchronous
Depending on the type of work being done on the backend, sometimes it makes
sense to do "just enough" work and return a response to the client. For example,
if you're kicking off a long running job given a client request you may only want
to create a record in your database (or enqueue the request on a durable queue)
to register the request on your backend and then have a different set of processes
kick off the long running job. In most cases you'd want to return a
computation ID that the client can request to get the status of the job. Note that this
can mean a ton of complexity on the backend to implement, but may be worthwhile
(or even necessary) to implement if amount of time taken to finish the operation
takes a while.

## Pagination
Pagination is often presented as a solution when the response may contain too many objects
to safely return in one operation. If properly designed you do not need to keep any state in your
application and often simply translate the query parameters to a database query.
Note that with this approach if the underlying records can change while a client is
paginating, and the client will see inconsistent results which should be expected and dealt with
on the client side. Ideally you're providing `next` and `previous` URLs within the API response
(see [HATEOAS](!https://en.wikipedia.org/wiki/HATEOAS)) so that the client does
not need to do any guessing on their part on how to paginate.

## HTTP Headers
[HTTP headers](!https://en.wikipedia.org/wiki/List_of_HTTP_header_fields) are a
powerful way to communicate between the client and server all operating
parameters of web request. These can include ability to specify cache-control,
do authentication and authorization, specify content-type, user-agent, cookies etc. Note
that proxy servers have the ability to modify headers so you'd have to be careful about
what the setup of your backend is and allow for headers to pass through if
necessary.
