---

layout: post
title: "How to scale a RoR Application"
date: 2023-06-17
short_description: "Know the difference between scaling an application horizontally or vertically and find out why scalability is important for a Ruby on Rails application."
cover: /assets/images/covers/en/rails-scalability.png
categories:
- Article
tags:
- Ruby On Rails
---

# How to scale a RoR application
Learn the difference between scaling an application horizontally or vertically and find out why scalability is important for a Ruby on Rails application.

<div>
  <img src="/assets/images/covers/en/rails-scalability.png" alt="" class=" w-100 img-fluid rounded-3 shadow mb-4">
</div>

# What is scalability?

A framework is considered scalable when it allows an application to be built quickly, efficiently, and can grow and adapt to changes in demand without compromising performance or stability.

Ruby on Rails is considered scalable because it is a modularized framework composed of several other frameworks specialized in various behaviors, such as ActiveRecord, which is responsible for mapping application classes to database tables, ActiveStorage, which facilitates image upload to servers, ActionMailer, which allows sending emails directly from the application, among others. In addition, the Rails philosophy values a composite framework, seeking to reduce the number of decisions a developer needs to make while keeping the framework flexible and easy to customize.

When developing a Ruby on Rails application, it is important to keep in mind that it can grow and that at some point it will be necessary to scale the application.

**But after all, what is scalability and why is it important?**

Initially, when the application is still small, it may be possible for it to run on a single server, but as it grows, both in number of users and in managed services, it is necessary to add more resources so that it continues to work well.

One thing is certain, your application will become slow or even break as traffic increases, so making users wait too long means they will likely give up using your application and look for a more efficient one. In turn, losing customers reduces revenue and can even cause your company to close its doors.

Scalability is the ability of an application to grow without affecting performance. It is important to keep in mind that scaling an application is not just adding more resources. For the application to be scalable, it must be developed properly.



#### 5 Tips on scalability


- **Plan scalability from the start**: When designing the architecture of the application, take into account how it can be scaled in the future. This may include choosing technologies and approaches that facilitate scalability.

- **Monitor application performance**: It is important to monitor the performance of the application to identify bottlenecks and problems that may affect its ability to scale. Use monitoring tools to collect metrics and make informed decisions about how to scale the application.

- **Optimize code**: Optimize the code of the application to ensure that it is efficient and can handle an increase in traffic and workload. This may include optimizing database queries, reducing resource usage and improving data structure.

- **Use scalable technologies**: Use technologies that facilitate scalability, such as containers and orchestration platforms. These technologies can help manage and scale the application more efficiently.

- **Test scalability**: Regularly test the scalability of the application to ensure that it can handle an increase in traffic and workload. Use load testing tools to simulate an increase in traffic and identify problems that may affect the ability of the application to scale.

Considering the data flow of a web application, i.e., Browser / Server / Application / Database, it is possible to optimize your code at each point, improving the performance of the application before scaling it.


<div class="">
  <div class="row">
    <div class="col-12 col-md-3 ">
      <p class="fw-bold mb-2 bg-secondary rounded-3 text-center text-white " > Browser Improvements</p>
      <ul class="">
        <li> Minify CSS and JS files </li>
        <li> Optimize application cache </li>
        <li> Compress images </li>
        <li> Reduce the number of requests </li>
      </ul>
    </div>
    <div class="col-12 col-md-3 ">
      <p class="fw-bold mb-2 bg-secondary rounded-3 text-center text-white " > Server Improvements</p>
      <ul class="">
        <li> Set a maximum number of connections </li>
        <li> Set a request timeout </li>
        <li> Set an appropriate keep alive </li>
      </ul>
    </div>
    <div class="col-12 col-md-3 ">
      <p class="fw-bold mb-2 bg-secondary rounded-3 text-center text-white " > Application Improvements</p>
      <ul class="">
        <li> Delegate heavy work to appropriate services </li>
        <li> Perform operations asynchronously </li>
        <li> Use libraries with good performance </li>
        <li> Optimize database queries </li>
      </ul>
    </div>
    <div class="col-12 col-md-3 ">
      <p class="fw-bold mb-2 bg-secondary rounded-3 text-center text-white " > Database Improvements</p>
      <ul class="">
        <li> Use indexes </li>
        <li> Pre-process data directly in the Database </li>
        <li> Use the appropriate amount of memory </li>
        <li> Check slow query log</li>
      </ul>
    </div>
  </div>
</div>


--------

# When to scale?

Despite the improvements mentioned above, at some point it will be necessary to scale the application. But when?
The answer is simple: **when the application starts to get slow**.

To know if the application is slow, it is necessary to monitor the application. There are several tools that can be used to monitor the application. Remember that it is important to monitor the application in production, as this is the environment where the application will be used by users.

With the metrics in hand, it is possible to analyze the performance of the application and identify bottlenecks, from this, it is possible to identify what is causing the slowness and correct the problem. To facilitate analysis, it is important that metrics are presented graphically.

There are several tools that can be used to monitor the application. Some of them are:


