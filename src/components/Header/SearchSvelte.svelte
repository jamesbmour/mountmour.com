<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';

  const dispatch = createEventDispatcher();

  let searchQuery = '';
  let inputElement: HTMLInputElement;
  let isInputFocused = false;

  onMount(() => {
    const handleGlobalKeydown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputElement) {
        e.preventDefault();
        focusInput();
      }
    };

    window.addEventListener('keydown', handleGlobalKeydown);

    return () => {
      window.removeEventListener('keydown', handleGlobalKeydown);
    };
  });

  function handleInput() {
    dispatch('input', searchQuery);
  }

  function handleSubmit() {
    dispatch('submit', searchQuery);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  }

  function focusInput() {
    inputElement.focus();
  }

  function handleFocus() {
    isInputFocused = true;
  }

  function handleBlur() {
    isInputFocused = false;
  }
</script>

<div class="relative w-full max-w-md">
  <div class="relative group">
    <input
      bind:this={inputElement}
      bind:value={searchQuery}
      on:input={handleInput}
      on:keydown={handleKeydown}
      on:focus={handleFocus}
      on:blur={handleBlur}
      type="text"
      placeholder="Press / to Search..."
      class="w-full py-3 pl-12 pr-4 text-gray-700 placeholder-gray-400 transition-all duration-300 ease-in-out bg-white border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
    <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none transition-all duration-300 ease-in-out {isInputFocused ? 'text-blue-500' : 'text-gray-400'}">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
    </div>
    {#if searchQuery}
      <button
        on:click={() => { searchQuery = ''; focusInput(); }}
        class="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 transition-colors duration-200 hover:text-gray-600"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    {/if}
  </div>
  <!-- <div class="absolute mt-2 text-xs text-gray-400 right-3">
    Press <kbd class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">/</kbd> to search
  </div> -->
</div>