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
designing APIs.

## Model Resources
Model resources the API is going to vend and then define the actions a client
can take over these resources. This helps divide and conquer the complex
undertaking. Note that these resources aren't necessarily database objects, they
may not exist in your backend database, they may represent ephemeral objects
that only make sense to the client calling your APIs.
When defining model resources here a few key things to keep in mind:
1. Be consistent across resource naming, using the naming convention common to
your team/organization.
2. Choose a date time format and stick to it. ISO 8601 is human readable
and very common to use. Use UTC and let the clients do conversion to local
timezone.

## Well Defined SLAs
Another important consideration when designing APIs is to think about the SLAs
(Service Level Agreements) in terms of latency and throughput. You should be
thinking about these upfront when designing new APIs since this can impact
the service implementation quite a bit, for example, to decide weather to use
caching. It can also inform defining the resource shapes to expose, for example
if fetching subset of the resource is costly then maybe the it's skipped in
default response unless explicitly requested for. Maybe you need two different
APIs in the first place. There may be tradeoffs between meeting service SLAs
and cleanly defining the model resources.

## Multi-tenancy
If you're API is going to be consumed by multiple clients, some sort of access
control becomes crucial. This includes things like authentication, authorization
and rate limiting. Authentication is about establishing trust that the client is indeed
who they claim to be, authorization is about enforcing actions the authorized client
can perform. Rate limiting is a special mechanism in which as a API owner one sets
limits on number of operations a client can make in a given amount of time. In most
cases the client if being throttled should expect to decrease the rate at which
they call the APIs in order to not see throttling. [Token bucket](https://en.wikipedia.org/wiki/Token_bucket) algorithm is an example of an algorithm that is widely used to implement rate limiting.

## Idempotent Operations
Idempotency can sometimes trip developers. Generally you'd want to keep operations
idempotent but that does not mean that you can expect your requests to be safe.
For example, consider an API that increments a counter by 1. If one request
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
go ahead and start the long running job. In most cases you'd want to return a
computation ID that the client can request the status of the job. Note that this
can mean a ton of complexity on the backend to implement, but may be worthwhile
(or even necessary) to implement.

## Pagination
Pagination is often qouted as a solution to the client being able to process large
responses. However if properly designed you do not need to keep any state in your
application and often simply translate the query parameters to a database query.
Note that with this approach if the underlying records change while a client is
paginating, the client will see inconsistent results. Ideally you're
providing `next` and `previous` URLs within the API response
(see [HATEOAS](!https://en.wikipedia.org/wiki/HATEOAS)) so that the client does
not need to do any guessing on their part on how to paginate.

## HTTP Headers
[HTTP headers](!https://en.wikipedia.org/wiki/List_of_HTTP_header_fields) are a
powerful way to communicate between the client and server all operating
parameters of web request. These can include ability to specify cache-control,
authentication and authorization headers, content-type, user-agent, cookies etc. Note
that proxy servers have the ability to modify headers so you'd have to be careful about
what the setup of your backend is and allow for headers to pass through if
necessary.
