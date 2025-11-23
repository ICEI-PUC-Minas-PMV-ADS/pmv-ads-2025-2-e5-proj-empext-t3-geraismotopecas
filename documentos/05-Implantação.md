# Implantação do Software

## Planejamento da Implantação

A aplicação foi desenvolvida utilizando JavaScript, HTML e CSS, com Node.js no back-end e React no front-end. Para armazenamento de dados, foi utilizado o banco de dados MongoDB.

A arquitetura escolhida segue o padrão de separação entre front-end, back-end e banco de dados, permitindo maior escalabilidade e facilidade de manutenção. O processo de implantação foi planejado da seguinte forma:

Back-end (API): hospedado na plataforma Render, que oferece deploy contínuo e execução automática da aplicação a partir do repositório Git. A API foi configurada com variáveis de ambiente, conexão com o MongoDB e endpoints REST utilizados pelo front-end.

Banco de Dados: a aplicação utiliza MongoDB Atlas, banco de dados em nuvem gerenciado, garantindo alta disponibilidade e segurança.

Front-end (React): implantado na Vercel, onde o build é gerado automaticamente a cada push na branch principal do repositório. A Vercel também oferece CDN global, otimizando a performance da aplicação.

O fluxo de deploy segue a estratégia de integração contínua (CI): alterações são testadas localmente, enviadas ao GitHub, e cada plataforma (Render e Vercel) realiza automaticamente o build e a atualização do ambiente de produção.

## Link da Aplicação em Produção

URL da aplicação: https://gerais-moto-pecas.vercel.app/

URL da API: https://geraismotopecas-api.onrender.com/

## Planejamento de Evolução do Software

O planejamento de evolução do software foi definido considerando a realidade da loja de motopeças, que conta com apenas dois usuários com as mesmas permissões. A evolução foi pensada para manter o sistema simples, estável e fácil de manter.

Primeiramente, foram mapeadas as regras de negócio essenciais — cadastro de peças, registro de serviços e consulta de histórico — definindo que o sistema não exigiria diferentes níveis de acesso. A arquitetura foi organizada para permitir futuras alterações sem grandes retrabalhos: o front-end em React com componentes reutilizáveis, a API em Node.js com rotas separadas e o banco MongoDB estruturado de forma direta.

O planejamento também inclui procedimentos básicos de atualização e segurança, como uso de variáveis de ambiente, validações simples na API e limitações de acesso via CORS. Mesmo sendo uma aplicação pequena, essas práticas garantem conformidade e facilidade de evolução.

Por fim, o sistema foi planejado para crescer conforme a necessidade da loja, permitindo adicionar novas telas, relatórios ou funcionalidades sem comprometer o funcionamento atual.
