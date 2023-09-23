export const swaggerDocs = {
    'openapi': '3.0.0',
    'info': {
        'version': '1.0.0',
        'title': 'MyWallet Api',
        'description': 'Esta api está servindo a uma aplicação de carteira digital para gerenciamento de finanças!'
    },
    'paths': {
        '/sign-up': {
            'post': {
                'summary': 'Registrar um novo usuário',
                'tags': ['Usuários'],
                'requestBody': {
                    'description': 'Dados do usuário a ser registrado',
                    'content': {
                        'application/json': {
                            'schema': {
                                '$ref':'#/components/schemas/SignUp'
                            }
                        }
                    }
                },
                'responses': {
                    '201': {
                        'description': 'Usuário cadastrado com sucesso'
                    },
                    '409': {
                        'description': 'Usuário já cadastrado'
                    },
                    '500': {
                        'description': 'Erro interno do servidor'
                    }
                }
            }
        },
        '/sign-in': {
            'post': {
                'summary': 'Autenticar um usuário',
                'tags': ['Usuários'],
                'requestBody': {
                    'description': 'Dados do usuário para autenticação',
                    'content': {
                        'application/json': {
                            'schema': {
                                '$ref':'#/components/schemas/SignIn'
                            }
                        }
                    }
                },
                'responses': {
                    '200': {
                        'description': 'Usuário autenticado com sucesso',
                        'content': {
                            'application/json': {
                                'schema': {
                                    '$ref':'#/components/schemas/AuthenticatedUser'
                                }
                            }
                        }
                    },
                    '404': {
                        'description': 'Usuário não cadastrado'
                    },
                    '401': {
                        'description': 'Senha incorreta'
                    },
                    '500': {
                        'description': 'Erro interno do servidor'
                    }
                }
            }
        },
        '/transactions': {
            get: {
                summary: 'Get user transactions',
                tags: ['Transações'],
                'security': [
                    {
                        'bearerAuth': []
                    }
                ],
                responses: {
                    '200': {
                        description: 'Retorna as transações do usuário',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        total: {
                                            type: 'number',
                                        },
                                        transactions: {
                                            type: 'array',
                                            items: {
                                                $ref: '#/components/schemas/TransactionResponse',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    '500': {
                        description: 'Erro interno do servidor',
                    },
                },
            },
            post: {
                summary: 'Criar uma nova transação',
                tags: ['Transações'],
                'security': [
                    {
                        'bearerAuth': []
                    }
                ],
                requestBody: {
                    description: 'Dados da transação a ser criada',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/TransactionInput',
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Transação criada com sucesso',
                    },
                    '500': {
                        description: 'Erro interno do servidor',
                    },
                },
            },
        },
        '/transactions/{ID}': {
            put: {
                summary: 'Atualizar uma transação por ID',
                tags: ['Transações'],
                'security': [
                    {
                        'bearerAuth': []
                    }
                ],
                parameters: [
                    {
                        in: 'path',
                        name: 'ID',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                requestBody: {
                    description: 'Dados da transação para atualização',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/TransactionInput',
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Transação atualizada com sucesso',
                    },
                    '500': {
                        description: 'Erro interno do servidor',
                    },
                },
            },
            delete: {
                summary: 'Excluir uma transação por ID',
                tags: ['Transações'],
                'security': [
                    {
                        'bearerAuth': []
                    }
                ],
                parameters: [
                    {
                        in: 'path',
                        name: 'ID',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    '202': {
                        description: 'Transação deletada com sucesso',
                    },
                    '500': {
                        description: 'Erro interno do servidor',
                    },
                },
            },
        }
    },
    'components':{
        'schemas':{
            'SignUp':{
                'type':'object',
                'properties':{
                    'nome':{
                        'type':'string'
                    },
                    'email':{
                        'type':'string'
                    },
                    'senha':{
                        'type':'string'
                    }
                }
            },
            'SignIn':{
                'type':'object',
                'properties':{
                    'email':{
                        'type':'string'
                    },
                    'senha':{
                        'type':'string'
                    }
                }
            },
            'AuthenticatedUser':{
                'type':'object',
                'properties':{
                    '_id':{
                        'type':'string'
                    },
                    'nome':{
                        'type':'string'
                    },
                    'email':{
                        'type':'string'
                    },
                    'token': {
                        'type': 'string'
                    }
                }
            },
            'TransactionResponse':{
                'type':'object',
                'properties':{
                    'value':{
                        'type':'number',
                    },
                    'type':{
                        'type':'string'
                    },
                    'description':{
                        'type':'string'
                    },
                    'date':{
                        'type':'string'
                    },'transactionID':{
                        'type':'string'
                    }
                }
            },
            'TransactionInput':{
                'type':'object',
                'properties':{
                    'value':{
                        'type':'number',
                    },
                    'type':{
                        'type':'string'
                    },
                    'description':{
                        'type':'string'
                    }
                }
            }
        }
    }
};