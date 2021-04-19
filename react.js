import { _addStory, addComponentType } from './client.js';

addComponentType('react', {
  create(selected, contentEl) {
    import ReactDOM from 'react-dom';
    import React from 'react';
    let wrapper = selected.wrapper || (({ children }) => children);

    return ReactDOM.render(
      wrapper({
        children: React.createElement(selected.component, selected.args, null)
      }),
      contentEl,
    );
  },
  destroy(component, contentEl) {
    import ReactDOM from 'react-dom';
    ReactDOM.unmountComponentAtNode(contentEl);
  }
});

export function addStory(name, component, args) {
  return _addStory({
    name,
    component,
    args,
    type: 'react'
  });
}
