<script setup lang="ts">
import { watch } from 'vue';
import { QuillEditor } from 'vue-quill-next';
import QuillCursors from 'quill-cursors';
import type Delta from 'quill-delta';
import { useUsersStore, type CursorRange } from '../stores/users';
import { useDocumentStore } from '../stores/document';

const props = defineProps<{
  userName: string;
}>();

const usersStore = useUsersStore();
const documentStore = useDocumentStore();

const modules = {
  name: 'cursors',
  module: QuillCursors,
};

function onReady(quill: any) {
  const cursors = quill.getModule('cursors') as QuillCursors;
  usersStore.register(props.userName);

  quill.on('selection-change', (range: CursorRange, _old: CursorRange, source: string) => {
    if (source !== 'user') return;
    usersStore.setCursor(props.userName, range);
  });

  quill.on('text-change', (delta: Delta, _old: Delta, source: string) => {
    if (source !== 'user') return;
    documentStore.publish(props.userName, delta);
    usersStore.setCursor(props.userName, quill.getSelection());
  });

  let applied = 0;
  watch(
    () => documentStore.ops.length,
    (len) => {
      while (applied < len) {
        const op = documentStore.ops[applied++];
        if (op.origin !== props.userName) {
          quill.updateContents(op.delta, 'silent');
        }
      }
    },
    { immediate: true },
  );

  // Cursors createCursor is not idempotent
  const seen = new Set<string>();
  watch(
    () => usersStore.users,
    (users) => {
      for (const userName in users) {
        if (userName === props.userName) continue;
        const user = users[userName];
        const prev = seen.has(userName);
        if (!prev) {
          cursors.createCursor(userName, userName, user.color);
        }
        if (user.range) {
          cursors.moveCursor(userName, user.range);
        }
      }
    },
    { deep: true, immediate: true },
  );
}
</script>

<template>
  <div class="flex-1">
    <div class="text-lg font-bold">{{ props.userName }}</div>
    <QuillEditor :modules="modules" theme="snow" @ready="onReady" />
  </div>
</template>

<style scoped>
@reference "tailwindcss";
:deep(.ql-editor) {
  @apply pt-6;
}
</style>