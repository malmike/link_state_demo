import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import compose from 'recompose/compose';

/**
 * Defaults
 */
const todoDefaults = {
  currentTodos: []
};

/**
 * Graphql
 */
const todoQuery = gql`
  query GetTodo {
    currentTodos @client
  }
`;

const clearTodoQuery = gql`
  mutation clearTodo {
    clearTodo @client
  }
`;

const addTodoQuery = gql`
  mutation addTodo($item: String) {
    addTodo(item: $item) @client
  }
`;

/**
 * Cache Mutations
 */
const addTodo = (_obj, { item }, { cache }) => {
  const query = todoQuery;
  const { currentTodos } = cache.readQuery({
    query
  });
  const updatedTodos = currentTodos.concat(item);
  cache.writeQuery({
    query,
    data: {
      currentTodos: updatedTodos
    }
  });

  return null;
};

const clearTodo = (_obj, _args, { cache }) => {
  cache.writeQuery({
    query: todoQuery,
    data: todoDefaults
  });
  return null;
};

/**
 * Store
 */

/**
 * The Store object used to construct
 * Apollo Link State's Client State
 */
const store = {
  defaults: todoDefaults,
  mutations: {
    addTodo,
    clearTodo
  }
};

/**
 * Helpers
 */
const todoQueryHandler = {
  props: ({ ownProps, data: { currentTodos = [] } }) => ({
    ...ownProps,
    currentTodos
  })
};

const withTodo = compose(
  graphql(todoQuery, todoQueryHandler),
  graphql(addTodoQuery, {
    name: 'addTodoMutation'
  }),
  graphql(clearTodoQuery, {
    name: 'clearTodoMutation'
  })
);

export { store, withTodo };
