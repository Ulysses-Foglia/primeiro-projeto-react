import React, { useState, useEffect, FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import api from '../../services/api';
import logoImg from '../../assets/logo.svg';
import { Title, Form, Repositories, Error } from './styles';

// criar a tipagem (declaração) apenas dos campos que serão utilizados da API, e não todos.
interface Repository {
    full_name: string;
    description: string;
    owner: {
        login: string;
        avatar_url: string;
    }
}

// FC (Function Component) = Um componente escrito como função
const Dashboard: React.FC = () => {
    const [newRepo, setNewRepo] = useState('');
    const [inputError, setInputError] = useState('');
    const [repositories, setRepositories] = useState<Repository[]>(() => {
        const storagedRepositories = localStorage.getItem('@GithubExplorer:repositories');

        if (storagedRepositories)
            return JSON.parse(storagedRepositories);
        else
            return [];
    });

    useEffect(() => { localStorage.setItem('@GithubExplorer:repositories', 
        JSON.stringify(repositories)) }, [repositories]);

    async function handleAddRepository(event: FormEvent): Promise<void> {
        event.preventDefault();
        // Adição de um novo Repositório
        // Consumir API do Github
        // Salvar novo Repositório no estado
        
        if (!newRepo) {
            setInputError('Digite o autor/nome do repositório');
            return;
        }
        
        try{
            const response = await api.get<Repository>(`repos/${newRepo}`);
            // inserindo a tipagem no get<Repository>, torna-se possível acessar os elementos internos,
            // do retorno da api conforme a interface criada. Ex.: response.data.owner.login

            const repository = response.data;

            setRepositories([...repositories, repository]);
            setNewRepo('');
            setInputError('');
        }
        catch {
            setInputError('Erro na busca por esse repositório');
        }
    }

    return (
    <>
        <img src={logoImg} alt="GitHub Explorer"/>
        <Title>Explore repositórios no Github</Title>

        {/* Boolean(variavel) ou !!variavel são similares, transformam uma variável em boleano */}
        <Form hasError={!!inputError} onSubmit={handleAddRepository}>
            <input 
                value={newRepo}
                onChange={(e) => setNewRepo(e.target.value)}
                placeholder='Digite o nome do repositório'
            ></input>
            <button type="submit">Pesquisar</button>
        </Form>

        {/* inputError está servindo como if, se possui valor true, senão false */}
        { inputError && <Error>{inputError}</Error> }

        <Repositories>
            {repositories.map(repository => (
                <Link key={repository.full_name} to={`/repository/${repository.full_name}`}>
                    <img src={repository.owner.avatar_url} alt={repository.owner.login} />
                    <div>
                        <strong>{repository.full_name}</strong>
                        <p>{repository.description}</p>
                    </div>

                    <FiChevronRight size={20} />
                </Link>
            ))}
        </Repositories>
    </>
    );
};

export default Dashboard;