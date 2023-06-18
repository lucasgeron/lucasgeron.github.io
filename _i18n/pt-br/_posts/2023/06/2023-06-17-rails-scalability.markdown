---

layout: post
title: "Como escalar uma aplicação RoR"
date: 2023-06-17
short_description: "Saiba a diferença entre escalar uma aplicação de forma horizontal ou vertical e descubra porque escalabilidade é importante para uma aplicação Ruby on Rails"
cover: /assets/images/covers/pt-br/rails-scalability.png
labels: "Ruby, Rails, Web Development"

---

# Como escalar uma aplicação RoR
Saiba a diferença entre escalar uma aplicação de forma horizontal ou vertical e descubra porque escalabilidade é importante para uma aplicação Ruby on Rails.

<div>
  <img src="/assets/images/covers/pt-br/rails-scalability.png" alt="" class=" w-100 img-fluid rounded-3 shadow mb-4">
</div>

# O que é escalabilidade?

Um framework é considerado escalável quando ele permite que uma aplicação seja construída de forma rápida e eficiente, e que possa crescer e se adaptar às mudanças de demanda sem comprometer o desempenho ou a estabilidade. 

Ruby on Rails é considerado escalável porque é um framework modularizado composto por vários outros frameworks especialistas em comportamentos diversos, como por exemplo o ActiveRecord, que é responsável por mapear classes da aplicação para tabelas do banco de dados, ActiveStorage, que facilita o upload de imagens para os servidores, ActionMailer, que permite enviar emails diretamente da aplicação, entre outros. Além disso, sua filosofia preza por um framework composto de um modo que diminui o número de decisões que um desenvolvedor precisa tomar, enquanto mantém o framework flexível e fácil de customizar. 

Ao desenvolver uma aplicação Ruby on Rails é importante tem em mente que ela pode crescer e que, em algum momento, será necessário escalar a aplicação. 

**Mas afinal de contas, o que é escalabilidade e porque ela é importante?**

Inicialmente, quando a aplicação ainda é pequena, é possível que ela rode em um único servidor, mas conforme ela cresce, tanto em número de usuários quanto em serviços gerenciados, é necessário adicionar mais recursos para que ela continue funcionando bem. 

Uma coisa é certa, sua aplicação ira ficar lenta ou até mesmo quebrar a medida que o trafego aumenta, desta forma, fazer com que os usuários esperarem demais implica que eles provavelmente desistam de usar a sua aplicação e procurem por outra mais eficiênte. Por sua vez, perder clientes reduz a receita e pode até mesmo fazer com que sua empresa feche as portas.

Escalabilidade é a capacidade de uma aplicação crescer sem que isso afete a performance. É importante ter em mente que escalar uma aplicação não é apenas adicionar mais recursos. Para que a aplicação seja escalável, é necessário que a aplicação seja desenvolvida de forma adequada.



#### 5 Dicas em relação a escalabilidade


- **Planeje a escalabilidade desde o início**: Ao projetar a arquitetura da aplicação, leve em consideração como ela pode ser escalada no futuro. Isso pode incluir escolher tecnologias e abordagens que facilitem a escalabilidade.

- **Monitore o desempenho da aplicação**: É importante monitorar o desempenho da aplicação para identificar gargalos e problemas que possam afetar sua capacidade de escalar. Use ferramentas de monitoramento para coletar métricas e tomar decisões informadas sobre como escalar a aplicação.

- **Otimize o código**: Otimize o código da aplicação para garantir que ele seja eficiente e possa lidar com um aumento no tráfego e na carga de trabalho. Isso pode incluir otimizar consultas de banco de dados, reduzir o uso de recursos e melhorar a estrutura de dados.

- **Use tecnologias escaláveis**: Use tecnologias que facilitem a escalabilidade, como contêineres e plataformas de orquestração. Essas tecnologias podem ajudar a gerenciar e escalar a aplicação de forma mais eficiente.

- **Teste a escalabilidade**: Teste regularmente a escalabilidade da aplicação para garantir que ela possa lidar com um aumento no tráfego e na carga de trabalho. Use ferramentas de teste de carga para simular um aumento no tráfego e identificar problemas que possam afetar a capacidade da aplicação de escalar.

Considerando o fluxo de dados de uma aplicação web, isto é, Browser / Servidor / Aplicação / Banco de dados, é possível otimizar seu código em cada um dos pontos, melhorando a performance da aplicação antes de escalá-la.


