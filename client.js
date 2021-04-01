import Sidebar from './sidebar.svelte';
import './styles.css';
import './hmr-integration';

let sidebarContainer;
let shadowContent;
let content;
let sidebar;

const styles = `
  :host {
    all: initial;
  }

  div {
    width: 100%;
    display: inline-block;
    background: #EEE;
    height: 100%;
    font-size: 14px;
  }

  h1 {
    padding-left: 20px;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li.group {
    border-top: 2px solid #DDD;
    margin: 5px 0;
  }


  li.story {
    padding: 5px 20px;
    cursor: pointer;
    border-left: 4px solid transparent;
  }

  li.story:hover {
    background: #DBD8EA;
  }

  li.selected {
    font-weight: bold;
    border-left: 4px solid #8f84c4;
  }
`;

const stories = Object.create(null);
let selected = null;
let componentType = null;;
let component = null;

function showSelected(story) {
  selected = story;
  
  sidebar.$set({ selected })
  destroyComponent();
  createComponent();
}

function destroyComponent() {
  if (!component) {
    return;
  }

  switch(componentType) {
    case 'svelte':
      component.$destroy();
      break;

    case 'blaze':
      import { Blaze } from 'meteor/blaze';
      Blaze.remove(component);
      break;

    case 'react':
      import ReactDOM from 'react-dom';
      ReactDOM.unmountComponentAtNode(content);
      break;

    default:
      throw new Error('Unknown component type');
  }

  component = null;
  componentType = null;
}

function createComponent() {
  componentType = selected.type;
  switch (componentType) {
    case 'svelte':
      component = new selected.component({
        target: content,
        props: selected.args
      });
      break;

    case 'blaze':
      import { Blaze } from 'meteor/blaze';
      component = Blaze.renderWithData(
        selected.component,
        selected.args,
        content
      );
      break;

    case 'react':
      import ReactDOM from 'react-dom';
      import React from 'react';
      component = ReactDOM.render(
        React.createElement(selected.component, selected.args, null),
        content,
      );
      break;

    default:
      throw new Error('Unknown component type');
  }
}

export function showStories() {
  if (sidebarContainer) {
    // already shown
    return;
  }

  sidebarContainer = document.createElement('div');
  sidebarContainer.id = 'METEOR_STORIES-container'
  document.body.append(sidebarContainer);

  var sidebarWrapper = document.createElement('div');
  sidebarWrapper.id = "METEOR_STORIES-sidebar-wrapper";
  sidebarContainer.appendChild(sidebarWrapper);

  content = document.createElement('div');
  content.id = 'METEOR_STORIES-content';
  sidebarContainer.appendChild(content);

  shadowContent = document.createElement('div');
  shadowContent.classList.add('container');

  let shadow = sidebarWrapper.attachShadow({ mode: 'open' });
  shadow.appendChild(shadowContent);

  let style = document.createElement('style');
  style.textContent = styles;
  shadow.appendChild(style);

  sidebar = new Sidebar({
    target: shadowContent,
    props: {
      stories,
      onStory(story) {
        showSelected(story);
      },
      selected
    }
  });
}

export function _addStory({ name, component, type, args}) {
  stories[name] = {
    name,
    component,
    type,
    args
  };

  if (sidebar) {
    sidebar.$set({ stories });
    if (selected && selected.name === name) {
      showSelected(stories[name]);
    }
  }
}

if (window.location.pathname === '/__meteor-aurorae') {
  showStories();
}
