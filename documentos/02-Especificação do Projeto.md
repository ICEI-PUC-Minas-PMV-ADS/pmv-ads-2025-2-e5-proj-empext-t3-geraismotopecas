# Especificações do Projeto

<span style="color:red">Pré-requisitos: <a href="01-Documentação de Contexto.md"> Documentação de Contexto</a></span>

Definição do problema e ideia de solução a partir da perspectiva do usuário. 

## Usuários

| Tipo de Usuário   | Descrição | Responsabilidades |
|------------------|-----------|------------------|
| Administrador | Gerencia toda a aplicação e supervisiona os processos da oficina. | Criar e gerenciar motocicletas, configurar o sistema, acessar relatórios completos, gerenciar alertas de estoque. |
| Desenvolvedor | Desenvolvedor ou responsável por testes do sistema. | Realizar testes de funcionalidades, validar processos, corrigir bugs e atualizar o sistema antes da entrega. |


## Arquitetura e Tecnologias

Definição de como o software é estruturado em termos dos componentes que fazem parte da solução e do ambiente de hospedagem da aplicação.
<img width="1087" height="718" alt="image" src="https://github.com/user-attachments/assets/570797f4-f0dd-4615-b40d-8493d03eccf6" />


## Project Model Canvas

<img width="857" height="606" alt="image" src="https://github.com/user-attachments/assets/1ffb4152-7fce-4bca-90a3-964b1e9917c9" />





## Requisitos

As tabelas que se seguem apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto. Para determinar a prioridade de requisitos, aplicar uma técnica de priorização de requisitos e detalhar como a técnica foi aplicada.

Para mais informações, consulte os microfundamentos Fundamentos de Engenharia de Software e Engenharia de Requisitos de Software. 

### Requisitos Funcionais

|ID    | Descrição do Requisito  | Prioridade |
|------|-----------------------------------------|----|
|RF-001| Permitir o cadastro de peças no estoque com informações detalhadas. | ALTA | 
|RF-002| Possibilitar a atualização da quantidade de peças em estoque. | ALTA |
|RF-003| Possibilitar a consulta de peças existentes no estoque. | ALTA |
|RF-004| Permitir o registro de novos clientes, incluindo dados de contato e histórico de serviços. | ALTA |
|RF-005| Registrar serviços e consertos realizados, associando-os aos clientes e motocicletas correspondentes.| ALTA |
|RF-006| Permitir a associação de peças utilizadas a cada serviço ou conserto realizado. | MÉDIA |
|RF-007| Exibir o histórico completo de serviços realizados por cliente, com detalhamento de peças e datas. | ALTA |
|RF-008| Exibir o histórico de consertos para uma motocicleta específica, permitindo consultas rápidas. | MÉDIA |
|RF-009| Gerar um documento PDF dos consertos feitos. | ALTA |
|RF-010| Emitir um alerta automático quando a quantidade de uma peça atingir o nível mínimo de estoque. | MÉDIA |
|RF-011| Permitir o cadastro do usuário. | ALTA |
|RF-012| Permitir o login do usuário cadastrado. | ALTA |


### Requisitos não Funcionais

|ID     | Descrição do Requisito  |Prioridade |
|-------|-------------------------|----|
|RNF-001| O sistema deve utilizar um banco de dados NoSQL | MÉDIA | 
|RNF-002| A aplicação deve ser responsiva |  MÉDIA | 
|RNF-003| O sistema deve ser seguro e exigir autenticação | MÉDIA | 
|RNF-004| O sistema deve ter validação de campos | MÉDIA | 
|RNF-005| O sistema deve ser fácil de usar | ALTA | 


## Restrições

O projeto está restrito pelos itens apresentados na tabela a seguir.

|ID| Restrição                                             |
|--|-------------------------------------------------------|
|01| O projeto deverá ser entregue até o final do semestre |
|02| A equipe de projeto será restrita aos membros do grupo        |
|03 | A aplicação deve utilizar apenas tecnologias discutidas no curso ADS      |
|04 | A aplicação deverá estar hospedada em nuvem para fins de demonstração e utilização do parceiro     |


## Diagrama de Caso de Uso

O diagrama de casos de uso é o próximo passo após a elicitação de requisitos, que utiliza um modelo gráfico e uma tabela com as descrições sucintas dos casos de uso e dos atores. Ele contempla a fronteira do sistema e o detalhamento dos requisitos funcionais com a indicação dos atores, casos de uso e seus relacionamentos. 

<img width="429" height="766" alt="image" src="https://github.com/user-attachments/assets/e2709b8f-5947-4fce-a95e-260e585f140e" />



## Modelo da Base de Dados

Este documento descreve a estrutura e o esquema do banco de dados não relacional utilizado por nosso projeto, baseado em MongoDB. O MongoDB é um banco de dados NoSQL que armazena dados em documentos JSON (ou BSON, internamente), permitindo uma estrutura flexível e escalável para armazenar e consultar dados.

