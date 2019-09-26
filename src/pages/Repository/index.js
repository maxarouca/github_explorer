/* eslint-disable react/static-property-placement */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import api from '../../services/api';

import Container from '../../components/Container';
import { Loading, Owner, IssueList } from './styles';

class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string
      })
    }).isRequired
  };

  state = {
    repository: {},
    issues: [],
    loading: true
  };

  async componentDidMount() {
    const { match } = this.props;
    const repo = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repo}`),
      api.get(`/repos/${repo}/issues`, {
        params: {
          status: 'open',
          per_page: 5
        }
      })
    ]);

    await this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false
    });
  }

  render() {
    const { match } = this.props;
    const { repository, issues, loading } = this.state;

    if (loading) {
      return <Loading>Carregando...</Loading>;
    }

    return (
      <Container>
        <Link to="/">Voltar aos repositorios</Link>
        <Owner>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>

        <IssueList>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url} target="_blank">
                    {issue.title}
                  </a>
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>
      </Container>
    );
  }
}

export default Repository;
