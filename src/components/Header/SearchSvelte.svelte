<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { ALGOLIA } from '../../consts';
  import '@docsearch/css';
  import '../../styles/search.scss';
  import * as docSearchReact from '@docsearch/react';

  // FIXME: This is still kinda nasty, but DocSearch is not ESM ready.
  const DocSearchModal = docSearchReact.DocSearchModal || (docSearchReact as any).default.DocSearchModal;
  const useDocSearchKeyboardEvents = docSearchReact.useDocSearchKeyboardEvents || (docSearchReact as any).default.useDocSearchKeyboardEvents;

  let isOpen = false;
  let searchButtonRef: HTMLButtonElement;
  let initialQuery = '';
  let modalContainer: HTMLDivElement;

  function onOpen() {
    isOpen = true;
  }

  function onClose() {
    isOpen = false;
  }

  function onInput(e: KeyboardEvent) {
    isOpen = true;
    initialQuery = e.key;
  }

  onMount(() => {
    const { destroy } = useDocSearchKeyboardEvents({
      isOpen,
      onOpen,
      onClose,
      onInput,
      searchButtonRef,
    });

    return destroy;
  });

  $: if (isOpen) {
    modalContainer = document.createElement('div');
    document.body.appendChild(modalContainer);
  } else if (modalContainer) {
    document.body.removeChild(modalContainer);
    modalContainer = null;
  }

  onDestroy(() => {
    if (modalContainer) {
      document.body.removeChild(modalContainer);
    }
  });
</script>

<button
  type="button"
  bind:this={searchButtonRef}
  on:click={onOpen}
  class="search-input"
>
  <svg width="24" height="24" fill="none">
    <path
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>

  <span>Search</span>

  <span class="search-hint">
    <span class="sr-only">Press </span>

    <kbd>/</kbd>

    <span class="sr-only"> to search</span>
  </span>
</button>

{#if isOpen && modalContainer}
  <svelte:component
    this={DocSearchModal}
    initialQuery={initialQuery}
    initialScrollY={window.scrollY}
    onClose={onClose}
    indexName={ALGOLIA.indexName}
    appId={ALGOLIA.appId}
    apiKey={ALGOLIA.apiKey}
    transformItems={(items) => {
      return items.map((item) => {
        // We transform the absolute URL into a relative URL to
        // work better on localhost, preview URLS.
        const a = document.createElement('a');
        a.href = item.url;
        const hash = a.hash === '#overview' ? '' : a.hash;
        return {
          ...item,
          url: `${a.pathname}${hash}`
        };
      });
    }}
  />
{/if}
