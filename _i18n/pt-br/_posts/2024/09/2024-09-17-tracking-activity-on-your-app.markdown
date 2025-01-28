---

layout: post
title: "The right way to track activity on your application"
date: 2024-09-17
short_description: "foo"
cover: /assets/images/covers/pt-br/tracking-activity-on-your-app.png

read_time: true
toc: true
github_repo:

categories:
- Article
# - Portfolio
# - Product
- Tutorial

tags:
# Tech Tags
- API
- Node
- Next
- Amplitude
# - Design
# - Hotwire Turbo
# - Hotwire Stimulus
# - Python
# - P5.js
# - Ruby
# - Ruby On Rails
# - Spreadsheet
# - Useful Gems
---

Quando o assunto é a respeito de aplicações web existe um infinidade de tópicos a serem explorados e um deles, é o 'tracking', também sendo conhecido pela ação de monitorar as métricas de sua aplicação em diversos aspectos, como por exemplo a performance entre as requisições e seu tempo de resposta, as ações que os usuários fazem em sua plataforma, em alguns casos, monitorando até mesmo aonde os usuários mantiveram sua atenção por mais tempo ao explorarem seu conteúdo.

## Porque devemos monitorar?

Bem, a resposta especifica desta pergunta é bem clara, para ter controle do seu negócio (~ou do negócio do seu cliente~). Monitorar uma aplicação de forma geral bem como seus usuários é uma tarefa que pode parecer mais fácil do você pensa, afinal, existem um variedade de aplicações especilizadas em fazer isto, mas é crucial saber utilizalas a nosso favor.

Conseguir identificar horarios de pico de usuários, problemas de desempenho com os serviços oferecidos e até mesmo saber as métricas de acesso das páginas da sua aplicação são informações que podem refletir diretamente na experiência e satisfação do seu cliente assim como nas finanças da empresa, otimizando os custos e gerando mais valor ao produto baseado nos dados coletados.

## Ferramentas que podem ser úteis

Talvez você já tenha ouvido falar a respeito do NewRelic, Datadog, ou do Sentry, ferramentas que podem ser essenciais para avaliar os gargalos da sua aplicação e contabilizar quais são os pontos críticos da sua aplicação que precisam de atenção.

Essas ferramentas muitas vezes também são utilizadas para monitorar possíveis erros em ambientes mais complexos, como por exemplo, uma requisição de uma API que tenha falhado ao ser feito durante o processamento de job de forma asincrona. 

Neste exemplo, caso a situação aconteça em uma aplicação que esteja em produção, o log contendo o problema específico pode ser uma tarefa difícil ou quase impossível dependendo dos servidores que estão executando sua aplicação e até mesmo do volume de dados trafegados.

Desta forma, essas ferramentas são funcionam como um API externas que podem ser requisitadas a qualquer momento para registrar qualquer tipos de eventos, permitindo assim os desenvolvedores identificar com mais assertividade quando, como e o que ocasionou um problema em sua aplicação.

Quando a aplicação atua no ramo de marketing ou vendas online, promovendo produtos, fazendo pesquisas, oferecendo cupons e descontos, monitar apenas a performance e erros não são suficiente para atingir bons resultados. Para ajudar a acompanhar a experiência que o usuário tem na sua plataforma, ferramentas como HotJar, fullStory e Mouseflow são capazes de registrar o ciclo completo de interações que os consumidores tiveram com sua aplicação, monitorando a posição do mouse, os textos selecionados, copiados, identificar aonde os usuários viram o conteúdo baseado no scrollbar e muitas outras métricas relevante para entender como o usuário está usando a aplicação. Este categoria de ferramenta costuma gerar insights valiosos que podem guiar a estratégia da empresa.

E certamente não sendo a última, pois há de existir uma infinidade de ferramentas com propostas inovadoras que não foram citadas neste artigo... podemos falar das ferramentas que fazem o monitoramento dos eventos e ações do usuário na aplicação de forma mais dinâmica, possibilitando criar metadados personalizados para quaisquer que forem os dados relevantes do negócio. 

