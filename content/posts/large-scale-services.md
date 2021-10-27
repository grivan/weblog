---
title: "Designing Large Scale Services"
date: 2021-10-26T19:50:38-07:00
---
Recently, I came to read this paper by James Hamilton titled [On Designing and Deploying Internet Scale Services](https://www.usenix.org/legacy/event/lisa07/tech/full_papers/hamilton/hamilton.pdf). This paper was published in 2007 - at the time of writing this post **14** years have passed since the paper was published. Adoption of microservice architectures was not quite a thing yet, docker wasn't released, heck this was even before I wrote any line of production code. It's an old paper, yes, but I found many of the recommendations in the paper to be ever more relevant. The recommendations in this paper will make a ton of sense to you if you have ever operated and run a production backend service. Specifically a production service, if and when unavailable, can cause revenue loss to the company. This post eases you into the concepts described in the paper, if I dare say, with an updated and enhanced vocabulary since 2007.

I've distilled and reclassified the recommendations into three distinct areas. Fist from the perspective of the developers authoring and maintaining the service, second from the perspective of resiliency and scaling and lastly from the perspective of day to day operations of the service.

### Service Design from Developers Perspective

**Full testing environment**
A developer should have access to a testing environment to run the service as a whole, even when making changes to individual components. Docker for example is a great tool to achieve this. Faithfully reproducible testing environment is a must to ensure developer productivity. In addition to being able to fully instantiate an isolated local test environment, you'd have a production environment, a pre-production environment and integration environment.

**Code Cleanliness**
Avoid duplication of code or features in different components. For example if you need to add functionality to perform a business specific logic on an object, make it so that any other component can reuse the code. Add technical debt work items to your backlog to clean code up from duplication. The level of abstraction can start small but generally as the service grows some of the tech debt should be paid off to isolate and refractor components.

**Operations utilities**
Scripts and other operational utilities should be part of regular regular development cycle, they must be code reviewed, checked into version control and tested with same rigor as the service code itself.

**Versioning**
The paper encourages being able to run multiple versions of the service at the same time during deployments with the goal of running one version in production. Versioning helps create a checkpoint that can be "rolled" back to in case of emergencies. A version generally is a set of commits (if using multiple code repositories) and a list of dependencies pegged at specific release versions.

**Deployments**
Deployments should automated and simple. Ideally once code is approved it goes through a series of checks and tests should get promoted to production automatically. Having CI/CD pipelines that are fully automated are common in well oiled engineering organizations.

**Health check**
Any service should implement a basic health check. This isn't an extensive test by any means. A basic 200 OK response code on `/health` is all that is needed. If this health check passes that means the service can receive and respond to a client request. This can be helpful in setting up developer environments and during deployments to ensure service is up before adding
it behind a load balancer.

### Service Design from Scaling and Resiliency Perspective
**Zero trust on dependencies**
If your service depends on a database, be prepared to serve traffic in a read-only mode if database failover is in progress. Expect latency to be an issue when calling external services. All interactions with external services should have timeouts. Idempotent operations allow for restart of requests however be careful that repeatedly restarting failing requests can consume resources. A [circuit breaker](!https://martinfowler.com/bliki/CircuitBreaker.html) is a common pattern in the micro-services world to prevent cascading failures due to failing dependencies.

**Request throttling**
Always consider gate keeping the amount of work that can come into your service. An overloaded system can slow down even further if the requests keep coming in. Adding request throttling at service boundaries can be used to prevent excessive load. One the other side if you are a client consider using exponential backoff on outgoing requests. The Google SRE book has a nice [readup](https://sre.google/sre-book/handling-overload/) on handling service overload.

**Service partitioning**
Partitioning is great at making a service horizontally scalable. However the partitioning scheme to consider is important. The finer grained the partitioning scheme is, the better. The paper mentions a lookup table that maps to fine grained entities on which the partitioning is based on. Sometimes service partitioning goes hand in hand with how your datastores are partitioned. To give you some trivia, Akamai technologies was founded on the idea of `Consistent Hashing`, a technique that minimizes the number of key remaps compared to a traditional `modulo` operation when used for mapping partitions, and thus reducing downtime when scaling out, giving birth to the `Content Delivery Network` industry.

**Understand access patterns**
When adding new features to a service, understand the kind of load it is going to add to the service. A basic question as pointed out in the paper is to ask with every new feature "What impacts will this feature have on the rest of the infrastructure?". A common example is forgetting the load the new feature is going to have on the bottlenecked database.

**Network design**
Understanding network request load between servers, racks running these servers, and data centers is important to understand. Ideally you're not making cross region/data center calls within critical transactions.

**Avoiding single points of failure**
Single points of failure should be avoided. Global state stored in memory without persistence is an example of SPoF. As an another example, databases can often be the single point of failure in many services. Database copies should exist with failover mechanisms tested regularly.

**Services should be geo-distributed**
When possible high scale services must be running across several data-centers. This is useful from the latency perspective but also applies from operations perspective, if for example one datacenter faces outage or has capacity shortage - load can be shed to another datacenter.

**Introduce artificial failures regularly**
Also known as [chaos engineering](https://netflix.github.io/chaosmonkey/) in today's software world, controlled burn out of servers, network and other components can expose weakness early - avoiding embarrassments later.

### Service Design from Operations Perspective
**Allow for manual intervention**
Certain times you'll need human intervention to bring a service back to a healthy state. Recognize that these scenarios will occur and service operators must have necessary privileges to take action. With each instance of such event thought must be given into automating the fix and addressing the root cause. A paper trail of actions taken by an operator to restore service operations is a must. You do not want to be figuring out the solution to a problem that you have already seen.

**Keep Service Design Simple**
If an optimization adds complexity to your service design it should only be considered if it happens to provide an order of magnitude increase in efficiency or cost. Adding caching is an example, while easy to add, now you need to worry about cold starts, data staleness and failure of the cache itself.

**Analyze throughput and latency**
Identifying service metrics is important. A service metric will help tie work load to resource planning. Examples of service metrics are number of requests per second, concurrent users per system, etc. How these metrics will be impacted during deployments, and other operational tasks like database migrations should also be documented and understood.

**Restartable**
Use stateless implementations when possible. A service should be able to restart and all state should be persisted. This greatly simplifies an operators job in case of failures.

**Scaling**
Provisioning for service infrastructure should be automated to an extent possible. Several declarative tools exist today that enable allows for managing service infrastructure (AWS CDK, Terraform, etc). The paper talks about "installation" of servers with service software but that aspect isn't as relevant today with containerized deployments.
