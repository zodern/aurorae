import { _addStory } from './client.js';

export function addStory(name, component, args) {
  return _addStory({
    name,
    component,
    args,
    type: 'react'
  });
}
