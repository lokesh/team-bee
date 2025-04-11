import { createApp } from 'vue'

const eventBus = {
    install(app) {
        app.config.globalProperties.$eventBus = {
            emit(event, ...args) {
                app.config.globalProperties.$emit(event, ...args)
            },
            on(event, callback) {
                app.config.globalProperties.$on(event, callback)
            },
            off(event, callback) {
                app.config.globalProperties.$off(event, callback)
            }
        }
    }
}

export default eventBus 