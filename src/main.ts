import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { QuillEditor } from 'vue-quill-next'
import 'vue-quill-next/dist/vue-quill.snow.css';

const app = createApp(App)
app.component('QuillEditor', QuillEditor)
app.mount('#app')
