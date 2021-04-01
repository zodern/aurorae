import { _addStory } from './client.js';

export function addStory(name, template, args) {
  return _addStory({
    name,
    component: template,
    args,
    type: 'blaze'
  });
}