Este tipo de tracking normalmente são aplicados em aplicações multi-plataforma, bibliotecas de integração de terceiros e em cenários aonde que requerem muitas variáveis para que uma determinada ação possa ser executada, neste caso, o 'tracking' pode trazer dados mais completos como informações do usuário, do dispositivo, e até mesmo dos dados utilizadas na aplicação. 

Também é válido citar que estes dados são armazenados em um datawarehouse, ou seja, é possível realizar o input de base de dados diferentes e além disto, devido a estrutura como os dados são armazenados, as ferramentas permitem aos mantendedores customizarem seus próprios relatórios de interesse. Algumas destas ferramentas são a Heap Analytics, MixPanel e a Amplitude.

Neste artigo, iremos nos aprofundar nesta última categoria, o tracking baseado em metadados, entretanto, se ficou interessado em quais tipos de erros essas ferramentas poderiam te ajudar muito, recomendo a leitura dos posts: [...], problemas que são facilmente identificados e poder te fazer ganhar muito tempo.

## Estruturando os dados que serão coletados

A primeira parte para se obter um bom resultado é planejar com cautela quais são os dados que deverão se coletados do usuário afim de ser possível extrair informações relevantes. Se está em dúvida por onde começar, que tal sumarizar alguns itens baseado nestas categorias:

- Páginas visitadas
- Tempo gasto em cada página
- Ações realizadas (cliques, rolagens)
- Dispositivo e navegador usado
- Geolocalização aproximada
- Fluxo de navegação (caminho pelo site)
- Produtos adicionados ao carrinho de compras (no caso de e-commerce)
- Compras / Downloads realizados
- Dados de publicidade (interações com anúncios)

Para podermos exemplificar alguns cenários, vamos considerar um projeto next fictício, considerando as rotas disponíveis conforme o esquema a seguir: 

```
/home
/projects
/projects/project-a
/projects/project-b
/about
```

Vamos considerar que precisamos dos dois primeiros items da lista, páginas visitadas e que com essa informação, iremos gerar métricas para o o projeto. Vale destacar que neste artigo iremos utilizar a API do amplitude como base. 

Você poderia estruturar seus dados de forma parecida com:

```tsx
import * as amplitude from '@amplitude/analytics-node'

amplitude.init(process.env.AMPLITUDE_API_KEY)

export const getServerSideProps: GetServerSideProps<{
  user: User | null
}> = async ({ req, res, query }) => {
  const user = getCurrentUser()

  amplitude.track('Home Page Viewed', {}, {
    user_id: user?.username || 'guests',
  })

  return {
    props: {
      user
    }
  }
}

export default function HomePage() {
  return (
    <div>Home Page</div>
  )
}
```

Um código bem simples que já pode ser utilizado para nosso primeiro exemplo. Considerando que esta foi nossa primeira implementação, iremos replicar o mesmo padrão de nomenclatura para as demais rotas da aplicação, resultando na seguinte relação de eventos.

