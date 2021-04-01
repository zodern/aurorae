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
let componentType = null;
let component = null;
let wrapper = null;

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
      if (wrapper) {
        Blaze.remove(wrapper);
      }
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
  wrapper = null;
}

function createComponent() {
  componentType = selected.type;
  switch (componentType) {
    case 'svelte': {
        let selectedComponent = selected.component;
        let props = selected.args;
        if (selected.wrapper) {
          selectedComponent = selected.wrapper;
          props = {
            props: selected.args,
            component: selected.component
          };
        }
        component = new selectedComponent({
          target: content,
          props
        });
      }
      break;

    case 'blaze': {
        import { Blaze } from 'meteor/blaze';
        let parent = content;
        if (selected.wrapper) {
          wrapper = Blaze.render(
            selected.wrapper,
            parent
          );
          parent = document.getElementById('story-blaze-content');
          if (!parent) {
            console.error('Wrapper for Blaze stories must have an element with the "story-blaze-content" id');
          }
        }
        component = Blaze.renderWithData(
          selected.component,
          selected.args,
          parent,
          null,
          wrapper,
        );
      }
      break;

    case 'react': {
        import ReactDOM from 'react-dom';
        import React from 'react';
        let wrapper = selected.wrapper || (({children}) => children);

        component = ReactDOM.render(
          wrapper({
            children:React.createElement(selected.component, selected.args, null)
          }),
          content,
        );
      }
      break;

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
  const config = {
    name,
    component,
    type,
    args,
    wrapper: null,
  };
  stories[name] = config;

  if (sidebar) {
    setTimeout(() => {
      sidebar.$set({ stories });
      if (selected && selected.name === name) {
        showSelected(config);
      }
    });
  }

  return {
    wrap(wrapper) {
      config.wrapper = wrapper;
    }
  };
}

if (window.location.pathname === '/__meteor-aurorae') {
  showStories();
}
