# Especificações do Projeto

<span style="color:red">Pré-requisitos: <a href="01-Documentação de Contexto.md"> Documentação de Contexto</a></span>

Definição do problema e ideia de solução a partir da perspectiva do usuário. 

## Usuários
| Tipo de Usuário   | Descrição | Responsabilidades |
|------------------|-----------|------------------|
| **xxx** | xxxxx | xxxxx |

### Exemplo

| Tipo de Usuário   | Descrição | Responsabilidades |
|------------------|-----------|------------------|
| Administrador | Gerencia toda a aplicação e supervisiona os processos da oficina. | Criar e gerenciar motocicletas, configurar o sistema, acessar relatórios completos, gerenciar alertas de estoque. |
| Desenvolvedor | Desenvolvedor ou responsável por testes do sistema. | Realizar testes de funcionalidades, validar processos, corrigir bugs e atualizar o sistema antes da entrega. |


## Arquitetura e Tecnologias

Descreva brevemente a arquitetura definida para o projeto e as tecnologias a serem utilizadas. Sugere-se a criação de um diagrama de componentes da solução.

## Project Model Canvas

<img width="935" height="661" alt="image" src="https://github.com/user-attachments/assets/8b40c12f-d782-4678-aa6b-5a2dd932bcc8" />




## Requisitos

As tabelas que se seguem apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto. Para determinar a prioridade de requisitos, aplicar uma técnica de priorização de requisitos e detalhar como a técnica foi aplicada.

Para mais informações, consulte os microfundamentos Fundamentos de Engenharia de Software e Engenharia de Requisitos de Software. 

### Requisitos Funcionais

|ID    | Descrição do Requisito  | Prioridade |
|------|-----------------------------------------|----|
|RF-001| Permitir o cadastro de peças no estoque. | ALTA | 
|RF-002| Possibilitar a atualização da quantidade de peças em estoque. | ALTA |
|RF-003| Possibilitar a consulta de peças existentes no estoque. | ALTA |
|RF-004| Permitir o registro de novos clientes. | ALTA |
|RF-005| Possibilitar o registro de serviços e consertos realizados.| ALTA |
|RF-006| Habilitar a associação das peças usadas a cada conserto. | MÉDIA |
|RF-007| Exibir o histórico completo de consertos por cliente. | ALTA |
|RF-008| Exibir o histórico de consertos para uma motocicleta específica. | MÉDIA |
|RF-009| Gerar uma lista de todos os consertos feitos em um determinado período. | ALTA |
|RF-010| Emitir um alerta automático quando a quantidade de uma peça atingir o nível mínimo de estoque. | MÉDIA |


### Requisitos não Funcionais

|ID     | Descrição do Requisito  |Prioridade |
|-------|-------------------------|----|
|RNF-001| O sistema deve ser responsivo para rodar em um dispositivos móvel | MÉDIA | 
|RNF-002| Deve processar requisições do usuário em no máximo 3s |  BAIXA | 


## Restrições

O projeto está restrito pelos itens apresentados na tabela a seguir.

|ID| Restrição                                             |
|--|-------------------------------------------------------|
|01| O projeto deverá ser entregue até o final do semestre |
|02| Não pode ser desenvolvido um módulo de backend        |



## Diagrama de Caso de Uso

O diagrama de casos de uso é o próximo passo após a elicitação de requisitos, que utiliza um modelo gráfico e uma tabela com as descrições sucintas dos casos de uso e dos atores. Ele contempla a fronteira do sistema e o detalhamento dos requisitos funcionais com a indicação dos atores, casos de uso e seus relacionamentos. 

<img width="511" height="745" alt="image" src="https://github.com/user-attachments/assets/f49dc755-106f-4cc2-89b0-6f318b7d54fc" />


## Modelo da Base de Dados

# Para banco de dados NoSQL:
Apresentar o Modelo da Base de Dados (estrutura dos documentos, coleções, ou grafos, conforme o tipo de NoSQL utilizado)