<style>
      /* Adicione estas regras CSS personalizadas */
      .image-container {
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .image-container img {
        max-height: 100%;
      }
      
    </style>

<div class="container">
  <div class="row">
    <div class="col-md-3 d-flex flex-column align-items-center">
      <div class="h-auto" >
      <a href="https://newrelic.com/" target="_blank" class="text-decoration-none image-container mb-2" >
        <img class="" height="40" src="https://th.bing.com/th/id/R.6a779bbf448d50da3e93c19e07d9821c?rik=1HPOi08fhv7ucg&pid=ImgRaw&r=0" alt="New Relic" > 
      </a>
      </div>
      <p><strong>New Relic</strong>: is a performance monitoring platform that provides real-time insights into the performance of your application, database, and servers.</p>
    </div>
    <div class="col-md-3 d-flex flex-column align-items-center">
      <div class="h-auto" >
      <a href="https://scoutapm.com/" target="_blank" class="text-decoration-none image-container mb-2" >
        <img class="" height="80" src="https://assets.scoutapm.com/assets/public/scout_logo-f2ab3019302500d22b77f24685298b91e8b1fd4778ba5f67368cde418476f513.png" alt="Scout APM" > 
      </a>
      </div>
      <p><strong>Scout APM</strong>: is a performance monitoring tool that offers features such as transaction tracing, custom metrics monitoring, and real-time alerts.</p>
    </div>
    <div class="col-md-3 d-flex flex-column align-items-center">
      <div class="h-auto" >
      <a href="https://accedian.com/platform/skylight/" target="_blank" class="text-decoration-none image-container mb-2" >
        <img class="" height="30" src="https://i.ibb.co/N7sLjKw/A-SKYLIGHT-Gold-White.png" alt="Skylight" > 
      </a>
      </div>
      <p><strong>Skylight</strong>: is a performance monitoring tool designed specifically for Ruby on Rails applications. It provides insights into the performance of your database queries, view rendering, and more.</p>
    </div>
    <div class="col-md-3 d-flex flex-column align-items-center">
      <div class="h-auto" >
      <a href="https://www.datadoghq.com/" class="text-decoration-none image-container mb-2" >
        <img class="" height="75" src="https://imgix.datadoghq.com/img/dd_logo_n_70x75.png?ch=Width,DPR&fit=max&auto=format&w=70&h=75" alt="DataDog">
        <img class="" height="14" src="https://imgix.datadoghq.com/img/dd-logo-n-200.png?ch=Width,DPR&fit=max&auto=format&h=14&auto=format&w=807" alt="DataDog">
      </a>
      </div>
      <p><strong>Datadog</strong>: is a monitoring and analysis platform that allows you to monitor the performance of your application, infrastructure, and logs in one place.</p>
    </div>
  </div>
</div>

It is important to note that each application is a different case, so there is no rule for knowing when to scale the application.

-------

# Vertical Scalability

Vertical scalability, also known as *scale up*, is when the application grows by adding more resources to the server, such as memory, processing, etc. This type of scalability is simpler to implement, as it does not require changes to the application, however it has a limit, as it is not possible to add resources infinitely to the hardware used as a server.

Vertical scalability is more suitable for applications that do not have a large volume of data, or that do not have a large number of simultaneous users and is usually used by companies with low purchasing power, since this method is usually cheaper than the horizontal mode.

The main advantage of this mode is that making this type of improvement is relatively easy compared to the horizontal mode. In addition to the resource limitation, vertical scalability also has the disadvantage that being a single server, if the server goes down, the application also goes down, as there is no other server to take over the service. The same happens when it is necessary to update the application, as it is necessary to stop the server to update.

Finally, it is relevant to mention that this type of scalability keeps the application data in one place, which can generate slowness when traffic on the application is intense, and despite having boosted the server with more resources, making it capable of interpreting more requests per minute, this type of implementation may only postpone the slowness problem depending on the context of your application.

# Horizontal Scalability

Horizontal scalability, also known as *scale out* is when the application grows by adding more servers. However, doing this is not as simple as it seems. It is necessary to make the servers communicate consistently, since normally the servers keep partitioned data, i.e., each server has a part of the data.

Scaling an application horizontally brings some specific advantages such as the possibility of adding more servers as needed, adding servers in different regions to reduce response time for users in that region, and also the possibility of adding servers with different configurations, delegating part of services to servers with more resources.

Another advantage of scaling an application horizontally is that it is possible to add servers with different technologies, such as adding a NodeJS server to serve static files while Ruby on Rails servers serve only dynamic data.

With regard to application updates, horizontal form also brings advantages as it allows updating servers one by one without taking the application offline. Similarly when a server has problems it can be removed from cluster without taking down application since demand will be met by other servers.

-------
# How to scale?

Docker and Kubernetes are two technologies that can help scale web applications. Docker is a container platform that allows applications to be packaged and deployed as containers, while Kubernetes is an orchestration platform that automates the management and scaling of these containers. By using Docker and Kubernetes together, you can create and deploy containers in a cluster and then use Kubernetes to manage and scale those containers.

Scaling an application horizontally can help ensure that your application can handle an increasing number of users and requests. To do this, you should consider the following steps:

1. Make sure your application is containerized using a container technology like Docker.
2. Make sure the containers are configured as a cluster on an orchestration platform like Kubernetes.
3. Deploy your application to the cluster as a set of replicas, where each replica is an instance of the application running in a container.
4. Configure load balancing to distribute traffic between the application replicas.
5. Monitor the performance of the application and add more replicas as needed to handle increased traffic.

------

# How to automate scalability when necessary?

Nowadays it is very common for applications to be developed to run in a cloud environment, such as AWS, for example. In this environment, it is possible for the application to be scaled automatically. Doing this on a cloud-hosted server is much simpler than on a local server, as it is done in an integrated way, i.e., without human intervention, provided that the auto-scalability service is correctly configured.

The major providers offer this service and allow you to configure servers to scale automatically as traffic is greater than expected. To do this, it is necessary to monitor the performance of the application and configure the service to add or remove servers as needed.

It is worth noting that each provider has its own way of doing this, but in general, the process is very similar. The more resources your application uses from the provider, the more expensive the service will be. However, as soon as traffic flow is reduced, the provider tends to remove additional servers and reduce service costs to the contracted plan.