<div class="">
  <div class="row">
    <div class="col-12 col-md-3 ">
      <p class="fw-bold mb-2 bg-secondary rounded-3 text-center text-white " > Melhorias no Browser</p>
      <ul class="">
        <li> Minifique arquivos CSS e JS </li>
        <li> Otimize o cache da aplicaçlão </li>
        <li> Compacte images </li>
        <li> Reduza o número de requisições </li>
      </ul>
    </div>
    <div class="col-12 col-md-3 ">
      <p class="fw-bold mb-2 bg-secondary rounded-3 text-center text-white " > Melhorias no Servidor</p>
      <ul class="">
        <li> Defina um número máximo de conexões </li>
        <li> Defina um timeout de requisições </li>
        <li> Defina um keep alive adequado </li>
      </ul>
    </div>
    <div class="col-12 col-md-3 ">
      <p class="fw-bold mb-2 bg-secondary rounded-3 text-center text-white " > Melhorias na Aplicação</p>
      <ul class="">
        <li> Delegue trabalhos pesados para serviços adequados </li>
        <li> Realize operações de modo assíncrono </li>
        <li> Use bibliotecas com bom desempenho </li>
        <li> Otimize consultas ao banco de dados </li>
      </ul>
    </div>
    <div class="col-12 col-md-3 ">
      <p class="fw-bold mb-2 bg-secondary rounded-3 text-center text-white " > Melhorias do Banco de Dados </p>
      <ul class="">
        <li> Use índices </li>
        <li> Pré-processe dados direto no Banco </li>
        <li> Utilize a quantidade de memória adequada </li>
        <li> Verifique log de consultas lentas</li>
      </ul>
    </div>
  </div>
</div>


--------

# Quando escalar?

Apesar das melhorias citadas acima, em algum momento será necessário escalar a aplicação. Mas quando? 
A resposta é simples: **quando a aplicação começar a ficar lenta**.

Para saber se a aplicação está lenta, é necessário monitorar a aplicação. Existem diversas ferramentas que podem ser usadas para monitorar a aplicação. Lembrando que é importante monitorar a aplicação em produção, pois é nesse ambiente que a aplicação será usada pelos usuários.

Com as métricas em mãos, é possível analisar o desempenho da aplicação e identificar gargalos, a partir disto, é possível identificar o que está causando a lentidão e corrigir o problema. Para facilitar a análise, é importante que as métricas sejam apresentadas de forma gráfica.

Existem diversas ferramentas que podem ser usadas para monitorar a aplicação. Algumas delas são:

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
      <p><strong>New Relic</strong>: é uma plataforma de monitoramento de desempenho que oferece insights em tempo real sobre o desempenho de sua aplicação, banco de dados e servidores.</p>
    </div>
    <div class="col-md-3 d-flex flex-column align-items-center">
      <div class="h-auto" >
      <a href="https://scoutapm.com/" target="_blank" class="text-decoration-none image-container mb-2" >
        <img class="" height="80" src="https://assets.scoutapm.com/assets/public/scout_logo-f2ab3019302500d22b77f24685298b91e8b1fd4778ba5f67368cde418476f513.png" alt="Scout APM" > 
      </a>
      </div>
      <p><strong>Scout APM</strong>: é uma ferramenta de monitoramento de desempenho que oferece recursos como rastreamento de transações, monitoramento de métricas personalizadas e alertas em tempo real.</p>
    </div>
    <div class="col-md-3 d-flex flex-column align-items-center">
      <div class="h-auto" >
      <a href="https://accedian.com/platform/skylight/" target="_blank" class="text-decoration-none image-container mb-2" >
        <img class="" height="30" src="https://i.ibb.co/N7sLjKw/A-SKYLIGHT-Gold-White.png" alt="Skylight" > 
      </a>
      </div>
      <p><strong>Skylight</strong>: é uma ferramenta de monitoramento de desempenho projetada especificamente para aplicações Ruby on Rails. Ela oferece insights sobre o desempenho de suas consultas ao banco de dados, renderização de views e muito mais.</p>
    </div>
    <div class="col-md-3 d-flex flex-column align-items-center">
      <div class="h-auto" >
      <a href="https://www.datadoghq.com/" class="text-decoration-none image-container mb-2" >
        <img class="" height="75" src="https://imgix.datadoghq.com/img/dd_logo_n_70x75.png?ch=Width,DPR&fit=max&auto=format&w=70&h=75" alt="DataDog">
        <img class="" height="14" src="https://imgix.datadoghq.com/img/dd-logo-n-200.png?ch=Width,DPR&fit=max&auto=format&h=14&auto=format&w=807" alt="DataDog">
      </a>
      </div>
      <p><strong>Datadog</strong>: é uma plataforma de monitoramento e análise que permite que você monitore o desempenho de sua aplicação, infraestrutura e logs em um único lugar.</p>
    </div>
  </div>
</div>

É importante destacar que cada aplicação é um caso diferente, portanto, não existe uma regra para saber quando escalar a aplicação. 

-------




# Escalabilidade Vertical

A escalabilidade vertical, também conhecida por *scale up*, é quando a aplicação cresce adicionando mais recursos ao servidor, como memória, processamento, etc. Este tipo de escalabilidade é mais simples de ser implementado, pois não requer alterações na aplicação, contudo ela tem um limite, pois não é possível adicionar recursos infinitamente ao hardware que é utilizado como servidor.

