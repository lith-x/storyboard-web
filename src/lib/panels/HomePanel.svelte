<script lang="ts">
  /*
  New project - open message box for name, attributes, sound file, etc.
                with an ok/cancel
  Open project - open file browser to look for files that have been produced
                 by "Export" functionality
  Import - open file browser, allow user to select any file/directory to be imported
           into the "files" section,
  Export - save some compressed filetype that includes all files, scripts, and potentially
           some information about the application state (current time, layout data, etc.)
  */
</script>

<div class="flex flex-col items-start p-8 text-4xl">
  <button class="flex-1 cursor-pointer text-left pb-3">New project</button>
  <button class="flex-1 cursor-pointer text-left pb-3">Open project</button>
  <button class="flex-1 cursor-pointer text-left pb-3">Import</button>
  <button class="flex-1 cursor-pointer text-left pb-3">Export</button>
</div>
