import { withClientState } from 'apollo-link-state';
import flow from 'lodash/fp/flow';
import assignIn from 'lodash/fp/assignIn';
import map from 'lodash/fp/map';
import reduce from 'lodash/fp/reduce';
import { store as todoStore } from './TodoStore';

const reduceWithDefault = reduce.convert({
  cap: false
});

/**
 * At a given attribute this will merge all objects
 * in a list of objects found at that attribute.
 *
 * Example
 * const objectList = [
 *   {defaults: {x: true}},
 *   {defaults: {y: "foo"}},
 *   {defaults: {z: 123}}
 * ]
 *
 * // returns {x: true, y: "foo", z: 123}
 * mergeGet("defaults")(objectList)
 */
const mergeGet = attributeName =>
  flow(
    map(attributeName),
    reduceWithDefault(assignIn, {})
  );

/**
 * Locals Data Stores
 */

const STORES = [todoStore];

/**
 * Map the Mutation handlers and Default Values of our local state to
 * the Apollo cache.
 */
const CreateClientStore = cache => {
  const defaults = mergeGet('defaults')(STORES);
  const mutations = mergeGet('mutations')(STORES);

  return withClientState({
    cache,
    defaults,
    resolvers: {
      Mutation: mutations
    }
  });
};

export default CreateClientStore;