A escalabilidade vertical é mais indicada para aplicações que não tem um grande volume de dados, ou que não tem um grande número de usuários simultâneos e normalmente é utilizada por empresas com um baixo poder aquisitivo, uma vez que este método costuma ser mais barato que o modo horizontal.

A principal vantagem deste modo é que fazer este tipo de melhoria é relativamente fácil se comparado ao modo horizontal. Além da limitação de recursos, a escalabilidade vertical também apresenta a desvantagem de que por ser um servidor único, se o servidor cair, a aplicação também cai, pois não há outro servidor para assumir o serviço. O mesmo acontece quando é necessário fazer uma atualização na aplicação, pois é necessário parar o servidor para fazer a atualização. 

Por fim, é relevante citar que este tipo de escalabilidade mantem os dados da aplicação em único lugar, o que pode gerar lentidão quando o trafego na aplicação é intensa, e apesar de ter turbinado o servidor com mais recursos, tornando-o capaz de interpretar mais requisições por minuto, este tipo de implementação pode apenas postergar o problema de lentidão dependendo do contexto de sua aplicação. 

# Escalabilidade Horizontal 

A escalabilidade horizontal, também conhecida por *scale out* é quando a aplicação cresce adicionando mais servidores. Contudo, fazer isto não é tão simples quanto parece. É preciso fazer com que os servidores se comuniquem de forma consistente, pois normalmente os servidores mantem dados particionados, ou seja, cada servidor tem uma parte dos dados. 

Escalar uma aplicação de forma horizontal traz algumas vantagens específicas como por exemplo, a possibilidade de adicionar mais servidores conforme a necessidade, adicionar servidores em diferentes regiões para reduzir o tempo de resposta dos usuários daquela região, e também a possibilidade de adicionar servidores com diferentes configurações, delegando parte dos serviços para servidores com mais recursos.

Outra vantagem de escalar uma aplicação de forma horizontal é que é possível adicionar servidores com diferentes tecnologias, como por exemplo, adicionar um servidor com NodeJS para servir arquivos estáticos, enquanto os servidores com Ruby on Rails servem apenas os dados dinâmicos. 

No que diz respeito a atualizações da aplicação, a forma horizontal também traz vantagens, pois permite atualizar os servidores um a um, sem que a aplicação fique fora do ar, da mesma forma que quando um servidor apresenta problemas, sendo possível remover o servidor do cluster sem que a aplicação fique fora do ar, uma vez que a demanda será atendida pelos demais servidores.

-------

# Como escalar?

Docker e Kubernetes são duas tecnologias que podem ajudar a escalar aplicativos web. Docker é uma plataforma de contêineres que permite que aplicativos sejam empacotados e implantados como contêineres, enquanto Kubernetes é uma plataforma de orquestração que automatiza o gerenciamento e escalonamento desses contêineres. Ao usar Docker e Kubernetes juntos, você pode criar e implantar contêineres em um cluster e, em seguida, usar o Kubernetes para gerenciar e escalar esses contêineres.

Para escalar um aplicativo horizontalmente, você pode usar o Kubernetes para gerenciar e escalar seus contêineres em um cluster. Isso pode ajudar a garantir que seu aplicativo possa lidar com um número crescente de usuários e solicitações. Para fazer isto, você deve considerar os seguintes passos:

1. Certifique-se de que sua aplicação esteja contêinerizada usando uma tecnologia de contêineres como o Docker.
2. Certifique-se que os contêineres sejam configurados como um cluster em uma plataforma de orquestração como o Kubernetes.
3. Implante seu aplicativo no cluster como um conjunto de réplicas, onde cada réplica é uma instância do aplicativo em execução em um contêiner.
4. Configure o balanceamento de carga para distribuir o tráfego entre as réplicas da aplicação.
5. Monitore o desempenho do aplicativo e adicione mais réplicas conforme necessário para lidar com o aumento do tráfego.

------

# Como automatizar a escalabilidade quando for necessário?

Nos dias atuais é muito comum que as aplicações sejam desenvolvidas para rodar em um ambiente de nuvem, como o AWS, por exemplo. Nesse ambiente, é possível que a aplicação seja escalada de forma automática. Fazer isto em um servidor hospedado na núvem é muito mais simples do que em um servidor local, pois é feito de forma integrada, isto é, sem a necessidade de intervenção humana, desde que o serviço de auto-escalabilidade esteja configurado corretamente.

Os grandes provedores oferecem este serviço e permitem que você configure os servidores para escalar de forma automatica a medida em que trafego for maior do que o esperado. Para fazer isto, é necessário monitorar o desempenho da aplicação e configurar o serviço para adicionar ou remover servidores conforme necessário.

É valido destacar que cada provedor tem sua própria forma de fazer isto, mas em geral, o processo é muito parecido. Por sua vez, quanto mais recursos sua aplicação utilizar do provedor, mais caro será o serviço. Também é importante destacar que assim que o fluxo de trafego é reduzido, o provedor tende a remove os servidores adicionais, que por sua vez, reduz o custo do serviço.

