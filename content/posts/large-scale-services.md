---
title: "TBD"
date: 2020-06-29T21:50:38-07:00
draft: true
---
Recently, I came to read this paper by James Hamilton titled `On Designing and Deploying Internet Scale Services` [1]. This paper was published in 2007, before I knew what software engineering was. The reason for this post is the fact that there is so much goodness in this paper that is still relevant today and is worth writing about.

The recommendations in this paper will make a ton of sense to you if you have ever operated and run a production service in your software engineering career. Specifically a production service, if and when unavailable, can cause revenue loss to the company. This post eases you into the concepts described in the paper, if I dare say, with an enhanced nomenclature.

### Service Design from Developers Perspective
#### Health check
Any service must implement a basic health check. This isn't an extensive test of all dependent systems. A basic 200 OK response code on `/health` is all that is needed.

#### Full testing environment
A developer should have access to a testing environment to run the service as a whole, even when making changes to individual components. Docker for example is a great tool to achieve this. A faithfully reproducible testing environment is a must to ensure developer productivity.

#### Avoid duplication
Avoid duplication of code or features in different components. For example if you need to add functionality to perform a business specific logic on an object, make it so that any other component can reuse the code. Add technical debt work items to your backlog to clean code up from duplication.

#### Operations utilities should be part of the service
Scripts and other operational utilities should be part of regular regular development cycle. They must be code reviewed, checked into version control and tested with same rigor as the service code itself.

#### Versioning
The paper encourages being able to run multiple versions of the service at the same time during deployments with the goal of running one version in production. One example of where this can be important is when version upgrade requires database migration, the n and n+1 versions of the service must be able to cope with running against partially run migration.

#### Deployments
Deployments should be one click and simple. Ideally once code is approved it goes through a series of tests and checks and gets promoted to production automatically.

### Service Design from Scaling and Resiliency Perspective
#### Zero trust on dependencies
If your service depends on a database, be prepared to serve traffic in a read-only mode if database failover is in progress. Expect latency to be an issue when calling external services. All interactions with external services should have timeouts. Idempotent operations allow for restart of requests however repeatedly failing requests can consume resources. One final note is about using circuit breakers to mark dependencies as faulty when failing and not call them again until proven healthy again.

#### Admission control
Always consider gate keeping the amount of work that can come into your service. An overloaded system can slow down even further if the requests keep coming in. Adding request throttling at service boundaries can be used to prevent excessive load. One the other side if you are a client consider using exponential backoff on outgoing requests.

#### Service partitioning
Partitioning is great at making a service horizontally scalable. However the partitioning scheme to consider is important. The finer grained the partitioning scheme is, the better. The paper mentions a lookup table that maps to fine grained entities on which the partitioning is based on. Consistent hashing is one such approach.

#### Understand access patterns
When adding new features to a service, understand the kind of load it is going to add to the service. A basic question as pointed out in the paper is to ask with every new feature "What impacts will this feature have on the rest of the infrastructure?". A common example is forgetting the load the new feature is going to have on the bottlenecked database.

#### Network design
Network request load between servers, racks running these servers, and data centers is important to understand. Your service better be not making inter data center calls within critical transactions.

#### Avoiding single points of failure
Single points of failure should be avoided. Global state stored in memory without persistence is an example of SPoF. As an another example databases can often be the single point of failure in many services. Database copies should exist with failover mechanisms tested regularly.

#### Services should be geo-distributed
When possible high scale services must be running across several data-centers. This is useful from the latency perspective but also applies from operations perspective, if for example one datacenter faces outage or has capacity shortage - load can be shed to another datacenter.

#### Dependent Services



#### Introduce artificial failures regularly
Aka chaos engineering now days, controlled burn out of servers, network and other components can expose weakness early - avoiding embarrassment later.

### Service Design from Operations Perspective
#### Allow for manual intervention
Certain times you'll need human intervention to bring a service back to a healthy state. Recognize that these scenarios will occur and operators must have necessary privileges to take action. With each instance of such event thought must be given into automating the fix and addressing the root cause. You do not want to be figuring out the solution to a problem that you have already seen during outage time.

#### Keep Service Design Simple
If an optimization adds complexity to your service design it should only be considered if it happens to provide an order of magnitude increase in efficiency or cost. [Add an example]

#### Analyze throughput and latency
Identifying service metrics is important. A service metric will help tie work load to resource planning. Examples of service metrics are number of requests per second, concurrent users per system, etc. How these metrics will be impacted during deployments, and other operational tasks like database migrations should also be documented and understood.

#### Restartable
Use stateless implementations when possible. A service should be able to restart and all state when necessary should be persisted redundantly.

#### Automated provisioning
Provisioning for service infrastructure should be automated. Several declarative tools exist today that enable allows for managing service infrastructure. The paper talks about "installation" but that aspect isn't as relevant today with containerized deployments.