![Relação de Eventos - Amplitude](https://d604h6pkko9r0.cloudfront.net/wp-content/uploads/2024/09/19232342/Relacao-de-Eventos-Amplitude-jpeg.webp)

Observe que apenas com 5 end-points disponíveis nesta aplicação acompanhar esses dados seria fácil, contudo, dificilmente uma aplicação possui esse número de rotas. 

Continuando, ao plotarmos as métricas na tela de gráficos vamos ter algo como o print abaixo:
![Report de Views - V1 - Amplitude](https://d604h6pkko9r0.cloudfront.net/wp-content/uploads/2024/09/19233502/2.-Report-de-Views-V1-Amplitude-jpeg.webp)

E a primeira dica já vem aqui, Note que para montar esse gráfico de paginas visualizadas, precisamos selecionar manualmente qual página gostariamos de plotar no gráfico?

![Relação de Colunas Filtradas- V1 - Amplitude](https://d604h6pkko9r0.cloudfront.net/wp-content/uploads/2024/09/19233506/3.-Relacao-de-Colunas-Filtradas-V1-Amplitude.png)


Já pensou em ter que fazer isto com mais de 100 rotas? parece um trabalho árduo certo? ... eu costumo dizer que se você está fazendo algo que esteja muito difícil ou está demorando muito, você provavelmente esteja fazendo errado! e sem dúvidas, ter que adicionar inúmeras colunas para conseguir compor um gráfico simple, me parece errado. 

Vejamos portanto como podemos estruturar os dados trackiados fazendo uso do metadados para ganharmos que possamos otimizar nosso relatório.

Ao invés de nomearmos toda página da aplicção com um nome específico, vamos reduzir o nome do nosso evento apenas para 'Page Viewed' e passaremos a adicionar um atributo `origin`. 

A segunda dica vai agora, considere que assim como em qualquer outra aplicação, o título do projeto pode ser alterado, desta forma, causando dados segmentados, o que seria um grande problema, portanto, adicionar sempre um identificador único que não possa ser alterado. Neste caso, vamos considerar o slug como sendo imutável, portanto, origin deverá receber o sub-caminho em questão.

Substitua o código conforme o trecho a seguir:
```tsx
  const eventProperties = { origin: query }

  amplitude.track('Page Viewed', eventProperties, {
    user_id: user?.username || 'guests',
  })
```

Se ainda assim sua aplicação for dinâmica a ponto de ter links customizaveis, uma outra opção seria adicionar além de `origin`, que neste caso seria dinâmico, os modelos e seus respectivos ids do que esta página consome, algo como:

```tsx
const eventProperties = { 
  origin: query,
  objectType: 'Project'
  objectId: 'project_id'
}
```

Mas note que nem sempre, ser tão abstrato é vantajoso. Considere que possa haver páginas de sua aplicação que consumirão múltiplos end-points para compor uma única página, desta forma, esta estrutura já não seria adequada, entretanto, sabendo-se de quais modelos estão sendo consumidos é possível nomear os metadados de forma que gere benefícios, como por exemplo:

```tsx
const eventProperties = { 
  origin: query,
  projectId: 'project_id',
  promoIds: ['promo_a_id', 'promo_b_id'],
  SponsorId: 'sponsor_id'
}
```

Veja que desta forma estamos coletando e organizando os dados de uma forma muito mais intuitíva que nos permite filtrar com uma riquesa de detalhes muito maior e de forma muito mais simplificada, uma vez que agora só possuímos uma única série em nosso gráfico, 'Page Viewed', e podemos filtrar os dados de nosso interesse utilizando os metadados.














# Privacidade e Ad-Blockers

Agora que você conhece algumas formas de monitorar sua aplicação, precisamos falar sobre as ferramentas que fazem o contrário, isto é, que tentam impedir a coleta deste tipo de informações e buscam manter o usuário no anônimato, aplicando várias estratégias para fazer isto.

Essas ferramentas podem atuar em barreiras diferentes da aplicação, algumas delas atuando no nível da rede como é o caso de VPNs e as politicas do firewall bloquando o acesso a servidores de rastreamento e sites de terceiros, outras no nível de navegação, que geralmente bloqueiam anuncios, rastreadores e scripts de tracking que normalmente tentam identificar seu dispositivo e até a leitura dos cookies do usuário em um ambiente 'Cross-Site', isto é, quando outra página tenta ler cookies ou informações do navegador que não pertecem a seu domínio, muitas vezes associados a redes publicas ou ferramentas de comportamento do usuário de forma geral, não apenas em uma determinada aplicação específica.


Bom, e como lidamos com os blockers enquanto tentamos coletar informações a respeito dos usuários? A verdade é que nem sempre é possível fazer isto como gostariamos, entretanto, existem algumas estratégias que podem ser relevantes.

## Hands-on
### Aplicação
#### Setup do Projeto
## Amplitude API
### Onde adicionar Tracking Events?
## Visualizing Data
### Building your first chart

## O que fazer com estes dados? 
###  Monitorar quantidades de ações realizadas, KPI's
### Implementar testes A/B em sua aplicação 

# Conclusão