<img width="614" height="567" alt="image" src="https://github.com/user-attachments/assets/f4f34c04-c9f7-4974-8e62-f2be35db3f46" />




## Esquema do Banco de Dados

### Coleção: serviços
Armazena os tipos de serviços oferecidos pela oficina.

```Json
[
  {
    "id_servico": 1, // Identificador único do serviço
    "nome_servico": "Troca de óleo", // Nome do serviço
    "desc": "Substituição do óleo do motor utilizando óleo recomendado", // Descrição detalhada
    "peca_usada": "Filtro de óleo", // Peça utilizada (pode ser null)
    "garantia_dias": 30 // Garantia em dias para o serviço
  }
]
```

#### Descrição dos Campos
> - <strong>id_servico:</strong> Identificador único do serviço (gerado automaticamente).
> - <strong>nome_servico:</strong> Nome do serviço oferecido.
> - <strong>desc:</strong> Detalhes do serviço.
> - <strong>peca_usada:</strong> Peça utilizada no serviço (pode ser null).
> - <strong>garantia_dias:</strong> Prazo de garantia em dias.

### Coleção: serviços feitos
Armazena os registros de serviços realizados para clientes.

```Json
[
  {
    "id_servico_feito": 101, // Identificador único
    "nome_cliente": "João da Silva", // Nome do cliente
    "contato_cliente": "11999998888", // Telefone ou e-mail de contato
    "modelo_moto": "Honda CG 160", // Modelo da moto
    "placa_moto": "ABC-1234", // Placa da moto
    "cor_moto": "Vermelha", // Cor da moto
    "ano_moto": 2020, // Ano de fabricação
    "data_servico": "2023-10-15T14:30:00Z", // Data do serviço em formato ISO
    "servico_feito": "Troca de óleo" // Serviço realizado (selecionado da coleção de serviços)
  }
]
```

#### Descrição dos Campos
> - <strong>id_servico_feito:</strong> Identificador único do serviço realizado.
> - <strong>nome_cliente:</strong> Nome do cliente atendido.
> - <strong>contato_cliente:</strong> Telefone ou e-mail para contato.
> - <strong>modelo_moto:</strong> Modelo da motocicleta.
> - <strong>placa_moto:</strong> Placa de identificação da moto.
> - <strong>cor_moto:</strong> Cor da moto.
> - <strong>ano_moto:</strong> Ano de fabricação da moto.
> - <strong>data_servico:</strong> Data e horário do serviço (ISO string).
> - <strong>serico_feito:</strong> Serviço realizado, referenciando a coleção servicos.

### Coleção: usuarios
Armazena os dados dos usuários do sistema.

```Json
[
  {
    "id_usuario": 1, // Identificador único
    "nome": "Maria Souza", // Nome do usuário
    "email": "maria.souza@email.com", // E-mail de acesso
    "senha": "hash_senha_123", // Senha criptografada
  }
]
```

#### Descrição dos Campos
> - <strong>id_usuario:</strong> Identificador único do usuário.
> - <strong>nome:</strong> Nome do usuário.
> - <strong>email:</strong> E-mail utilizado para login.
> - <strong>senha:</strong> Senha armazenada de forma criptografada.



### Coleção: peças
Armazena as informações das peças disponíveis no sistema.

```Json
[
    {
        "id_peca": 1, // Identificador único da peça
        "nome": "Filtro de óleo", // Nome da peça
        "codigo": null, // Código interno da peça (pode ser nulo)
        "desc": "Filtro de óleo para motos 150cc", // Descrição detalhada
        "data_inicio_gestao": "2023-05-01", // Data em que a peça passou a ser gerida
        "contem_servico": false, // false = peça sem serviço associado, true = serviço associado
        "meta_controle": { // Dados de controle e estoque
            "qtd_min_fixa": 5, // Quantidade mínima para alerta de reposição
            "data_ultima_compra": "2023-07-10", // Data da última compra da peça
            "qtd_estoque": 20, // Quantidade atual disponível em estoque
            "qtd_vendido": 15 // Quantidade já vendida ou utilizada
        }
    }
]
```

#### Descrição dos Campos
> - <strong>id_peca:</strong> Identificador único da peça gerado automaticamente
> - <strong>nome:</strong> Nome da peça.
> - <strong>codigo:</strong> Código interno da peça (opcional/nulo).
> - <strong>desc:</strong> Descrição detalhada da peça.
> - <strong>data_inicio_gestao:</strong> Data em que a peça começou a ser controlada no sistema.
> - <strong>contem_servico:</strong> Campo booleano que indica se a peça possui ou não serviços associados.
> - <strong>meta_controle:</strong> Objeto com metadados para gestão da peça.
> - <strong>qtd_min_fixa:</strong> Quantidade mínima definida para disparar alerta de reposição.
> - <strong>data_ultima_compra:</strong> Data da última compra/entrada da peça em estoque.
> - <strong>qtd_estoque:</strong> Quantidade atual disponível em estoque.
> - <strong>qtd_vendido:</strong> Quantidade já vendida ou utilizada.
